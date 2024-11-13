import comfy.sd
import comfy.model_patcher
import comfy.utils
import folder_paths
import logging
from typing import TypedDict, List
import re

logging.basicConfig()
log = logging.getLogger("comfyui-prompt-lora")

class LoraParams(TypedDict):
    name: str
    weight: float
    weight_clip: float

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
                    name = spl[1]
                    try:
                        weight = float(spl[2])
                        weight_clip = 1
                        try:
                            weight_clip = float(spl(3))
                        except:
                            pass
                        ret.append({ "name": name, "weight": weight, 'weight_clip': weight_clip })
                        
                    except ValueError:
                        log.error(f'invalid weight for {name}')
                        
        return ret
    except Exception as e:
        print(f"Error parsing prompt: {e}")
        return []


# CLIPTextEncode.encode
def prompt_encode(clip: comfy.sd.CLIP, text: str):
    tokens = clip.tokenize(text)
    output = clip.encode_from_tokens(tokens, return_pooled=True, return_dict=True)
    cond = output.pop("cond")
    return ([[cond, output]], )

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

    RETURN_TYPES = ("MODEL", "CLIP", "CONDITIONING", "CONDITIONING")
    RETURN_NAMES = ("model", "clip", "positive", "negative")
    FUNCTION = "apply"
    CATEGORY = 'idk yet'

    def apply(self, model: comfy.model_patcher.ModelPatcher, clip: comfy.sd.CLIP, positive: str, negative: str):

        # TODO 
        #  remove the lora text from the positive prompt
        # TODO cache loras

        loras: list[LoraParams] = parse_lora_details(positive)

        model_lora = model
        clip_lora = clip

        for lora_detail in loras:
            lora_weight = lora_detail.get("weight")
            lora_clip_weight = lora_detail.get("weight_clip")
            lora_path = folder_paths.get_full_path("loras", lora_detail.get("name"))
            lora = comfy.utils.load_torch_file(lora_path, safe_load=True)

            model_lora, clip_lora = comfy.sd.load_lora_for_models(
                model_lora, clip_lora, lora, lora_weight, lora_clip_weight
            )

        p = prompt_encode(clip_lora, positive)[0]
        n = prompt_encode(clip_lora, negative)[0]

        return (model_lora, clip_lora, p, n)