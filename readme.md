# jk-comfyui-helpers
This repo contains a collection of helpers and nodes for ComfyUI

# Installation

## Manager

[TODO](https://github.com/ltdrdata/ComfyUI-Manager#how-to-register-your-custom-node-into-comfyui-manager)

## Manual install
1. Clone the repository:
`git clone https://github.com/kostenickj/jk-comfyui-helpers.git`  
to your ComfyUI `custom_nodes` directory

- For uninstallation:
  - Delete the cloned repo in `custom_nodes`

## Manual Update
1. Navigate to the cloned repo e.g. `custom_nodes/jk-comfyui-helpers`
2. `git pull`

## Features

### Custom Feed Window - Great for multi-monitor setups

<details open>
   <summary> A custom feed window that can be moved to another monitor</summary>
   <img src="./img/OpenFeed.gif"> </img>
</details> 
<details> 
   <summary>Grid mode or single image</summary>
   <img src="./img/Modes.gif"> </img>
</details>
<details> 
   <summary>toggle which nodes you want to see output from</summary>
   <img src="./img/VisibilityToggle.gif"> </img>
</details>
<details> 
   <summary>JSON prompt explorer (<b>.png only</b>)</summary>
   <img src="./img/JsonExplorer.gif"> </img>
</details>

### Custom Autocomplete (modified from ComfyUI-Custom-Scripts)
![image](./img/Autocomplete_basic.png)  
A customized version of the autocomplete feature from pythongosssss' ComfyUI-Custom-Scripts that includes some bugfixes and the following new features:
* <b> Lora Preferences </b>: the ability to automatically insert preferred activation text and weight for a lora

https://github.com/user-attachments/assets/56e1f849-a09f-4e97-bf6b-47da6f69cc8d

   - You can save and edit your preferences by opening the lora info via
     - either right clicking a lora in the comfy ui sidebar
     - clicking the info icon inside the autocomplete entry
   - This will bring up a modified version of lora info dialog from ComfyUI-Custom-Scripts with some additional areas where you can set your preferences for the lora
      1. ![image](https://raw.githubusercontent.com/kostenickj/comfyui-jk-easy-nodes/refs/heads/master/img/LoraPrefs.JPG)
1. Wildcard autocomplete
   - automatically detects installed wildcards in any extensions that support them (i think)
2. Add custom word files by putting them in the /tags dir of the extension, comes with danbooru.csv by default
   1. supports text or csv
3. various bug fixes that i encountered

NOTE: it will conflict with the original version from pythongosssss if you have it installed, so disable one of them in the settings manager

<br>
<br>

## Credits

pythongosssss/[ComfyUI-Custom-Scripts](https://github.com/comfyanonymous/ComfyUI) - The autocomplete and model dialog is heavily based on this work.
