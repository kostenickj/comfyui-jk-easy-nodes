from torch import Tensor
import os
import sys
from ultralytics import YOLO
import comfy.sd
import comfy.samplers
import comfy.model_patcher
import comfy.model_management
import comfy.utils
import folder_paths
from typing import Literal
import inspect
from nodes import MAX_RESOLUTION

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


class EasyHRFix:
    default_latent_upscalers = LatentUpscaleBy.INPUT_TYPES()["required"]["upscale_method"][0]
    latent_upscalers = default_latent_upscalers + ["lanczos"]
    pixel_upscalers = folder_paths.get_filename_list("upscale_models")

    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "model": ("MODEL", ),
                "clip": ("CLIP", ),
                "vae": (
                    "VAE",
                    {"tooltip": "The VAE model used for decoding the latent."},
                ),
                "seed": (
                    "INT",
                    {
                        "default": 0,
                        "min": 0,
                        "max": 0xFFFFFFFFFFFFFFFF,
                        "tooltip": "The random seed used for creating the noise.",
                    },
                ),
                "steps": (
                    "INT",
                    {
                        "default": 20,
                        "min": 1,
                        "max": 10000,
                        "tooltip": "The number of steps used in the denoising process.",
                    },
                ),
                "cfg": (
                    "FLOAT",
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
                    "CONDITIONING",
                    {"tooltip": "The conditioning describing the attributes you want to include in the image."},
                ),
                "negative": (
                    "CONDITIONING",
                    {"tooltip": "The conditioning describing the attributes you want to exclude from the image."},
                ),
                "upscale_by": (
                    "FLOAT",
                    {"default": 1.5, "min": 1.05, "max": 4.0, "step": 0.05},
                ),
                "latent_image": ("LATENT", ),
                "denoise": (
                    "FLOAT",
                    {"default": 0.5, "min": 0.00, "max": 1.00, "step": 0.01},
                ),
                "latent_upscaler": (cls.latent_upscalers, {"default": "lanczos"}),
                "pixel_upscaler": (cls.pixel_upscalers, ),
                "noise_mode": (["GPU(=A1111)", "CPU"], {"default": "GPU(=A1111)"}),
                "inject_extra_noise": (["disable", "enable"], {"default": "enable"}),
                "extra_noise_strength": (
                    "FLOAT",
                    {"default": 2.5, "min": 0.00, "max": 100, "step": 0.1},
                ),
            },
            "optional": {
                "extra_positive_text": (
                    "STRING",
                    {
                        "default": "",
                        "multiline": True,
                        "dynamicPrompts": False,
                        "tooltip": "if non empty, will be encoded and used depending on the value of extra_positive_conditioning_mode",
                    },
                ),
                "extra_positive_conditioning_mode": (ExtraConditioningModes, {"default": "replace"}),
                "extra_negative_text": (
                    "STRING",
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

    RETURN_TYPES = ("LATENT", )
    RETURN_NAMES = ("LATENT", )
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


class EasyHRFix_Context:
    default_latent_upscalers = EasyHRFix.default_latent_upscalers
    latent_upscalers = EasyHRFix.latent_upscalers
    pixel_upscalers = EasyHRFix.pixel_upscalers

    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "ctx": ("JK_CONTEXT", ),
                "upscale_by": (
                    "FLOAT",
                    {"default": 1.5, "min": 1.05, "max": 4.0, "step": 0.05},
                ),
                "denoise": (
                    "FLOAT",
                    {"default": 0.5, "min": 0.00, "max": 1.00, "step": 0.01},
                ),
                "latent_upscaler": (cls.latent_upscalers, {"default": "lanczos"}),
                "pixel_upscaler": (cls.pixel_upscalers, ),
                "noise_mode": (["GPU(=A1111)", "CPU"], {"default": "GPU(=A1111)"}),
                "inject_extra_noise": (["disable", "enable"], {"default": "enable"}),
                "extra_noise_strength": (
                    "FLOAT",
                    {"default": 2.5, "min": 0.00, "max": 100, "step": 0.1},
                ),
            },
            "optional": {
                "extra_positive_text": (
                    "STRING",
                    {
                        "default": "",
                        "multiline": True,
                        "dynamicPrompts": False,
                        "tooltip": "if non empty, will be encoded and used depending on the value of extra_positive_conditioning_mode",
                    },
                ),
                "extra_positive_conditioning_mode": (ExtraConditioningModes, {"default": "replace"}),
                "extra_negative_text": (
                    "STRING",
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
                    {
                        "tooltip": "optional bleh sampler preset override", "default": "disabled"
                    },
                ),
            },
        }

    RETURN_TYPES = ("LATENT", )
    RETURN_NAMES = ("LATENT", )
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


