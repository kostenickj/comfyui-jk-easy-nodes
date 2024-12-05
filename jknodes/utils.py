import contextlib
import os
import sys
import folder_paths
import comfy.sd
from os import environ
from nodes import VAEDecode, VAEEncode

this_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.append(os.path.dirname(this_dir))


def vae_decode_latent(vae: comfy.sd.VAE, samples):
    return VAEDecode().decode(vae, samples)[0]


def vae_encode_image(vae: comfy.sd.VAE, image):
    return VAEEncode().encode(vae, image)[0]


def add_folder_path_and_extensions(folder_name, full_folder_paths, extensions):
    # Iterate over the list of full folder paths
    for full_folder_path in full_folder_paths:
        # Use the provided function to add each model folder path
        folder_paths.add_model_folder_path(folder_name, full_folder_path)

    # Now handle the extensions. If the folder name already exists, update the extensions
    if folder_name in folder_paths.folder_names_and_paths:
        # Unpack the current paths and extensions
        current_paths, current_extensions = folder_paths.folder_names_and_paths[folder_name]
        # Update the extensions set with the new extensions
        updated_extensions = current_extensions | extensions
        # Reassign the updated tuple back to the dictionary
        folder_paths.folder_names_and_paths[folder_name] = (current_paths, updated_extensions)
    else:
        # If the folder name was not present, add_model_folder_path would have added it with the last path
        # Now we just need to update the set of extensions as it would be an empty set
        # Also ensure that all paths are included (since add_model_folder_path adds only one path at a time)
        folder_paths.folder_names_and_paths[folder_name] = (full_folder_paths, extensions)


class AnyType(str):
    """A special class that is always equal in not equal comparisons. Credit to pythongosssss"""

    def __ne__(self, __value: object) -> bool:
        return False


any_type_helper = AnyType("*")


class JKLogger:
    COLORS = {
        'DEBUG': '\033[94m',  # Blue
        'INFO': '\033[92m',  # Green
        'WARNING': '\033[93m',  # Yellow
        'ERROR': '\033[91m',  # Red
        'RESET': '\033[0m'  # Reset to default
    }

    @staticmethod
    def _get_colored_message(level, message):
        color = JKLogger.COLORS.get(level, JKLogger.COLORS['RESET'])
        return f"{color}{message}{JKLogger.COLORS['RESET']}"

    @staticmethod
    def debug(message):
        """Log a debug message in blue."""
        print(JKLogger._get_colored_message('DEBUG', message))

    @staticmethod
    def info(message):
        """Log an info message in green."""
        print(JKLogger._get_colored_message('INFO', message))

    @staticmethod
    def warning(message):
        """Log a warning message in yellow."""
        print(JKLogger._get_colored_message('WARNING', message))

    @staticmethod
    def error(message):
        """Log an error message in red."""
        print(JKLogger._get_colored_message('ERROR', message))


BLEH_PRESET_LIMIT = 16
BLEH_PRESET_COUNT = 1
with contextlib.suppress(Exception):
    BLEH_PRESET_COUNT = min(
        BLEH_PRESET_LIMIT,
        max(
            0,
            int(environ.get("COMFYUI_BLEH_SAMPLER_PRESET_COUNT", 1)),
        ),
    )

BLEH_PRESET_LIST = ['disabled']
for idx in range(BLEH_PRESET_COUNT):
    key = f"bleh_preset_{idx}"
    BLEH_PRESET_LIST.append(key)