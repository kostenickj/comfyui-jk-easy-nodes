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
      ![image](https://github.com/user-attachments/assets/221be6de-1a3c-4fa7-aefc-3934e65401c3)

   </details> 
   <details> 
      <summary>Grid mode or single image</summary>
      ![image](https://github.com/user-attachments/assets/ffc2330d-160f-4c49-8140-38325485ade3)

   </details>
   <details> 
      <summary>toggle which nodes you want to see output from</summary>
      ![image](https://github.com/user-attachments/assets/81bbe16b-9e68-4a0a-83a4-97ea1de58a0a)

   </details>
     <details> 
      <summary>JSON prompt explorer (<b>.png only</b>)</summary>
      ![image](https://github.com/user-attachments/assets/bec84c45-9c12-4152-8e1a-64ababcd5e0e)

   </details>

### Custom Autocomplete (modified from ComfyUI-Custom-Scripts)
![image](https://github.com/pythongosssss/ComfyUI-Custom-Scripts/assets/125205205/b5971135-414f-4f4e-a6cf-2650dc01085f)  
A customized version of the autocomplete feature from pythongosssss' ComfyUI-Custom-Scripts that includes some bugfixes and the following new features:
1. <b> Lora Preferences </b>: the ability to automatically insert preferred activation text and weight for a lora
   - ![image](todo)
   - You can save and edit your preferences by opening the lora info via
     - either right clicking a lora in the comfy ui sidebar
     - clicking the info icon inside the autocomplete entry
   - This will bring up a modified version of lora info dialog from ComfyUI-Custom-Scripts with some additional areas where you can set your preferences for the lora
      1. ![image](https://raw.githubusercontent.com/kostenickj/comfyui-jk-easy-nodes/refs/heads/master/img/LoraPrefs.JPG)
2. Wildcard autocomplete
   - automatically detects installed wildcards in any extensions that support them (i think)
3. Add custom word files by putting them in the /tags dir of the extension, comes with danbooru.csv by default
   1. supports text or csv
4. various bug fixes that i encountered

NOTE: it will conflict with the original version from pythongosssss if you have it installed, so disable one of them in the settings manager

<br>
<br>

## Credits

pythongosssss/[ComfyUI-Custom-Scripts](https://github.com/comfyanonymous/ComfyUI) - The autocomplete and model dialog is heavily based on this work.
