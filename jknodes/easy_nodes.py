import math
import numpy as np
from torch import Tensor
import os
import sys
import torch
import torch.nn.functional as F
from ultralytics import YOLO
import comfy.sd
import comfy.samplers
import comfy.model_patcher
import comfy.model_management
import comfy.utils
import folder_paths
from typing import Literal
import inspect
from nodes import MAX_RESOLUTION, ComfyNodeABC, InputTypeDict, IO
from PIL import Image, ImageOps, ImageDraw, ImageFont

import nodes
from nodes import LatentUpscaleBy, ImageScaleBy, ConditioningAverage, ConditioningCombine, ConditioningConcat
from comfy_extras.nodes_upscale_model import ImageUpscaleWithModel, UpscaleModelLoader

this_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.append(os.path.dirname(this_dir))

from jknodes import utils

log = utils.JKLogger

model_path = folder_paths.models_dir
utils.add_folder_path_and_extensions(
    "ultralytics_bbox",
    [os.path.join(model_path, "ultralytics", "bbox")],
    folder_paths.supported_pt_extensions,
)
utils.add_folder_path_and_extensions(
    "ultralytics_segm",
    [os.path.join(model_path, "ultralytics", "segm")],
    folder_paths.supported_pt_extensions,
)
utils.add_folder_path_and_extensions(
    "ultralytics",
    [os.path.join(model_path, "ultralytics")],
    folder_paths.supported_pt_extensions,
)

ExtraConditioningModes = ["replace", "combine", "concat", "average"]


class EasyHRFix(ComfyNodeABC):
    default_latent_upscalers = LatentUpscaleBy.INPUT_TYPES()["required"]["upscale_method"][0]
    latent_upscalers = default_latent_upscalers + ["lanczos"]
    pixel_upscalers = folder_paths.get_filename_list("upscale_models")

    @classmethod
    def INPUT_TYPES(cls) -> InputTypeDict:
        return {
            "required": {
                "model": (IO.MODEL, ),
                "clip": (IO.CLIP, ),
                "vae": (
                    "VAE",
                    {"tooltip": "The VAE model used for decoding the latent."},
                ),
                "seed": (
                    IO.INT,
                    {
                        "default": 0,
                        "min": 0,
                        "max": 0xFFFFFFFFFFFFFFFF,
                        "tooltip": "The random seed used for creating the noise.",
                    },
                ),
                "steps": (
                    IO.INT,
                    {
                        "default": 20,
                        "min": 1,
                        "max": 10000,
                        "tooltip": "The number of steps used in the denoising process.",
                    },
                ),
                "cfg": (
                    IO.FLOAT,
                    {
                        "default": 8.0,
                        "min": 0.0,
                        "max": 100.0,
                        "step": 0.1,
                        "round": 0.01,
                        "tooltip": "The Classifier-Free Guidance scale balances creativity and adherence to the prompt. Higher values result in images more closely matching the prompt however too high values will negatively impact quality.",
                    },
                ),
                "sampler_name": (
                    comfy.samplers.KSampler.SAMPLERS,
                    {
                        "tooltip": "The algorithm used when sampling, this can affect the quality, speed, and style of the generated output."
                    },
                ),
                "scheduler": (
                    comfy.samplers.KSampler.SCHEDULERS,
                    {"tooltip": "The scheduler controls how noise is gradually removed to form the image."},
                ),
                "positive": (
                    IO.CONDITIONING,
                    {"tooltip": "The conditioning describing the attributes you want to include in the image."},
                ),
                "negative": (
                    IO.CONDITIONING,
                    {"tooltip": "The conditioning describing the attributes you want to exclude from the image."},
                ),
                "upscale_by": (
                    IO.FLOAT,
                    {"default": 1.5, "min": 1.05, "max": 4.0, "step": 0.05},
                ),
                "latent_image": (IO.LATENT, ),
                "denoise": (
                    IO.FLOAT,
                    {"default": 0.5, "min": 0.00, "max": 1.00, "step": 0.01},
                ),
                "latent_upscaler": (cls.latent_upscalers, {"default": "lanczos"}),
                "pixel_upscaler": (cls.pixel_upscalers, ),
                "noise_mode": (["GPU(=A1111)", "CPU"], {"default": "GPU(=A1111)"}),
                "inject_extra_noise": (["disable", "enable"], {"default": "enable"}),
                "extra_noise_strength": (
                    IO.FLOAT,
                    {"default": 2.5, "min": 0.00, "max": 100, "step": 0.1},
                ),
            },
            "optional": {
                "extra_positive_text": (
                    IO.STRING,
                    {
                        "default": "",
                        "multiline": True,
                        "dynamicPrompts": False,
                        "tooltip": "if non empty, will be encoded and used depending on the value of extra_positive_conditioning_mode",
                    },
                ),
                "extra_positive_conditioning_mode": (ExtraConditioningModes, {"default": "replace"}),
                "extra_negative_text": (
                    IO.STRING,
                    {
                        "default": "",
                        "multiline": True,
                        "dynamicPrompts": False,
                        "tooltip": "if non empty, will be encoded and used depending on the value of extra_negative_conditioning_mode",
                    },
                ),
                "extra_negative_conditioning_mode": (ExtraConditioningModes, {"default": "replace"}),
            },
        }

    RETURN_TYPES = (IO.LATENT, )
    RETURN_NAMES = (IO.LATENT, )
    FUNCTION = "apply"
    CATEGORY = "JK Comfy Helpers"

    def apply(
        self,
        model: comfy.model_patcher.ModelPatcher,
        clip: comfy.sd.CLIP,
        vae: comfy.sd.VAE,
        seed: int,
        steps: int,
        cfg: float,
        sampler_name: str,
        scheduler: str,
        positive,
        negative,
        upscale_by: float,
        latent_image: Tensor,
        denoise: float,
        latent_upscaler: str,
        pixel_upscaler: str,
        noise_mode: Literal["GPU(=A1111)", "CPU"],
        inject_extra_noise: Literal["disable", "enable"],
        extra_noise_strength: float,
        extra_positive_text: str,
        extra_positive_conditioning_mode: Literal["replace", "combine", "concat", "average"],
        extra_negative_text: str,
        extra_negative_conditioning_mode: Literal["replace", "combine", "concat", "average"],
    ):
        if "KSampler //Inspire" not in nodes.NODE_CLASS_MAPPINGS:
            raise Exception("[ERROR] You need to install 'ComfyUI-Inspire-Pack'")
        if extra_positive_text != "" or extra_negative_text != "":
            if "ImpactWildcardEncode" not in nodes.NODE_CLASS_MAPPINGS:
                raise Exception("[ERROR] You need to install 'ComfyUI-Impact-Pack'")

        size = latent_image["samples"].shape
        inject_noise = inject_extra_noise == "enable"

        if inject_noise and extra_noise_strength > 0:
            if "BNK_NoisyLatentImage" in nodes.NODE_CLASS_MAPPINGS and "BNK_InjectNoise" in nodes.NODE_CLASS_MAPPINGS:
                NoisyLatentImage = nodes.NODE_CLASS_MAPPINGS["BNK_NoisyLatentImage"]
                InjectNoise = nodes.NODE_CLASS_MAPPINGS["BNK_InjectNoise"]
                noise = NoisyLatentImage().create_noisy_latents(noise_mode, seed, size[3] * 8, size[2] * 8, size[0])[0]
                latent_image = InjectNoise().inject_noise(latent_image, extra_noise_strength, noise)[0]

            else:
                raise Exception("'BNK_NoisyLatentImage', 'BNK_InjectNoise' nodes are not installed.")

        low_res = utils.vae_decode_latent(vae, latent_image)
        pixel_upscale_model = UpscaleModelLoader().load_model(pixel_upscaler)[0]

        # pixel upscale
        image = ImageUpscaleWithModel().upscale(pixel_upscale_model, low_res)[0]

        # downscale it to target size
        downsize_scale = upscale_by / pixel_upscale_model.scale
        if downsize_scale != 1:
            image = ImageScaleBy().upscale(image, latent_upscaler, downsize_scale)[0]

        upscaled_samples = utils.vae_encode_image(vae, image)

        model_use = model
        pos_cond_use = positive
        neg_cond_use = negative

        if extra_positive_text != "":
            encoder_node = nodes.NODE_CLASS_MAPPINGS["ImpactWildcardEncode"]
            (_model, _clip, cond, encoded_text) = encoder_node().doit(
                model=model,
                clip=clip,
                wildcard_text=extra_positive_text,
                populated_text=extra_positive_text,
                seed=seed,
            )
            match extra_positive_conditioning_mode:
                case 'average':
                    pos_cond_use = ConditioningAverage().addWeighted(cond, positive, 0.5)[0]
                case 'combine':
                    pos_cond_use = ConditioningCombine().combine(positive, cond)[0]
                case 'concat':
                    pos_cond_use = ConditioningConcat().concat(positive, cond)[0]
                case 'replace':
                    pos_cond_use = cond
                case _:
                    raise Exception(f'[ERROR] Unrecognized extra_positive_conditioning_mode "{extra_positive_conditioning_mode}"')

            model_use = _model
        if extra_negative_text != "":
            encoder_node = nodes.NODE_CLASS_MAPPINGS["ImpactWildcardEncode"]
            (_, _, cond, encoded_text) = encoder_node().doit(
                model=model,
                clip=clip,
                wildcard_text=extra_negative_text,
                populated_text=extra_negative_text,
                seed=seed,
            )
            match extra_negative_conditioning_mode:
                case 'average':
                    neg_cond_use = ConditioningAverage().addWeighted(cond, negative, 0.5)[0]
                case 'combine':
                    neg_cond_use = ConditioningCombine().combine(negative, cond)[0]
                case 'concat':
                    neg_cond_use = ConditioningConcat().concat(negative, cond)[0]
                case 'replace':
                    neg_cond_use = cond
                case _:
                    raise Exception(f'[ERROR] Unrecognized extra_negative_conditioning_mode "{extra_negative_conditioning_mode}"')

        inspire_sampler = nodes.NODE_CLASS_MAPPINGS["KSampler //Inspire"]
        # img2img with gpu noise like a1111
        samples = inspire_sampler.doit(
            model_use,
            seed,
            steps,
            cfg,
            sampler_name,
            scheduler,
            pos_cond_use,
            neg_cond_use,
            upscaled_samples,
            denoise,
            noise_mode,
            "comfy",
        )[0]

        return (samples, )


