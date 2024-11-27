import os
import sys
import logging
import glob
import importlib.util

this_dir = os.path.dirname(__file__)
module_dir = os.path.join(this_dir, 'python')

modules = glob.glob(os.path.join(module_dir, "*.py"), recursive=False)

log = logging.getLogger("jk-comfyui-helpers")
log.propagate = False
if not log.handlers:
    stdout_handler = logging.StreamHandler(sys.stdout)
    stdout_handler.addFilter(lambda record: record.levelno <= logging.INFO)
    stdout_handler.setFormatter(logging.Formatter("[%(levelname)s] JKEasyNodes: %(message)s"))
    log.addHandler(stdout_handler)
    stderr_handler = logging.StreamHandler(sys.stderr)
    stderr_handler.addFilter(lambda record: record.levelno > logging.INFO)
    stderr_handler.setFormatter(logging.Formatter("\033[91m[%(levelname)s] JKEasyNodes: %(message)s\033[0m"))
    log.addHandler(stderr_handler)

if os.environ.get("COMFY_DEBUG"):
    log.setLevel(logging.DEBUG)
else:
    log.setLevel(logging.INFO)

sys.path.insert(0, os.path.join(os.path.dirname(os.path.realpath(__file__)), "comfy"))

NODE_CLASS_MAPPINGS = {}
NODE_DISPLAY_NAME_MAPPINGS = {}

for mod in modules:
    module_name = os.path.splitext(mod)[0]
    spec = importlib.util.spec_from_file_location(module_name, mod)
    module = importlib.util.module_from_spec(spec)
    sys.modules[module_name] = module
    spec.loader.exec_module(module)
    if hasattr(module, "NODE_CLASS_MAPPINGS") and getattr(module, "NODE_CLASS_MAPPINGS") is not None:
        NODE_CLASS_MAPPINGS.update(module.NODE_CLASS_MAPPINGS)
        if hasattr(module, "NODE_DISPLAY_NAME_MAPPINGS") and getattr(module, "NODE_DISPLAY_NAME_MAPPINGS") is not None:
            NODE_DISPLAY_NAME_MAPPINGS.update(module.NODE_DISPLAY_NAME_MAPPINGS)

WEB_DIRECTORY = "./web"
__all__ = ["NODE_CLASS_MAPPINGS", "NODE_DISPLAY_NAME_MAPPINGS", "WEB_DIRECTORY"]
