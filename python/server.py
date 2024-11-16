from typing import Dict, List, TypedDict
from server import PromptServer
from aiohttp import web
import os
import folder_paths
from pathlib import Path
import json
import hashlib
from charset_normalizer import from_path
import logging

logging.basicConfig()
log = logging.getLogger("jk-easy-nodes")

def get_metadata(filepath):
    with open(filepath, "rb") as file:
        # https://github.com/huggingface/safetensors#format
        # 8 bytes: N, an unsigned little-endian 64-bit integer, containing the size of the header
        header_size = int.from_bytes(file.read(8), "little", signed=False)

        if header_size <= 0:
            raise BufferError("Invalid header size")

        header = file.read(header_size)
        if header_size <= 0:
            raise BufferError("Invalid header")

        header_json = json.loads(header)
        return header_json["__metadata__"] if "__metadata__" in header_json else None

class LoraPreference(TypedDict):
    activation_text: str
    preferred_weight: str
    lora_name: str

def try_find_lora_config(lora_name: str):
  
    try:
        file_path = None

        possible_paths = folder_paths.get_folder_paths('loras')
        for p in possible_paths:
            check_path = os.path.join(p, lora_name)
            if os.path.isfile(check_path):
                file_path = check_path
                break

        if not file_path:
            return None
        
        file_path_no_ext = os.path.splitext(file_path)[0]
        config_full_path = file_path_no_ext + '.json'

        if os.path.isfile(config_full_path):
            p = Path(config_full_path)
            config_json = json.loads(p.read_text(encoding="utf-8"))
            activation_text= ''
            preferred_weight = 1.0
            
            #A111 style config
            if 'activation text' in config_json:
                activation_text = config_json['activation text']
            elif 'activationText' in config_json:
                 activation_text = config_json['activationText']

            #A111 style config
            if 'preferred weight' in config_json:
                if config_json['preferred weight'] != 0:
                    preferred_weight = config_json['preferred weight']
            elif 'preferredWeight' in config_json:
                if config_json['preferredWeight'] != 0:
                    preferred_weight = config_json['preferredWeight']
            pref = LoraPreference(activation_text=activation_text, preferred_weight=preferred_weight, lora_name=lora_name)
            return pref

        else:
            return None
    except:
        return None


class TagFile(TypedDict):
    contents: str
    file_name: str
    file_path: str

tagfile_cache: Dict[str,TagFile] = dict()

@PromptServer.instance.routes.get("/jk-nodes/autocomplete-files")
async def get_autocomplete_files(request):

    global tagfile_cache

    ext_dir = os.path.join(folder_paths.folder_names_and_paths['custom_nodes'][0][0], 'comfyui-jk-easy-nodes')
    tags_dir = os.path.join(ext_dir, 'tags')
    all_tag_files = [os.path.join(dirpath,f) for (dirpath, dirnames, filenames) in os.walk(tags_dir) for f in filenames if f.lower().endswith('.csv') or f.lower().endswith('.txt')]
    ret: List[TagFile] = []
    for f in all_tag_files:

        if f in tagfile_cache:
            ret.append(tagfile_cache[f])
            log.debug(f'returning cached tag file {f}')
            continue

        try:
            encoding = from_path(f)
            contents = Path(f).read_text(encoding=encoding.best().encoding)
            tags = TagFile(contents=contents, file_name=os.path.basename(f), file_path=f)
            tagfile_cache[f] = tags
            ret.append(TagFile(contents=contents, file_name=os.path.basename(f), file_path=f))
        except:
            log.error(f'failed to read tag file: "{f}"')
    return web.json_response(ret)


@PromptServer.instance.routes.get("/jk-nodes/loras")
async def get_loras(request):
    loras = folder_paths.get_filename_list("loras")
    ret: List[LoraPreference] = []
    for lora in loras:
        name = os.path.splitext(lora)[0]
        maybe_config = try_find_lora_config(lora)
        if maybe_config:
            ret.append(maybe_config)
        else:
            ret.append(LoraPreference(activation_text='', lora_name=name, preferred_weight=1.0))
    return web.json_response(ret)


@PromptServer.instance.routes.get("/jk-nodes/metadata/{name}")
async def load_metadata(request):
    name = request.match_info["name"]
    pos = name.index("/")
    type = name[0:pos]
    name = name[pos+1:]

    file_path = None
    if type == "embeddings" or type == "loras":
        name = name.lower()
        files = folder_paths.get_filename_list(type)
        for f in files:
            lower_f = f.lower()
            if lower_f == name:
                file_path = folder_paths.get_full_path(type, f)
            else:
                n = os.path.splitext(f)[0].lower()
                if n == name:
                    file_path = folder_paths.get_full_path(type, f)

            if file_path is not None:
                break
    else:
        file_path = folder_paths.get_full_path(
            type, name)
    if not file_path:
        return web.Response(status=404)

    try:
        meta = get_metadata(file_path)
    except:
        meta = None

    if meta is None:
        meta = {}

    file_no_ext = os.path.splitext(file_path)[0]

    hash_file = file_no_ext + ".sha256"
    if os.path.isfile(hash_file):
        with open(hash_file, "rt") as f:
            meta["jk-nodes.sha256"] = f.read()
    else:
        with open(file_path, "rb") as f:
            meta["jk-nodes.sha256"] = hashlib.sha256(f.read()).hexdigest()
        with open(hash_file, "wt") as f:
            f.write(meta["jk-nodes.sha256"])

    return web.json_response(meta)