class EasyHRFix_Context(ComfyNodeABC):
    default_latent_upscalers = EasyHRFix.default_latent_upscalers
    latent_upscalers = EasyHRFix.latent_upscalers
    pixel_upscalers = EasyHRFix.pixel_upscalers

    @classmethod
    def INPUT_TYPES(cls) -> InputTypeDict:
        return {
            "required": {
                "ctx": ("JK_CONTEXT", ),
                "upscale_by": (
                    IO.FLOAT,
                    {"default": 1.5, "min": 1.05, "max": 4.0, "step": 0.05},
                ),
                "denoise": (
                    IO.FLOAT,
                    {"default": 0.5, "min": 0.00, "max": 1.00, "step": 0.01},
                ),
                "latent_upscaler": (cls.latent_upscalers, {"default": "lanczos"}),
                "pixel_upscaler": (cls.pixel_upscalers, ),
                "noise_mode": (["GPU(=A1111)", "CPU"], {"default": "GPU(=A1111)"}),
                "inject_extra_noise": (["disable", "enable"], {"default": "enable"}),
                "extra_noise_strength": (
                    IO.FLOAT,
                    {"default": 2.5, "min": 0.00, "max": 100, "step": 0.1},
                ),
            },
            "optional": {
                "extra_positive_text": (
                    IO.STRING,
                    {
                        "default": "",
                        "multiline": True,
                        "dynamicPrompts": False,
                        "tooltip": "if non empty, will be encoded and used depending on the value of extra_positive_conditioning_mode",
                    },
                ),
                "extra_positive_conditioning_mode": (ExtraConditioningModes, {"default": "replace"}),
                "extra_negative_text": (
                    IO.STRING,
                    {
                        "default": "",
                        "multiline": True,
                        "dynamicPrompts": False,
                        "tooltip": "if non empty, will be encoded and used depending on the value of extra_negative_conditioning_mode",
                    },
                ),
                "extra_negative_conditioning_mode": (ExtraConditioningModes, {"default": "replace"}),
                "bleh_sampler_override": (
                    utils.BLEH_PRESET_LIST,
                    {"tooltip": "optional bleh sampler preset override", "default": "disabled"},
                ),
            },
        }

    RETURN_TYPES = (IO.LATENT, )
    RETURN_NAMES = (IO.LATENT, )
    FUNCTION = "apply"
    CATEGORY = "JK Comfy Helpers"

    def apply(self,
              ctx,
              upscale_by: float,
              denoise: float,
              latent_upscaler: str,
              pixel_upscaler: str,
              noise_mode: Literal["GPU(=A1111)", "CPU"],
              inject_extra_noise: Literal["disable", "enable"],
              extra_noise_strength: float,
              extra_positive_text: str,
              extra_positive_conditioning_mode: Literal["replace", "combine", "concat", "average"],
              extra_negative_text: str,
              extra_negative_conditioning_mode: Literal["replace", "combine", "concat", "average"],
              bleh_sampler_override: str = 'disabled'):
        model_use = ctx["model"]
        clip_use = ctx["clip"]
        sampler_use = bleh_sampler_override if bleh_sampler_override != 'disabled' else ctx['sampler']

        if extra_positive_text != "" and extra_negative_conditioning_mode == 'replace':
            model_use = ctx["base_model"]
            clip_use = ctx["base_clip"]

        ret = EasyHRFix().apply(model_use, clip_use, ctx['vae'], ctx['seed'], ctx['step_refiner'], ctx['cfg'], sampler_use, ctx['scheduler'], ctx['positive'], ctx['negative'], upscale_by, ctx['latent'], denoise, latent_upscaler, pixel_upscaler, noise_mode, inject_extra_noise, extra_noise_strength, extra_positive_text, extra_positive_conditioning_mode, extra_negative_text, extra_negative_conditioning_mode)

        return ret


