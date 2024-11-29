from dataclasses import dataclass, field
import json
from torch import Tensor
import os
import sys
import torch
import comfy.sd
import comfy.samplers
import comfy.model_patcher
import comfy.model_management
import comfy.utils
import folder_paths
from PIL import Image, ImageDraw
import numpy as np
import logging
from typing import Any, Dict, Literal, TypedDict, List, Generic, Optional, TypeVar
import re
from pathlib import Path
from ultralytics import YOLO
import cv2
from torchvision.transforms.functional import to_pil_image
import inspect
from nodes import MAX_RESOLUTION


this_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.append(os.path.abspath(this_dir))
sys.path.append(os.path.dirname(this_dir))

custom_nodes_dir = os.path.abspath(os.path.join(this_dir, '..'))
comfy_dir = os.path.abspath(os.path.join(this_dir, '..', '..'))
sys.path.append(comfy_dir)

import nodes
from nodes import LatentUpscaleBy, VAEDecode, VAEEncode, ImageScaleBy, KSampler, CLIPTextEncode
from comfy_extras.nodes_upscale_model import ImageUpscaleWithModel, UpscaleModelLoader
sys.path.remove(comfy_dir)

from jknodes import utils

model_path = folder_paths.models_dir
utils.add_folder_path_and_extensions("ultralytics_bbox", [os.path.join(model_path, "ultralytics", "bbox")], folder_paths.supported_pt_extensions)
utils.add_folder_path_and_extensions("ultralytics_segm", [os.path.join(model_path, "ultralytics", "segm")], folder_paths.supported_pt_extensions)
utils.add_folder_path_and_extensions("ultralytics", [os.path.join(model_path, "ultralytics")], folder_paths.supported_pt_extensions)

logging.basicConfig()
log = logging.getLogger("jk-comfyui-helpers")

class CachedLora(TypedDict):
    name: str
    filepath: str
    lora: (Dict[str, Tensor] | Any)

class LoraParams(TypedDict):
    name: str
    weight: float
    weight_clip: float
    text: str

def get_lora_full_name(lora_name: str):
    all_loras = folder_paths.get_filename_list("loras")

    if lora_name in all_loras:
        return lora_name
    
    no_ext = lora_name.split('.')[0]
    for n in [no_ext, lora_name, lora_name.replace(" ", "_")]:
        for f in all_loras:
            p = Path(f).with_suffix("")
            if p.name == n or str(p) == n:
                return f
    return None

def vae_decode_latent(vae: comfy.sd.VAE, samples):
    return VAEDecode().decode(vae,samples)[0]

def vae_encode_image(vae: comfy.sd.VAE, image):
    return VAEEncode().encode(vae,image)[0]

# Function to parse LoRA details from the prompt
def parse_lora_details(prompt) -> List[LoraParams]:
    try:
        pattern = r"<([^>]+)>"
        ret: List[LoraParams] = []
        matches: List[str] = re.findall(pattern, prompt)
        for m in matches:
            if m.startswith('lora'):
                spl = m.split(':')
                if len(spl) > 2:
                    name = spl[1].strip()
                    try:
                        weight_str = spl[2].strip()
                        weight = float(weight_str)
                        weight_clip = weight
                        try:
                            weight_clip = float(spl(3).strip())
                        except:
                            log.debug(f'no clip weight found for lora {name}, using {weight}')
                            pass
                        ret.append({ "name": name, "weight": weight, 'weight_clip': weight_clip, "text": f'<{m}>' })
                        
                    except ValueError:
                        log.error(f'invalid weight for {name}')
                        
        return ret
    except Exception as e:
        print(f"Error parsing prompt: {e}")
        return []


def prompt_encode(clip: comfy.sd.CLIP, text: str):
    return CLIPTextEncode().encode(clip, text)


# region processors

