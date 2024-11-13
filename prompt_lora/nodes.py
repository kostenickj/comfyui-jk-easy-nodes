from torch import Tensor
import comfy.sd
import comfy.model_patcher
import comfy.utils
import folder_paths
import logging
from typing import Any, Dict, TypedDict, List
import re
from pathlib import Path

logging.basicConfig()
log = logging.getLogger("comfyui-prompt-lora")

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
    # Some autocompletion scripts replace _ with spaces
    for n in [no_ext, lora_name, lora_name.replace(" ", "_")]:
        for f in all_loras:
            p = Path(f).with_suffix("")
            if p.name == n or str(p) == n:
                return f
    return None


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