class JKEasyDetailer(ComfyNodeABC):
    RETURN_TYPES = (
        IO.IMAGE,
        "SEGS",
    )
    RETURN_NAMES = (IO.IMAGE, "SEGS")
    FUNCTION = "apply"
    CATEGORY = "JK Comfy Helpers"

    bboxs = ["bbox/" + x for x in folder_paths.get_filename_list("ultralytics_bbox")]
    segms = ["segm/" + x for x in folder_paths.get_filename_list("ultralytics_segm")]
    detectors = bboxs + segms

    last_yolo: YOLO = None
    last_detector: str = ""
    last_segs_args: str = ""
    last_segs = None

    @classmethod
    def INPUT_TYPES(s) -> InputTypeDict:
        return {
            "required": {
                IO.IMAGE: (IO.IMAGE, ),
                "detector": (s.detectors, ),
                "model": (IO.MODEL, ),
                "clip": (IO.CLIP, ),
                "vae": ("VAE", ),
                "seed": (IO.INT, {"default": 0, "min": 0, "max": 0xFFFFFFFFFFFFFFFF}),
                "steps": (IO.INT, {"default": 20, "min": 1, "max": 10000}),
                "cfg": (
                    IO.FLOAT,
                    {
                        "default": 8.0,
                        "min": 0.0,
                        "max": 100.0,
                        "step": 0.1,
                        "round": 0.01,
                    },
                ),
                "sampler_name": (comfy.samplers.KSampler.SAMPLERS, ),
                "scheduler": (comfy.samplers.KSampler.SCHEDULERS, ),
                "positive": (IO.CONDITIONING, ),
                "negative": (IO.CONDITIONING, ),
                "denoise": (
                    IO.FLOAT,
                    {"default": 0.5, "min": 0.0001, "max": 1.0, "step": 0.01},
                ),
                "threshold": (
                    IO.FLOAT,
                    {"default": 0.5, "min": 0.0, "max": 1.0, "step": 0.01},
                ),
                "dilation": (
                    IO.INT,
                    {"default": 10, "min": -512, "max": 512, "step": 1},
                ),
                "crop_factor": (
                    IO.FLOAT,
                    {"default": 3.0, "min": 1.0, "max": 100, "step": 0.1},
                ),
                "drop_size": (
                    IO.INT,
                    {"min": 1, "max": MAX_RESOLUTION, "step": 1, "default": 10},
                ),
                "feather": (IO.INT, {"default": 5, "min": 0, "max": 100, "step": 1}),
                "noise_mask": (
                    IO.BOOLEAN,
                    {"default": True, "label_on": "enabled", "label_off": "disabled"},
                ),
                "force_inpaint": (
                    IO.BOOLEAN,
                    {"default": True, "label_on": "enabled", "label_off": "disabled"},
                ),
                "guide_size": (
                    IO.FLOAT,
                    {"default": 512, "min": 64, "max": MAX_RESOLUTION, "step": 8},
                ),
                "guide_size_for": (
                    IO.BOOLEAN,
                    {"default": True, "label_on": "bbox", "label_off": "crop_region"},
                ),
                "max_size": (
                    IO.FLOAT,
                    {"default": 1024, "min": 64, "max": MAX_RESOLUTION, "step": 8},
                ),
                "noise_mask_feather": (
                    IO.INT,
                    {"default": 20, "min": 0, "max": 100, "step": 1},
                ),
                "iterations": (IO.INT, {"default": 1, "min": 1, "max": 10, "step": 1}),
            },
            "optional": {
                "detailer_hook": (
                    "DETAILER_HOOK",
                    {"tooltip": "Optional detailer hook from impact pack"},
                ),
                "extra_positive_text": (
                    IO.STRING,
                    {
                        "default": "",
                        "multiline": True,
                        "dynamicPrompts": False,
                        "tooltip": "if non empty, will be encoded and used depending on the value of extra_positive_conditioning_mode",
                    },
                ),
                "extra_positive_conditioning_mode": (ExtraConditioningModes, {"default": "replace"}),
                "extra_negative_text": (
                    IO.STRING,
                    {
                        "default": "",
                        "multiline": True,
                        "dynamicPrompts": False,
                        "tooltip": "if non empty, will be encoded and used depending on the value of extra_negative_conditioning_mode",
                    },
                ),
                "extra_negative_conditioning_mode": (ExtraConditioningModes, {"default": "replace"}),
            },
        }

    def apply(
        self,
        image: Tensor,
        detector: str,
        model: comfy.model_patcher.ModelPatcher,
        clip: comfy.sd.CLIP,
        vae: comfy.sd.VAE,
        seed: int,
        steps: int,
        cfg: float,
        sampler_name: str,
        scheduler: str,
        positive,
        negative,
        denoise: float,
        threshold: float,
        dilation: int,
        crop_factor: float,
        drop_size: int,
        feather: int,
        noise_mask: bool,
        force_inpaint: bool,
        guide_size: float,
        guide_size_for: bool,
        max_size: float,
        noise_mask_feather: int,
        iterations: int,
        detailer_hook=None,
        extra_positive_text: str = '',
        extra_positive_conditioning_mode: Literal["replace", "combine", "concat", "average"] = 'replace',
        extra_negative_text: str = '',
        extra_negative_conditioning_mode: Literal["replace", "combine", "concat", "average"] = 'replace',
    ):
        if "DetailerForEach" not in nodes.NODE_CLASS_MAPPINGS:
            raise Exception("[ERROR] You need to install 'ComfyUI-Impact-Pack'")
        if "UltralyticsDetectorProvider" not in nodes.NODE_CLASS_MAPPINGS:
            raise Exception("[ERROR] You need to install 'ComfyUI-Impact-Pack'")
        if "BboxDetectorSEGS" not in nodes.NODE_CLASS_MAPPINGS:
            raise Exception("[ERROR] You need to install 'ComfyUI-Impact-Pack'")
        if "SegmDetectorSEGS" not in nodes.NODE_CLASS_MAPPINGS:
            raise Exception("[ERROR] You need to install 'ComfyUI-Impact-Pack'")
        if "ImpactWildcardEncode" not in nodes.NODE_CLASS_MAPPINGS:
            raise Exception("[ERROR] You need to install 'ComfyUI-Impact-Pack'")

        provider_loader = nodes.NODE_CLASS_MAPPINGS["UltralyticsDetectorProvider"]()
        bbox_detector_node = nodes.NODE_CLASS_MAPPINGS["BboxDetectorSEGS"]
        segm_detector_node = nodes.NODE_CLASS_MAPPINGS["SegmDetectorSEGS"]
        detailer_node = nodes.NODE_CLASS_MAPPINGS["DetailerForEach"]
        encoder_node = nodes.NODE_CLASS_MAPPINGS["ImpactWildcardEncode"]

        model_use = model
        clip_use = clip
        pos_cond_use = positive
        neg_cond_use = negative

        if extra_positive_text != "":
            (_model, _clip, cond, encoded_text) = encoder_node().doit(
                model=model,
                clip=clip,
                wildcard_text=extra_positive_text,
                populated_text=extra_positive_text,
                seed=seed,
            )
            match extra_positive_conditioning_mode:
                case 'average':
                    pos_cond_use = ConditioningAverage().addWeighted(cond, positive, 0.5)[0]
                case 'combine':
                    pos_cond_use = ConditioningCombine().combine(positive, cond)[0]
                case 'concat':
                    pos_cond_use = ConditioningConcat().concat(positive, cond)[0]
                case 'replace':
                    pos_cond_use = cond
                case _:
                    raise Exception(f'[ERROR] Unrecognized extra_positive_conditioning_mode "{extra_positive_conditioning_mode}"')

            model_use = _model
            clip_use = _clip
            pos_cond_use = cond
        if extra_negative_text != "":
            (_, _, cond, encoded_text) = encoder_node().doit(
                model=model,
                clip=clip,
                wildcard_text=extra_negative_text,
                populated_text=extra_negative_text,
                seed=seed,
            )
            match extra_negative_conditioning_mode:
                case 'average':
                    neg_cond_use = ConditioningAverage().addWeighted(cond, negative, 0.5)[0]
                case 'combine':
                    neg_cond_use = ConditioningCombine().combine(negative, cond)[0]
                case 'concat':
                    neg_cond_use = ConditioningConcat().concat(negative, cond)[0]
                case 'replace':
                    neg_cond_use = cond
                case _:
                    raise Exception(f'[ERROR] Unrecognized extra_negative_conditioning_mode "{extra_negative_conditioning_mode}"')

        path_toclass = inspect.getfile(provider_loader.__class__)
        if path_toclass not in sys.path:
            sys.path.append(os.path.dirname(path_toclass))
        # import from impact subpack
        from subcore import UltraBBoxDetector, UltraSegmDetector, load_yolo

        if self.last_yolo is not None and self.last_detector == detector:
            log.info("using cached yolo model")
        else:
            detector_full_path = folder_paths.get_full_path("ultralytics", detector)
            self.last_yolo = load_yolo(detector_full_path)
            self.last_detector = detector

        segs_args = detector + "_" + str(threshold) + "_" + str(dilation) + "_" + str(crop_factor) + "_" + str(drop_size) + "_" + str(
            id(image))
        print(segs_args)
        if self.last_segs is not None and self.last_segs_args == segs_args:
            log.info("using cached segs")
        else:
            has_segm = self.last_yolo.task == "segment"
            detector_inst = UltraSegmDetector(self.last_yolo) if has_segm else UltraBBoxDetector(self.last_yolo)
            detector_node_to_use = segm_detector_node() if has_segm else bbox_detector_node()
            self.last_segs = detector_node_to_use.doit(detector_inst, image, threshold, dilation, crop_factor, drop_size, "all")

        self.last_segs_args = segs_args

        enhanced_img, *_ = detailer_node.do_detail(
            image,
            self.last_segs[0],
            model_use,
            clip_use,
            vae,
            guide_size,
            guide_size_for,
            max_size,
            seed,
            steps,
            cfg,
            sampler_name,
            scheduler,
            pos_cond_use,
            neg_cond_use,
            denoise,
            feather,
            noise_mask,
            force_inpaint,
            "",
            detailer_hook=detailer_hook,
            cycle=iterations,
            inpaint_model=force_inpaint,
            noise_mask_feather=noise_mask_feather,
            scheduler_func_opt=None,
        )

        return (
            enhanced_img,
            self.last_segs[0],
        )


