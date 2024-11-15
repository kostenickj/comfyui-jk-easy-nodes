import os
import sys
import logging


from  .easy_nodes import PromptLora, EasyHRFix

log = logging.getLogger("jk-easy-nodes")
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

    
NODE_CLASS_MAPPINGS = {
    "PromptLora": PromptLora,
    'EasyHRFix': EasyHRFix
}
NODE_DISPLAY_NAME_MAPPINGS = {
  'PromptLora': 'JK Easy Prompt',
  'EasyHRFix': 'JK Easy HiRes Fix'
}