def process_list(anything):
    text = []
    if not anything:
        return {"text": []}

    first_element = anything[0]
    if (
        isinstance(first_element, list)
        and first_element
        and isinstance(first_element[0], torch.Tensor)
    ):
        text.append(
            "List of List of Tensors: "
            f"{first_element[0].shape} (x{len(anything)})"
        )

    elif isinstance(first_element, torch.Tensor):
        text.append(
            f"List of Tensors: {first_element.shape} (x{len(anything)})"
        )
    else:
        text.append(f"Array ({len(anything)}): {anything}")

    return {"text": text}


def process_dict(anything):
    text = []
    if "samples" in anything:
        is_empty = (
            "(empty)" if torch.count_nonzero(anything["samples"]) == 0 else ""
        )
        text.append(f"Latent Samples: {anything['samples'].shape} {is_empty}")

    else:
        text.append(json.dumps(anything, indent=2))

    return {"text": text}


def process_bool(anything):
    return {"text": ["True" if anything else "False"]}


def process_text(anything):
    return {"text": [str(anything)]}


# endregion

# originally from MTB nodes, modified to actually work with anything using AnyType
class JKAnythingToString:

    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {"input": (utils.any_type_helper, {})},
        }

    RETURN_TYPES = ("STRING",)
    FUNCTION = "do_str"
    CATEGORY = "JK Comfy Helpers"

    def do_str(self, input):
        if isinstance(input, str):
            return (input,)
        elif isinstance(input, torch.Tensor):
            return (f"Tensor of shape {input.shape} and dtype {input.dtype}",)
        elif isinstance(input, Image.Image):
            return (f"PIL Image of size {input.size} and mode {input.mode}",)
        elif isinstance(input, np.ndarray):
            return (
                f"Numpy array of shape {input.shape} and dtype {input.dtype}",
            )

        elif isinstance(input, dict):
            return (
                f"Dictionary of {len(input)} items, with keys {input.keys()}",
            )

        else:
            log.debug(f"Falling back to string conversion of {input}")
            return (str(input),)