class JKEasyDetailer_Context(ComfyNodeABC):
    RETURN_TYPES = (IO.IMAGE, "SEGS", "JK_CONTEXT")
    RETURN_NAMES = (IO.IMAGE, "SEGS", "CTX")
    FUNCTION = "apply"
    CATEGORY = "JK Comfy Helpers"

    @classmethod
    def INPUT_TYPES(s) -> InputTypeDict:
        return {
            "required": {
                "ctx": ("JK_CONTEXT", ),
                "detector": (JKEasyDetailer.detectors, ),
                "denoise": (
                    IO.FLOAT,
                    {"default": 0.5, "min": 0.0001, "max": 1.0, "step": 0.01},
                ),
                "cfg": (
                    IO.FLOAT,
                    {
                        "default": 8.0,
                        "min": 0.0,
                        "max": 100.0,
                        "step": 0.1,
                        "round": 0.01,
                        "tooltip": "The Classifier-Free Guidance scale balances creativity and adherence to the prompt. Higher values result in images more closely matching the prompt however too high values will negatively impact quality.",
                    },
                ),
                "threshold": (
                    IO.FLOAT,
                    {"default": 0.5, "min": 0.0, "max": 1.0, "step": 0.01},
                ),
                "dilation": (
                    IO.INT,
                    {"default": 10, "min": -512, "max": 512, "step": 1},
                ),
                "crop_factor": (
                    IO.FLOAT,
                    {"default": 3.0, "min": 1.0, "max": 100, "step": 0.1},
                ),
                "drop_size": (
                    IO.INT,
                    {"min": 1, "max": MAX_RESOLUTION, "step": 1, "default": 10},
                ),
                "feather": (IO.INT, {"default": 5, "min": 0, "max": 100, "step": 1}),
                "noise_mask": (
                    IO.BOOLEAN,
                    {"default": True, "label_on": "enabled", "label_off": "disabled"},
                ),
                "force_inpaint": (
                    IO.BOOLEAN,
                    {"default": True, "label_on": "enabled", "label_off": "disabled"},
                ),
                "guide_size": (
                    IO.FLOAT,
                    {"default": 512, "min": 64, "max": MAX_RESOLUTION, "step": 8},
                ),
                "guide_size_for": (
                    IO.BOOLEAN,
                    {"default": True, "label_on": "bbox", "label_off": "crop_region"},
                ),
                "max_size": (
                    IO.FLOAT,
                    {"default": 1024, "min": 64, "max": MAX_RESOLUTION, "step": 8},
                ),
                "noise_mask_feather": (
                    IO.INT,
                    {"default": 20, "min": 0, "max": 100, "step": 1},
                ),
                "iterations": (IO.INT, {"default": 1, "min": 1, "max": 10, "step": 1}),
            },
            "optional": {
                "detailer_hook": (
                    "DETAILER_HOOK",
                    {"tooltip": "Optional detailer hook from impact pack"},
                ),
                "extra_positive_text": (
                    IO.STRING,
                    {
                        "default": "",
                        "multiline": True,
                        "dynamicPrompts": False,
                        "tooltip": "if non empty, will be encoded and used depending on the value of extra_positive_conditioning_mode",
                    },
                ),
                "extra_positive_conditioning_mode": (ExtraConditioningModes, {"default": "replace"}),
                "extra_negative_text": (
                    IO.STRING,
                    {
                        "default": "",
                        "multiline": True,
                        "dynamicPrompts": False,
                        "tooltip": "if non empty, will be encoded and used depending on the value of extra_negative_conditioning_mode",
                    },
                ),
                "extra_negative_conditioning_mode": (ExtraConditioningModes, {"default": "replace"}),
                "bleh_sampler_override": (
                    utils.BLEH_PRESET_LIST,
                    {"tooltip": "optional bleh sampler preset override", "default": "disabled"},
                ),
            },
        }

    def apply(self,
              ctx: dict,
              detector: str,
              denoise: float,
              cfg: float,
              threshold: float,
              dilation: int,
              crop_factor: float,
              drop_size: int,
              feather: int,
              noise_mask: bool,
              force_inpaint: bool,
              guide_size: float,
              guide_size_for: bool,
              max_size: float,
              noise_mask_feather: int,
              iterations: int,
              detailer_hook=None,
              extra_positive_text="",
              extra_positive_conditioning_mode: Literal["replace", "combine", "concat", "average"] = 'replace',
              extra_negative_text="",
              extra_negative_conditioning_mode: Literal["replace", "combine", "concat", "average"] = 'replace',
              bleh_sampler_override: str = 'disabled'):
        model_use = ctx["model"]
        clip_use = ctx["clip"]
        sampler_use = bleh_sampler_override if bleh_sampler_override != 'disabled' else ctx['sampler']

        if extra_positive_text != "" and extra_positive_conditioning_mode == 'replace':
            model_use = ctx["base_model"]
            clip_use = ctx["base_clip"]

        (image, segs) = JKEasyDetailer().apply(ctx["images"], detector, model_use, clip_use, ctx["vae"], ctx["seed"], ctx["steps"], cfg, sampler_use, ctx["scheduler"], ctx["positive"], ctx["negative"], denoise, threshold, dilation, crop_factor, drop_size, feather, noise_mask, force_inpaint, guide_size, guide_size_for, max_size, noise_mask_feather, iterations, detailer_hook, extra_positive_text, extra_negative_conditioning_mode, extra_negative_text, extra_negative_conditioning_mode)

        # add new image to ctx
        new_ctx = ctx.copy()
        new_ctx["images"] = image

        return (
            image,
            segs,
            new_ctx,
        )


