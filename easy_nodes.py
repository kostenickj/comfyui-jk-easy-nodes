from torch import Tensor
import os
import sys

import comfy.sd
import comfy.samplers
import comfy.model_patcher
import comfy.utils
import folder_paths
import logging
from typing import Any, Dict, TypedDict, List
import re
from pathlib import Path

my_dir = os.path.dirname(os.path.abspath(__file__))
custom_nodes_dir = os.path.abspath(os.path.join(my_dir, '..'))
comfy_dir = os.path.abspath(os.path.join(my_dir, '..', '..'))
sys.path.append(comfy_dir)

from nodes import LatentUpscaleBy, VAEDecode, VAEEncode, ImageScaleBy, KSampler, CLIPTextEncode
from comfy_extras.nodes_upscale_model import ImageUpscaleWithModel, UpscaleModelLoader
sys.path.remove(comfy_dir)

logging.basicConfig()
log = logging.getLogger("jk-easy-nodes")

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
                        weight_clip = 1.0
                        try:
                            weight_clip = float(spl(3).strip())
                        except:
                            log.debug(f'no clip weight found for lora {name}, using 1.0')
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

class PromptLora:

    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "model": ("MODEL",),
                "clip": ("CLIP",),
                "positive": ("STRING", {"multiline": True}),
                "negative": ("STRING", {"multiline": True}),
            }
        }

    RETURN_TYPES = ("MODEL", "CLIP", "CONDITIONING", "CONDITIONING", "STRING")
    RETURN_NAMES = ("model", "clip", "positive", "negative", "filtered prompt (no lora tag)")
    FUNCTION = "apply"
    CATEGORY = 'JK Easy Nodes'

    cache = dict()

    def apply(self, model: comfy.model_patcher.ModelPatcher, clip: comfy.sd.CLIP, positive: str, negative: str):

        loras: list[LoraParams] = parse_lora_details(positive)

        model_lora = model
        clip_lora = clip

        used_lora_names: List[str] = []

        for lora_detail in loras:

            lora_base_name = lora_detail.get("name")
            lora_full_name = get_lora_full_name(lora_base_name)

            if lora_full_name is None:
                log.error(f'failed to find lora {lora_base_name}')
                continue

            lora_weight = lora_detail.get("weight")
            lora_clip_weight = lora_detail.get("weight_clip")
     
            used_lora_names.append(lora_full_name)

            if lora_full_name in self.cache:
                cached: CachedLora = self.cache.get(lora_full_name)
                lora = cached.get('lora')
            else:
                lora_path = folder_paths.get_full_path("loras", lora_full_name)
                lora = comfy.utils.load_torch_file(lora_path, safe_load=True)
                self.cache[lora_full_name] = CachedLora(name=lora_full_name, lora=lora, filepath=lora_path)

            # remove the lora text from the positive prompt
            positive = positive.replace(lora_detail.get('text'), '')

            log.info(f'applying lora "{lora_full_name}" with weight {lora_weight} and clip weight {lora_clip_weight}')

            model_lora, clip_lora = comfy.sd.load_lora_for_models(
                model_lora, clip_lora, lora, lora_weight, lora_clip_weight
            )

        # remove lora from cache if its not in used_lora_names
        loaded_loras = list(self.cache.keys())
        for lname in loaded_loras:
            if lname not in used_lora_names:
                log.debug(f'removing lora {lname} from cache.')
                self.cache.pop(lname, None)
        

        p = prompt_encode(clip_lora, positive)[0]
        n = prompt_encode(clip_lora, negative)[0]

        return (model_lora, clip_lora, p, n, positive)


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
            },
        }

    RETURN_TYPES = ("LATENT",)
    RETURN_NAMES = ( "LATENT",)
    FUNCTION = "apply"
    CATEGORY = "JK Easy Nodes"

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
    ):

        low_res = vae_decode_latent(vae, latent_image)
        pixel_upscale_model = UpscaleModelLoader().load_model(pixel_upscaler)[0]

        # pixel upscale
        image = ImageUpscaleWithModel().upscale(pixel_upscale_model, low_res)[0]

        # downscale it to target size
        downsize_scale = upscale_by / pixel_upscale_model.scale
        if downsize_scale != 1:
            image = ImageScaleBy().upscale(image, latent_upscaler, downsize_scale)[0]
        
        upscaled_samples = vae_encode_image(vae, image)

        # img2img
        samples = KSampler().sample(
            model,
            seed,
            steps,
            cfg,
            sampler_name,
            scheduler,
            positive,
            negative,
            upscaled_samples,
            denoise
        )[0]

        return (samples,)
