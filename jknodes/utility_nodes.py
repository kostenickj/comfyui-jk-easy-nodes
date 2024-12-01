import logging
import os
import sys
import torch
import comfy.sd
import comfy.samplers
import comfy.model_patcher
import comfy.model_management
import comfy.utils
from jknodes import utils
from PIL import Image
import numpy as np

this_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.append(os.path.dirname(this_dir))

logging.basicConfig()
log = logging.getLogger("jk-comfyui-helpers")

class JKStringEquals:
    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "a": ("STRING",),
                "b": ("STRING",),
            },
        }

    FUNCTION = "doit"
    CATEGORY = "JK Comfy Helpers/Util"

    RETURN_TYPES = ("BOOLEAN",)

    def doit(self, a, b):
        return (a == b,)


class JKStringNotEquals:
    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "a": ("STRING",),
                "b": ("STRING",),
            },
        }

    FUNCTION = "doit"
    CATEGORY = "JK Comfy Helpers/Util"

    RETURN_TYPES = ("BOOLEAN",)

    def doit(self, a, b):
        return (a != b,)


class JKStringNotEmpty:
    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "a": ("STRING",),
            },
        }

    FUNCTION = "doit"
    CATEGORY = "JK Comfy Helpers/Util"

    RETURN_TYPES = ("BOOLEAN",)

    def doit(self, a: str):
        return (a.strip() != "",)


class JKStringEmpty:
    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "a": ("STRING",),
            },
        }

    FUNCTION = "doit"
    CATEGORY = "JK Comfy Helpers/Util"

    RETURN_TYPES = ("BOOLEAN",)

    def doit(self, a: str):
        return (a.strip() == "",)


# only exists so i can pass a variable scheduler into the inspire pack scheduler, most people wont need or care about this
class JKInspireSchedulerAdapter:
    @classmethod
    def INPUT_TYPES(s):
        return {
            "required": {
                "scheduler": (
                    comfy.samplers.KSampler.SCHEDULERS,
                    {
                        "defaultInput": True,
                    },
                ),
            }
        }

    CATEGORY = "JK Comfy Helpers/Util"

    # common.core in inspire pack
    RETURN_TYPES = (
        comfy.samplers.KSampler.SCHEDULERS
        + ["AYS SDXL", "AYS SD1", "AYS SVD", "GITS[coeff=1.2]"],
    )
    RETURN_NAMES = ("scheduler",)

    FUNCTION = "doit"

    def doit(self, scheduler):
        return (scheduler,)


# originally from MTB nodes, modified to actually work with anything using AnyType
class JKAnythingToString:
    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {"input": (utils.any_type_helper, {})},
        }

    RETURN_TYPES = ("STRING",)
    FUNCTION = "do_str"
    CATEGORY = "JK Comfy Helpers/Util"

    def do_str(self, input):
        if isinstance(input, str):
            return (input,)
        elif isinstance(input, torch.Tensor):
            return (f"Tensor of shape {input.shape} and dtype {input.dtype}",)
        elif isinstance(input, Image.Image):
            return (f"PIL Image of size {input.size} and mode {input.mode}",)
        elif isinstance(input, np.ndarray):
            return (f"Numpy array of shape {input.shape} and dtype {input.dtype}",)

        elif isinstance(input, dict):
            return (f"Dictionary of {len(input)} items, with keys {input.keys()}",)

        else:
            log.debug(f"Falling back to string conversion of {input}")
            return (str(input),)


NODE_CLASS_MAPPINGS = {
    "JKStringNotEquals": JKStringNotEquals,
    "JKStringEquals": JKStringEquals,
    "JKStringEmpty": JKStringEmpty,
    "JKStringNotEmpty": JKStringNotEmpty,
    "JKInspireSchedulerAdapter": JKInspireSchedulerAdapter,
    "JKAnythingToString": JKAnythingToString,
}
NODE_DISPLAY_NAME_MAPPINGS = {
    "JKStringEquals": "JK String Equals",
    "JKStringNotEquals": "JK String Not Equals",
    "JKStringNotEmpty": "JK String Not Empty",
    "JKStringEmpty": "JK String Empty",
    "JKInspireSchedulerAdapter": "JK Inspire Scheduler Adapter",
    "JKAnythingToString": "JK Anything to string",
}