class JKEasyCheckpointLoader(ComfyNodeABC):

    @classmethod
    def INPUT_TYPES(s) -> InputTypeDict:
        return {"required": {
            "ckpt_name": (folder_paths.get_filename_list("checkpoints"), ),
        }}

    RETURN_TYPES = (
        IO.MODEL,
        IO.CLIP,
        "VAE",
        folder_paths.get_filename_list("checkpoints"),
        folder_paths.get_filename_list("checkpoints"),
    )
    RETURN_NAMES = (IO.MODEL, IO.CLIP, "VAE", "CKPT_NAME_FULL", "CKPT_NAME")
    FUNCTION = "load_checkpoint"

    CATEGORY = "JK Comfy Helpers/Loaders"

    def load_checkpoint(self, ckpt_name):
        ckpt_path = folder_paths.get_full_path("checkpoints", ckpt_name)
        out = comfy.sd.load_checkpoint_guess_config(
            ckpt_path,
            output_vae=True,
            output_clip=True,
            embedding_directory=folder_paths.get_folder_paths("embeddings"),
        )
        return (
            out[0],
            out[1],
            out[2],
            ckpt_name,
            os.path.splitext(os.path.basename(ckpt_name))[0],
        )


class JKEasyKSampler_Context(ComfyNodeABC):

    @classmethod
    def INPUT_TYPES(cls) -> InputTypeDict:
        return {
            "required": {
                "ctx": ("JK_CONTEXT", ),
                "denoise": (
                    IO.FLOAT,
                    {"default": 1.0, "min": 0.00, "max": 1.00, "step": 0.01},
                ),
                "noise_mode": (["GPU(=A1111)", "CPU"], {"default": "GPU(=A1111)"}),
                "variation_seed": (IO.INT, {"default": 0, "min": 0, "max": 0xffffffffffffffff}),
                "variation_strength": (IO.FLOAT, {"default": 0.0, "min": 0.0, "max": 1.0, "step": 0.01}),
            },
            "optional": {
                "bleh_sampler_override": (
                    utils.BLEH_PRESET_LIST,
                    {"tooltip": "optional bleh sampler preset override", "default": "disabled"},
                ),
                "variation_method": (["linear", "slerp"], ),
            },
        }

    RETURN_TYPES = (IO.LATENT, "JK_CONTEXT")
    RETURN_NAMES = (IO.LATENT, "JK_CONTEXT")
    FUNCTION = "apply"
    CATEGORY = "JK Comfy Helpers"

    def apply(self,
              ctx,
              denoise: float,
              noise_mode: Literal["GPU(=A1111)", "CPU"],
              variation_seed: int,
              variation_strength: float,
              bleh_sampler_override: str = 'disabled',
              variation_method="linear"):
        if "KSampler //Inspire" not in nodes.NODE_CLASS_MAPPINGS:
            raise Exception("[ERROR] You need to install 'ComfyUI-Inspire-Pack'")
        inspire_sampler = nodes.NODE_CLASS_MAPPINGS["KSampler //Inspire"]

        sampler_use = bleh_sampler_override if bleh_sampler_override != 'disabled' else ctx['sampler']

        samples = inspire_sampler.doit(ctx['model'], ctx['seed'], ctx['steps'], ctx['cfg'], sampler_use, ctx['scheduler'], ctx['positive'], ctx['negative'], ctx['latent'], denoise, noise_mode, "comfy", variation_seed, variation_strength, variation_method)[0]

        new_ctx = ctx.copy()
        new_ctx["latent"] = samples

        return (
            samples,
            new_ctx,
        )


