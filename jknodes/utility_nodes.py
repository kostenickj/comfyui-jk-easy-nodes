import os
import sys
import torch
import comfy.sd
import comfy.samplers
import comfy.model_patcher
import comfy.model_management
import comfy.utils
import comfy
import nodes
from jknodes import utils
from PIL import Image
import numpy as np
import importlib

this_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.append(os.path.dirname(this_dir))

from jknodes import utils

log = utils.JKLogger

try:
    custom_nodes_dir = os.path.join(this_dir, '../../')
    dynamic_thresholding_dir = os.path.abspath(os.path.join(custom_nodes_dir, 'sd-dynamic-thresholding'))
    sys.path.append(dynamic_thresholding_dir)
    dynamic_thresholding_module = importlib.import_module('sd-dynamic-thresholding')
except:
    log.warning('sd dynamic thresholding not installed, related nodes will not available')
    dynamic_thresholding_module = None


# helper to apply dynamic thresholding settings to multiple models at once
class JKDynamicThresholdingMultiModel:

    @classmethod
    def INPUT_TYPES(cls):
        if dynamic_thresholding_module is not None:
            required_args_dict: dict = dynamic_thresholding_module.dynthres_comfyui.DynamicThresholdingComfyNode().INPUT_TYPES(
            )['required']
            required_args_dict.pop('model', None)
            return {
                "required": required_args_dict, "optional": {
                    "model1": ("MODEL", ),
                    "model2": ("MODEL", ),
                    "model3": ("MODEL", ),
                    "model4": ("MODEL", ),
                    "model5": ("MODEL", ),
                    "model6": ("MODEL", ),
                }
            }
        else:
            return {"required": {"dynamic-thresholding not installed", ("STRING", )}}

    RETURN_TYPES = (
        "MODEL",
        "MODEL",
        "MODEL",
        "MODEL",
        "MODEL",
        "MODEL",
    )
    RETURN_NAMES = (
        "model1",
        "model2",
        "model3",
        "model4",
        "model5",
        "model6",
    )
    FUNCTION = "apply"
    CATEGORY = "JK Comfy Helpers/Util"

    def apply(self,
              model1: comfy.model_patcher.ModelPatcher = None,
              model2: comfy.model_patcher.ModelPatcher = None,
              model3: comfy.model_patcher.ModelPatcher = None,
              model4: comfy.model_patcher.ModelPatcher = None,
              model5: comfy.model_patcher.ModelPatcher = None,
              model6: comfy.model_patcher.ModelPatcher = None,
              **kwargs):

        if 'DynamicThresholdingFull' not in nodes.NODE_CLASS_MAPPINGS:
            raise Exception("[ERROR] sd-dynamic-thresholding not installed")

        thresh_node = nodes.NODE_CLASS_MAPPINGS["DynamicThresholdingFull"]

        m_1 = model1.clone() if model1 is not None else None
        if m_1 is not None:
            m_1 = thresh_node().patch(model=m_1, **kwargs)[0]

        m_2 = model2.clone() if model2 is not None else None
        if m_2 is not None:
            m_2 = thresh_node().patch(model=m_2, **kwargs)[0]

        m_3 = model3.clone() if model3 is not None else None
        if m_3 is not None:
            m_3 = thresh_node().patch(model=m_3, **kwargs)[0]

        m_4 = model4.clone() if model4 is not None else None
        if m_4 is not None:
            m_4 = thresh_node().patch(model=m_4, **kwargs)[0]

        m_5 = model5.clone() if model5 is not None else None
        if m_5 is not None:
            m_5 = thresh_node().patch(model=m_5, **kwargs)[0]

        m_6 = model6.clone() if model6 is not None else None
        if m_6 is not None:
            m_6 = thresh_node().patch(model=m_6, **kwargs)[0]

        return (
            m_1,
            m_2,
            m_3,
            m_4,
            m_5,
            m_6,
        )