class EasyHRFix:

    default_latent_upscalers = LatentUpscaleBy.INPUT_TYPES()["required"]["upscale_method"][0]
    latent_upscalers = default_latent_upscalers + ['lanczos']
    pixel_upscalers = folder_paths.get_filename_list("upscale_models")

    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "model": ("MODEL",),
                "vae": ("VAE", {"tooltip": "The VAE model used for decoding the latent."}),
                "seed": ("INT", {"default": 0, "min": 0, "max": 0xffffffffffffffff, "tooltip": "The random seed used for creating the noise."}),
                "steps": ("INT", {"default": 20, "min": 1, "max": 10000, "tooltip": "The number of steps used in the denoising process."}),
                "cfg": ("FLOAT", {"default": 8.0, "min": 0.0, "max": 100.0, "step":0.1, "round": 0.01, "tooltip": "The Classifier-Free Guidance scale balances creativity and adherence to the prompt. Higher values result in images more closely matching the prompt however too high values will negatively impact quality."}),
                "sampler_name": (comfy.samplers.KSampler.SAMPLERS, {"tooltip": "The algorithm used when sampling, this can affect the quality, speed, and style of the generated output."}),
                "scheduler": (comfy.samplers.KSampler.SCHEDULERS, {"tooltip": "The scheduler controls how noise is gradually removed to form the image."}),
                "positive": ("CONDITIONING", {"tooltip": "The conditioning describing the attributes you want to include in the image."}),
                "negative": ("CONDITIONING", {"tooltip": "The conditioning describing the attributes you want to exclude from the image."}),
                "upscale_by": ("FLOAT", {"default": 1.5, "min": 1.05, "max": 4.0, "step": 0.05},),
                "latent_image": ("LATENT",),
                "denoise": ("FLOAT",{"default": 0.5, "min": 0.00, "max": 1.00, "step": 0.01},),
                "latent_upscaler": (cls.latent_upscalers,{ "default": 'lanczos' }),
                "pixel_upscaler": (cls.pixel_upscalers,),
                "noise_mode": (["GPU(=A1111)", "CPU"], { "default": "GPU(=A1111)" }),
                "inject_extra_noise" : (["disable", "enable"],{ "default": "enable" } ),
                "extra_noise_strength" : ("FLOAT",{"default": 2.5, "min": 0.00, "max": 100, "step": 0.1},),
            },
        }

    RETURN_TYPES = ("LATENT",)
    RETURN_NAMES = ( "LATENT",)
    FUNCTION = "apply"
    CATEGORY = "JK Comfy Helpers"

    def apply(
        self,
        model: comfy.model_patcher.ModelPatcher,
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
        extra_noise_strength: float
    ):
        if 'KSampler //Inspire' not in nodes.NODE_CLASS_MAPPINGS:
            raise Exception("[ERROR] You need to install 'ComfyUI-Inspire-Pack'")

        size = latent_image['samples'].shape
        inject_noise = inject_extra_noise == 'enable'

        if(inject_noise and extra_noise_strength > 0):

            if "BNK_NoisyLatentImage" in nodes.NODE_CLASS_MAPPINGS and "BNK_InjectNoise" in nodes.NODE_CLASS_MAPPINGS:
                NoisyLatentImage = nodes.NODE_CLASS_MAPPINGS["BNK_NoisyLatentImage"]
                InjectNoise = nodes.NODE_CLASS_MAPPINGS["BNK_InjectNoise"]
                noise = NoisyLatentImage().create_noisy_latents(noise_mode, seed, size[3] * 8, size[2] * 8, size[0])[0]
                latent_image = InjectNoise().inject_noise(latent_image, extra_noise_strength, noise)[0]

            else:
                raise Exception("'BNK_NoisyLatentImage', 'BNK_InjectNoise' nodes are not installed.")


        low_res = vae_decode_latent(vae, latent_image)
        pixel_upscale_model = UpscaleModelLoader().load_model(pixel_upscaler)[0]

        # pixel upscale
        image = ImageUpscaleWithModel().upscale(pixel_upscale_model, low_res)[0]

        # downscale it to target size
        downsize_scale = upscale_by / pixel_upscale_model.scale
        if downsize_scale != 1:
            image = ImageScaleBy().upscale(image, latent_upscaler, downsize_scale)[0]
        
        upscaled_samples = vae_encode_image(vae, image)

        inspire_sampler = nodes.NODE_CLASS_MAPPINGS['KSampler //Inspire']
        # img2img with gpu noise like a1111
        samples = inspire_sampler.doit(
            model,
            seed,
            steps,
            cfg,
            sampler_name,
            scheduler,
            positive,
            negative,
            upscaled_samples,
            denoise,
            noise_mode,
            "comfy",
        )[0]

        return (samples,)