class JKEasyWatermark(ComfyNodeABC):

    def __init__(self):
        self.watermark_x = None
        self.watermark_y = None
        self.text_x = None
        self.text_y = None
        self.x_direction = -1
        self.y_direction = -1
        self.rotation = 0
        self.previous_resolution = None

    @staticmethod
    def INPUT_TYPES() -> InputTypeDict:
        return {
            "required": {"image": (IO.IMAGE, )}, "optional": {
                "logo_image": (IO.IMAGE, ),
                "mask": (IO.MASK, ),
                "watermark_text": (IO.STRING, {"multiline": False, "default": "", "lazy": True}),
                "font": (IO.STRING, {"default": "assets/fonts/DMSans-VariableFont_opsz,wght.ttf"}),
                "font_size": (IO.INT, {"default": 16, "min": 1, "max": 256, "step": 1}),
                "logo_scale_percentage": (IO.INT, {"default": 30, "min": 1, "max": 100, "step": 1}),
                "x_padding": (IO.INT, {"default": 20, "min": 0, "max": MAX_RESOLUTION, "step": 5}),
                "y_padding": (IO.INT, {"default": 20, "min": 0, "max": MAX_RESOLUTION, "step": 5}),
                "opacity": (IO.FLOAT, {"default": 40, "min": 0, "max": 100, "step": 5}),
                "position": (['topleft', 'bottomleft', 'topright', 'bottomright'], {"default": 'bottomright'}),
            }
        }

    RETURN_TYPES = (IO.IMAGE, )
    OUTPUT_IS_LIST = (True, )
    FUNCTION = "execute"
    CATEGORY = "JK Comfy Helpers"

    def execute(self,
                image,
                logo_image=None,
                mask=None,
                watermark_text=None,
                font=None,
                font_size=16,
                logo_scale_percentage=30,
                x_padding=20,
                y_padding=20,
                opacity=40,
                position: Literal['topleft', 'bottomleft', 'topright', 'bottomright'] = 'bottomright'):

        # Fallbacks for missing inputs
        logo_image = logo_image if logo_image is not None else self.generate_empty_image(1, 1)
        watermark_text = watermark_text if watermark_text is not None else ""

        # Get image and logo sizes
        image_count, image_height, image_width = self.get_image_size(image)
        watermark_width = self.calculate_watermark_width(image_width, logo_scale_percentage)
        resized_logo_image, resized_logo_width, resized_logo_height = self.resize_logo(logo_image, watermark_width)

        # Prepare text opacity and font size
        text_opacity = self.calculate_text_opacity(opacity)
        font_size = self.adjust_font_size(image_width, font_size)

        # Initialize watermark and text positions if not provided
        self.initialize_positions(image_width, image_height, resized_logo_width, resized_logo_height, font_size if watermark_text != '' else 0, x_padding, y_padding, position)

        # Watermarking loop
        x_direction, y_direction = self.x_direction, self.y_direction
        images = self.apply_watermark_to_images(image, resized_logo_image, resized_logo_width, resized_logo_height, watermark_text, font, font_size, text_opacity, opacity, logo_image, mask, x_padding, y_padding, image_width, image_height, x_direction, y_direction)

        # Update directions after the loop
        self.x_direction, self.y_direction = x_direction, y_direction

        return (images, )

    # Helper methods

    def calculate_watermark_width(self, image_width, logo_scale_percentage):
        # Calculates the width of the watermark based on the image width and logo scale percentage.
        return math.ceil(image_width * logo_scale_percentage / 100)

    def resize_logo(self, logo_image, watermark_width):
        # Resizes the logo image to match the specified watermark width while maintaining the logo's aspect ratio.

        logo_image_count, logo_image_height, logo_image_width = self.get_image_size(logo_image)
        resized_logo_image = self.resize_watermark_image(logo_image, logo_image_height, logo_image_width, watermark_width)
        resized_logo_count, resized_logo_height, resized_logo_width = self.get_image_size(resized_logo_image)
        return resized_logo_image, resized_logo_width, resized_logo_height

    def calculate_text_opacity(self, opacity):
        # Calculates text opacity based on input opacity to match watermark image
        return int((100 - opacity) * 255 / 100)

    def adjust_font_size(self, image_width, font_size):
        # Adjusts font size to match bigger resolutions
        width_baseline = 800
        return int(image_width / width_baseline * font_size)

    def initialize_positions(self, image_width, image_height, resized_logo_width, resized_logo_height, font_size, x_padding, y_padding, position: Literal['topleft', 'bottomleft', 'topright', 'bottomright']):

        if position == 'topleft':
            self.watermark_x = x_padding
            self.watermark_y = y_padding + font_size
        elif position == 'topright':
            self.watermark_x = image_width - resized_logo_width - x_padding
            self.watermark_y = y_padding + font_size
        elif position == 'bottomleft':
            self.watermark_x = x_padding
            self.watermark_y = image_height - resized_logo_height - y_padding - font_size
        else:
            # bottomright
            self.watermark_x = image_width - resized_logo_width - x_padding
            self.watermark_y = image_height - resized_logo_height - y_padding - font_size

        if position == 'topleft':
            self.text_x = x_padding
            self.text_y = y_padding
        elif position == 'topright':
            self.text_x = image_width - x_padding
            self.text_y = y_padding
        elif position == 'bottomleft':
            self.text_x = x_padding
            self.text_y = image_height - y_padding
        else:
            # bottomright
            self.text_x = image_width - x_padding
            self.text_y = image_height - y_padding

    def apply_watermark_to_images(self, image, resized_logo_image, resized_logo_width, resized_logo_height, watermark_text, font, font_size, text_opacity, opacity, logo_image, mask, x_padding, y_padding, image_width, image_height, x_direction, y_direction):

        images = []
        for idx, image in enumerate(image):
            # Apply text and logo to the image
            image, text_width = self.draw_watermark_text(image, watermark_text, font_size, self.text_x, self.text_y, font, text_opacity)
            watermarked_image = self.add_logo_image(image, resized_logo_image, self.watermark_x, self.watermark_y, opacity, self.rotation, mask)

            images.append(watermarked_image)

        return images

    def generate_empty_image(self, width, height, batch_size=1):
        # Create a fully transparent image (RGBA with 0 alpha)
        r = torch.full([batch_size, height, width, 1], 0.0)
        g = torch.full([batch_size, height, width, 1], 0.0)
        b = torch.full([batch_size, height, width, 1], 0.0)
        a = torch.full([batch_size, height, width, 1], 0.0)

        # Concatenate all channels to form RGBA (4 channels)
        return (torch.cat((r, g, b, a), dim=-1))

    def get_image_size(self, image):
        # Returns image's batch amount, height and width
        return (image.shape[0], image.shape[1], image.shape[2])

    def resize_watermark_image(self, logo_image, original_logo_height, original_logo_width, logo_width):
        if logo_width <= 0:
            logo_width = MAX_RESOLUTION if original_logo_height < MAX_RESOLUTION else original_logo_width

        # Calculate resize ratio
        ratio = min(logo_width / original_logo_width, MAX_RESOLUTION / original_logo_height)
        new_width = round(original_logo_width * ratio)
        new_height = round(original_logo_height * ratio)

        # Resize the logo image
        resized_logo_image = logo_image.permute(0, 3, 1, 2)  # Change to (N, C, H, W)
        resized_logo_image = F.interpolate(resized_logo_image, size=(new_height, new_width), mode="nearest")
        resized_logo_image = resized_logo_image.permute(0, 2, 3, 1)  # Change back to (N, H, W, C)
        resized_logo_image = torch.clamp(resized_logo_image, 0, 1)  # Ensure values are within [0, 1]

        return resized_logo_image

    def draw_watermark_text(self, image_tensor, text, font_size, pos_x, pos_y, font_path, text_opacity):

        # Convert the PyTorch tensor to a NumPy array and scale to uint8
        image_pil = Image.fromarray(np.clip(image_tensor.cpu().numpy().squeeze() * 255, 0, 255).astype(np.uint8)).convert('RGBA')

        # Create a transparent layer for the text
        transparent_layer = Image.new('RGBA', image_pil.size, (0, 0, 0, 0))

        # Set text color with opacity
        text_color = (255, 255, 255, text_opacity)

        # Initialize drawing context
        draw = ImageDraw.Draw(transparent_layer)

        # Load the specified font or fall back to the default font
        try:
            font = ImageFont.truetype(font_path, font_size)
        except (IOError, OSError):
            print(f"Font '{font_path}' not found. Using the default font.")
            font = ImageFont.load_default()

        # Calculate text dimensions
        text_width = draw.textlength(text, font=font)

        # Adjust position to align text to the bottom-right corner
        pos_x = max(0, pos_x - text_width)
        pos_y = max(0, pos_y - font_size)

        # Draw the text on the image
        draw.text((pos_x, pos_y), text, fill=text_color, font=font)

        # Merge the image and text layer
        image_pil_with_text = Image.alpha_composite(image_pil, transparent_layer).convert('RGB')

        # Convert the result back to tensor and return with text width
        image_tensor = torch.from_numpy(np.array(image_pil_with_text).astype(np.float32) / 255.0).unsqueeze(0)
        return image_tensor, text_width

    def add_logo_image(self, image_tensor, logo_image_tensor, watermark_x, watermark_y, opacity, rotation, mask=None):

        # Convert image and logo image to PIL
        image_pil = Image.fromarray(np.clip(image_tensor.cpu().numpy().squeeze() * 255, 0, 255).astype(np.uint8))
        logo_image_pil = Image.fromarray(
            np.clip(logo_image_tensor.cpu().numpy().squeeze() * 255, 0, 255).astype(np.uint8)).convert('RGBA')

        # Rotate the logo image
        logo_image_pil = logo_image_pil.rotate(rotation, expand=True)

        # Apply the mask (if provided)
        if mask is not None:
            mask_pil = Image.fromarray(np.clip(mask.cpu().numpy().squeeze() * 255, 0, 255).astype(np.uint8)).resize(logo_image_pil.size)
            logo_image_pil.putalpha(ImageOps.invert(mask_pil))

        _, _, _, alpha = logo_image_pil.split()
        alpha = alpha.point(lambda x: int(x * (1 - opacity / 100)))
        logo_image_pil.putalpha(alpha)

        # Paste the logo onto the image
        image_pil.paste(logo_image_pil, (watermark_x, watermark_y), logo_image_pil)

        # Convert the result back to tensor and return
        image_tensor = torch.from_numpy(np.array(image_pil).astype(np.float32) / 255.0).unsqueeze(0)
        return image_tensor