class JKStringEquals:

    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "a": ("STRING", ),
                "b": ("STRING", ),
            },
        }

    FUNCTION = "doit"
    CATEGORY = "JK Comfy Helpers/Util"

    RETURN_TYPES = ("BOOLEAN", )

    def doit(self, a, b):
        return (a == b, )


class JKStringNotEquals:

    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "a": ("STRING", ),
                "b": ("STRING", ),
            },
        }

    FUNCTION = "doit"
    CATEGORY = "JK Comfy Helpers/Util"

    RETURN_TYPES = ("BOOLEAN", )

    def doit(self, a, b):
        return (a != b, )


class JKStringNotEmpty:

    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "a": ("STRING", ),
            },
        }

    FUNCTION = "doit"
    CATEGORY = "JK Comfy Helpers/Util"

    RETURN_TYPES = ("BOOLEAN", )

    def doit(self, a: str):
        return (a.strip() != "", )


class JKStringEmpty:

    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "a": ("STRING", ),
            },
        }

    FUNCTION = "doit"
    CATEGORY = "JK Comfy Helpers/Util"

    RETURN_TYPES = ("BOOLEAN", )

    def doit(self, a: str):
        return (a.strip() == "", )


# only exists so i can pass a variable scheduler into the inspire pack scheduler, most people wont need or care about this
class JKInspireSchedulerAdapter:

    @classmethod
    def INPUT_TYPES(s):
        return {"required": {
            "scheduler": (
                comfy.samplers.KSampler.SCHEDULERS,
                {
                    "defaultInput": True,
                },
            ),
        }}

    CATEGORY = "JK Comfy Helpers/Util"

    # common.core in inspire pack
    RETURN_TYPES = (comfy.samplers.KSampler.SCHEDULERS + ["AYS SDXL", "AYS SD1", "AYS SVD", "GITS[coeff=1.2]"], )
    RETURN_NAMES = ("scheduler", )

    FUNCTION = "doit"

    def doit(self, scheduler):
        return (scheduler, )


# originally from MTB nodes, modified to actually work with anything using AnyType
class JKAnythingToString:

    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {"input": (utils.any_type_helper, {})},
        }

    RETURN_TYPES = ("STRING", )
    FUNCTION = "do_str"
    CATEGORY = "JK Comfy Helpers/Util"

    def do_str(self, input):
        if isinstance(input, str):
            return (input, )
        elif isinstance(input, torch.Tensor):
            return (f"Tensor of shape {input.shape} and dtype {input.dtype}", )
        elif isinstance(input, Image.Image):
            return (f"PIL Image of size {input.size} and mode {input.mode}", )
        elif isinstance(input, np.ndarray):
            return (f"Numpy array of shape {input.shape} and dtype {input.dtype}", )

        elif isinstance(input, dict):
            return (f"Dictionary of {len(input)} items, with keys {input.keys()}", )

        else:
            log.debug(f"Falling back to string conversion of {input}")
            return (str(input), )


NODE_CLASS_MAPPINGS = {
    "JKStringNotEquals": JKStringNotEquals, "JKStringEquals": JKStringEquals, "JKStringEmpty": JKStringEmpty, "JKStringNotEmpty": JKStringNotEmpty, "JKInspireSchedulerAdapter": JKInspireSchedulerAdapter, "JKAnythingToString": JKAnythingToString, 'JKDynamicThresholdingMultiModel': JKDynamicThresholdingMultiModel
}
NODE_DISPLAY_NAME_MAPPINGS = {
    "JKStringEquals": "JK String Equals", "JKStringNotEquals": "JK String Not Equals", "JKStringNotEmpty": "JK String Not Empty", "JKStringEmpty": "JK String Empty", "JKInspireSchedulerAdapter": "JK Inspire Scheduler Adapter", "JKAnythingToString": "JK Anything to string", 'JKDynamicThresholdingMultiModel': "JKDynamic Thresholding Multi Model Apply"
}