class JKEasyDetailer:
    #todo
    RETURN_TYPES = ("IMAGE", )
    RETURN_NAMES = ( "IMAGE", )
    FUNCTION = "apply"
    CATEGORY = "JK Comfy Helpers"

    @classmethod
    def INPUT_TYPES(s):
        bboxs = ["bbox/"+x for x in folder_paths.get_filename_list("ultralytics_bbox")]
        segms = ["segm/"+x for x in folder_paths.get_filename_list("ultralytics_segm")]
        detectors = bboxs + segms
        return {
            "required": {
                "image": ("IMAGE", ),
                "detector": (detectors, ),
                "model": ("MODEL",),
                "vae": ("VAE",),
                "seed": ("INT", {"default": 0, "min": 0, "max": 0xffffffffffffffff}),
                "steps": ("INT", {"default": 20, "min": 1, "max": 10000}),
                "cfg": ("FLOAT", {"default": 8.0, "min": 0.0, "max": 100.0, "step":0.1, "round": 0.01}),
                "sampler_name": (comfy.samplers.KSampler.SAMPLERS,),
                "scheduler": (comfy.samplers.KSampler.SCHEDULERS,),
                "positive": ("CONDITIONING",),
                "negative": ("CONDITIONING",),

                "threshold": ("FLOAT", {"default": 0.5, "min": 0.0, "max": 1.0, "step": 0.01}),
                "dilation": ("INT", {"default": 10, "min": -512, "max": 512, "step": 1}),
                "crop_factor": ("FLOAT", {"default": 3.0, "min": 1.0, "max": 100, "step": 0.1}),
                "drop_size": ("INT", {"min": 1, "max": MAX_RESOLUTION, "step": 1, "default": 10}),
            }
        }
    
    def apply(
        self, 
        image, 
        detector: str, 
        model: comfy.model_patcher.ModelPatcher, 
        vae, 
        seed, 
        steps, 
        cfg, 
        sampler_name, 
        scheduler, 
        positive, 
        negative,
        threshold,
        dilation,
        crop_factor,
        drop_size
    ):

        if 'DetailerForEach' not in nodes.NODE_CLASS_MAPPINGS:
            raise Exception("[ERROR] You need to install 'ComfyUI-Impact-Pack'")
        if 'UltralyticsDetectorProvider' not in nodes.NODE_CLASS_MAPPINGS:
            raise Exception("[ERROR] You need to install 'ComfyUI-Impact-Pack'")
        if 'BboxDetectorSEGS' not in nodes.NODE_CLASS_MAPPINGS:
            raise Exception("[ERROR] You need to install 'ComfyUI-Impact-Pack'")
        if 'SegmDetectorSEGS' not in  nodes.NODE_CLASS_MAPPINGS:
            raise Exception("[ERROR] You need to install 'ComfyUI-Impact-Pack'")

        provider_loader = nodes.NODE_CLASS_MAPPINGS['UltralyticsDetectorProvider']()

        path_toclass = inspect.getfile(provider_loader.__class__)
        if path_toclass not in sys.path:
            sys.path.append(os.path.dirname(path_toclass))
        # hack but i dont care, this imports from impact subpack
        from subcore import UltraBBoxDetector, UltraSegmDetector, load_yolo

        detector_full_path = folder_paths.get_full_path("ultralytics", detector)
        yolo = load_yolo(detector_full_path)
        has_segm = yolo.task == 'segment'
        detector_inst = UltraSegmDetector(yolo) if has_segm else UltraBBoxDetector(yolo)

        bbox_detector_node = nodes.NODE_CLASS_MAPPINGS['BboxDetectorSEGS']
        segm_detector_node = nodes.NODE_CLASS_MAPPINGS['SegmDetectorSEGS']
        detector_node_to_use = segm_detector_node() if has_segm else bbox_detector_node()
        segs = detector_node_to_use.doit(
            detector_inst, 
            image, 
            threshold, 
            dilation, 
            crop_factor, 
            drop_size,
            'all'
        )
        print(segs)
        # detector_full_path = folder_paths.get_full_path("ultralytics", detector)
        # yolo = YOLO(detector_full_path)
        # start_img = utils.tensor2pil(image)

        # DetailerForEach

        return (image,)

    @classmethod

    def IS_CHANGED(self):
       return ""
    

# only exists so i can pass a variable scheduler into the inspire pack scheduler, most people wont need or care about this
class JKInspireSchedulerAdapter:
    @classmethod
    def INPUT_TYPES(s):
        return {"required": {
            "scheduler": (comfy.samplers.KSampler.SCHEDULERS, {"defaultInput": True, }),
        }}

    CATEGORY = "JK Comfy Helpers"

    # common.core in inspire pack
    RETURN_TYPES = (comfy.samplers.KSampler.SCHEDULERS + ['AYS SDXL', 'AYS SD1', 'AYS SVD', "GITS[coeff=1.2]"],)
    RETURN_NAMES = ("scheduler",)

    FUNCTION = "doit"

    def doit(self, scheduler):
        return (scheduler,)


NODE_CLASS_MAPPINGS = {
    'EasyHRFix': EasyHRFix,
    'JKAnythingToString': JKAnythingToString,
    'JKInspireSchedulerAdapter': JKInspireSchedulerAdapter,
    'JKEasyDetailer': JKEasyDetailer
}
NODE_DISPLAY_NAME_MAPPINGS = {
  'JKAnythingToString': 'JK Anything to string',
  'EasyHRFix': 'JK Easy HiRes Fix',
  'JKInspireSchedulerAdapter': 'JK Inspire Scheduler Adapter',
  'JKEasyDetailer': 'JK Easy Detailer'
}