class JKEasyUpscaleImage(ComfyNodeABC):

    @classmethod
    def INPUT_TYPES(s) -> InputTypeDict:

        resampling_methods = ["lanczos", "nearest", "bilinear", "bicubic"]

        return {
            "required": {
                "image": ("IMAGE", ),
                "upscale_model": (folder_paths.get_filename_list("upscale_models"), ),
                "min_dim": ("INT", {"default": 1024, "min": 1, "max": 48000, "step": 1}),
                "resampling_method": (resampling_methods, ),
                "supersample": (["true", "false"], ),
                "rounding_modulus": ("INT", {"default": 8, "min": 8, "max": 1024, "step": 8}),
            }
        }

    RETURN_TYPES = ("IMAGE", )
    RETURN_NAMES = ("IMAGE", )
    FUNCTION = "upscale"
    CATEGORY = "JK Comfy Helpers"

    # from comfy roll
    def apply_resize_image(self, image: Image.Image,
                           width: int,
                           height: int,
                           rounding_modulus,
                           supersample='true',
                           resample='bicubic'):

        m = rounding_modulus
        new_width = width if width % m == 0 else width + (m - width % m)
        new_height = height if height % m == 0 else height + (m - height % m)

        # Define a dictionary of resampling filters
        resample_filters = {'nearest': 0, 'bilinear': 2, 'bicubic': 3, 'lanczos': 1}

        # Apply supersample
        if supersample == 'true':
            image = image.resize((new_width * 8, new_height * 8), resample=Image.Resampling(resample_filters[resample]))

        # Resize the image using the given resampling filter
        resized_image = image.resize((new_width, new_height), resample=Image.Resampling(resample_filters[resample]))

        return resized_image

    def upscale(self,
                image,
                upscale_model,
                rounding_modulus=8,
                supersample='true',
                resampling_method="lanczos",
                min_dim=1024):

        pil_img = utils.tensor2pil(image[0])
        original_width, original_height = pil_img.size

        if original_width >= min_dim and original_height >= min_dim:
            return (image, )

        use_width = original_width <= original_height
        up_model = UpscaleModelLoader().load_model(upscale_model)[0]
        up_image = ImageUpscaleWithModel().upscale(up_model, image)[0]
        
        original_ratio = original_height / original_width

        # Get new size
        pil_img = utils.tensor2pil(up_image[0])
        upscaled_width, upscaled_height = pil_img.size

        # rescale it down until its smallest side is min dim calculate downsize scale
        downsize_scale = 1
        if use_width:
            downsize_scale = original_width / min_dim
        else:
            downsize_scale = original_height / min_dim

        if downsize_scale == 1:
            return (up_image[0], )
        else:
            if use_width:
                original_ratio = original_height / original_width
                new_width = min_dim
                new_height = int(float(new_width) * original_ratio)
            else:
                original_ratio = original_width / original_height
                new_height = min_dim
                new_width = int(float(new_height) * original_ratio)

            ret = utils.pil2tensor(
                self.apply_resize_image(utils.tensor2pil(up_image), new_width, new_height, rounding_modulus, supersample, resampling_method))
            return (ret, )


NODE_CLASS_MAPPINGS = {
    "EasyHRFix": EasyHRFix, "JKEasyUpscaleImage": JKEasyUpscaleImage, "EasyHRFix_Context": EasyHRFix_Context, "JKEasyDetailer": JKEasyDetailer, "JKEasyDetailer_Context": JKEasyDetailer_Context, "JKEasyCheckpointLoader": JKEasyCheckpointLoader, "JKEasyKSampler_Context": JKEasyKSampler_Context, "JKEasyWatermark": JKEasyWatermark
}
NODE_DISPLAY_NAME_MAPPINGS = {
    "EasyHRFix": "JK Easy HiRes Fix", "JKEasyUpscaleImage": "JK Easy Upscale (If needed)", "EasyHRFix_Context": "JK Easy HiRes Fix (Context)", "JKEasyDetailer": "JK Easy Detailer", "JKEasyDetailer_Context": "JK Easy Detailer (Context)", "JKEasyCheckpointLoader": "JK Easy Checkpoint Loader", "JKEasyKSampler_Context": "JK Easy KSampler (Context)", "JKEasyWatermark": "JK Easy Watermark"
}