class JKEasyDetailer:
    RETURN_TYPES = (
        "IMAGE",
        "SEGS",
    )
    RETURN_NAMES = ("IMAGE", "SEGS")
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
    def INPUT_TYPES(s):
        return {
            "required": {
                "image": ("IMAGE", ),
                "detector": (s.detectors, ),
                "model": ("MODEL", ),
                "clip": ("CLIP", ),
                "vae": ("VAE", ),
                "seed": ("INT", {"default": 0, "min": 0, "max": 0xFFFFFFFFFFFFFFFF}),
                "steps": ("INT", {"default": 20, "min": 1, "max": 10000}),
                "cfg": (
                    "FLOAT",
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
                "positive": ("CONDITIONING", ),
                "negative": ("CONDITIONING", ),
                "denoise": (
                    "FLOAT",
                    {"default": 0.5, "min": 0.0001, "max": 1.0, "step": 0.01},
                ),
                "threshold": (
                    "FLOAT",
                    {"default": 0.5, "min": 0.0, "max": 1.0, "step": 0.01},
                ),
                "dilation": (
                    "INT",
                    {"default": 10, "min": -512, "max": 512, "step": 1},
                ),
                "crop_factor": (
                    "FLOAT",
                    {"default": 3.0, "min": 1.0, "max": 100, "step": 0.1},
                ),
                "drop_size": (
                    "INT",
                    {"min": 1, "max": MAX_RESOLUTION, "step": 1, "default": 10},
                ),
                "feather": ("INT", {"default": 5, "min": 0, "max": 100, "step": 1}),
                "noise_mask": (
                    "BOOLEAN",
                    {"default": True, "label_on": "enabled", "label_off": "disabled"},
                ),
                "force_inpaint": (
                    "BOOLEAN",
                    {"default": True, "label_on": "enabled", "label_off": "disabled"},
                ),
                "guide_size": (
                    "FLOAT",
                    {"default": 512, "min": 64, "max": MAX_RESOLUTION, "step": 8},
                ),
                "guide_size_for": (
                    "BOOLEAN",
                    {"default": True, "label_on": "bbox", "label_off": "crop_region"},
                ),
                "max_size": (
                    "FLOAT",
                    {"default": 1024, "min": 64, "max": MAX_RESOLUTION, "step": 8},
                ),
                "noise_mask_feather": (
                    "INT",
                    {"default": 20, "min": 0, "max": 100, "step": 1},
                ),
                "iterations": ("INT", {"default": 1, "min": 1, "max": 10, "step": 1}),
            },
            "optional": {
                "detailer_hook": (
                    "DETAILER_HOOK",
                    {"tooltip": "Optional detailer hook from impact pack"},
                ),
                "extra_positive_text": (
                    "STRING",
                    {
                        "default": "",
                        "multiline": True,
                        "dynamicPrompts": False,
                        "tooltip": "if non empty, will be encoded and used depending on the value of extra_positive_conditioning_mode",
                    },
                ),
                "extra_positive_conditioning_mode": (ExtraConditioningModes, {"default": "replace"}),
                "extra_negative_text": (
                    "STRING",
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


class JKEasyDetailer_Context:
    RETURN_TYPES = ("IMAGE", "SEGS", "JK_CONTEXT")
    RETURN_NAMES = ("IMAGE", "SEGS", "CTX")
    FUNCTION = "apply"
    CATEGORY = "JK Comfy Helpers"

    @classmethod
    def INPUT_TYPES(s):
        return {
            "required": {
                "ctx": ("JK_CONTEXT", ),
                "detector": (JKEasyDetailer.detectors, ),
                "denoise": (
                    "FLOAT",
                    {"default": 0.5, "min": 0.0001, "max": 1.0, "step": 0.01},
                ),
                "cfg": (
                    "FLOAT",
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
                    "FLOAT",
                    {"default": 0.5, "min": 0.0, "max": 1.0, "step": 0.01},
                ),
                "dilation": (
                    "INT",
                    {"default": 10, "min": -512, "max": 512, "step": 1},
                ),
                "crop_factor": (
                    "FLOAT",
                    {"default": 3.0, "min": 1.0, "max": 100, "step": 0.1},
                ),
                "drop_size": (
                    "INT",
                    {"min": 1, "max": MAX_RESOLUTION, "step": 1, "default": 10},
                ),
                "feather": ("INT", {"default": 5, "min": 0, "max": 100, "step": 1}),
                "noise_mask": (
                    "BOOLEAN",
                    {"default": True, "label_on": "enabled", "label_off": "disabled"},
                ),
                "force_inpaint": (
                    "BOOLEAN",
                    {"default": True, "label_on": "enabled", "label_off": "disabled"},
                ),
                "guide_size": (
                    "FLOAT",
                    {"default": 512, "min": 64, "max": MAX_RESOLUTION, "step": 8},
                ),
                "guide_size_for": (
                    "BOOLEAN",
                    {"default": True, "label_on": "bbox", "label_off": "crop_region"},
                ),
                "max_size": (
                    "FLOAT",
                    {"default": 1024, "min": 64, "max": MAX_RESOLUTION, "step": 8},
                ),
                "noise_mask_feather": (
                    "INT",
                    {"default": 20, "min": 0, "max": 100, "step": 1},
                ),
                "iterations": ("INT", {"default": 1, "min": 1, "max": 10, "step": 1}),
            },
            "optional": {
                "detailer_hook": (
                    "DETAILER_HOOK",
                    {"tooltip": "Optional detailer hook from impact pack"},
                ),
                "extra_positive_text": (
                    "STRING",
                    {
                        "default": "",
                        "multiline": True,
                        "dynamicPrompts": False,
                        "tooltip": "if non empty, will be encoded and used depending on the value of extra_positive_conditioning_mode",
                    },
                ),
                "extra_positive_conditioning_mode": (ExtraConditioningModes, {"default": "replace"}),
                "extra_negative_text": (
                    "STRING",
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
                    {
                        "tooltip": "optional bleh sampler preset override", "default": "disabled"
                    },
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


# this only exists because the comfy types system is annoying
class JKEasyCheckpointLoader:

    @classmethod
    def INPUT_TYPES(s):
        return {"required": {
            "ckpt_name": (folder_paths.get_filename_list("checkpoints"), ),
        }}

    RETURN_TYPES = (
        "MODEL",
        "CLIP",
        "VAE",
        folder_paths.get_filename_list("checkpoints"),
        folder_paths.get_filename_list("checkpoints"),
    )
    RETURN_NAMES = ("MODEL", "CLIP", "VAE", "CKPT_NAME_FULL", "CKPT_NAME")
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


NODE_CLASS_MAPPINGS = {
    "EasyHRFix": EasyHRFix,
    "EasyHRFix_Context": EasyHRFix_Context,
    "JKEasyDetailer": JKEasyDetailer,
    "JKEasyDetailer_Context": JKEasyDetailer_Context,
    "JKEasyCheckpointLoader": JKEasyCheckpointLoader,
}
NODE_DISPLAY_NAME_MAPPINGS = {
    "EasyHRFix": "JK Easy HiRes Fix",
    "EasyHRFix_Context": "JK Easy HiRes Fix (Context)",
    "JKEasyDetailer": "JK Easy Detailer",
    "JKEasyDetailer_Context": "JK Easy Detailer (Context)",
    "JKEasyCheckpointLoader": "JK Easy Checkpoint Loader",
}
