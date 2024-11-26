import { TextAreaAutoComplete } from './common/autocomplete.js';

const walkUpListToFindFullLoraPath = (targetNode: HTMLElement, startNode: HTMLElement) => {
    const path = [];
    let currentNode = startNode;

    while (currentNode !== targetNode && currentNode !== null) {
        if (currentNode instanceof HTMLLIElement) {
            path.unshift(currentNode);
        }

        currentNode = currentNode.parentElement! as any;
    }

    if (currentNode === targetNode) {
        return path;
    } else {
        return [];
    }
};

// extremely hacky but it works. dont see another way to do this.
class LoraClickHacker {
    modelLibraryButton?: HTMLButtonElement | null;
    lorasListItemExpander?: HTMLLIElement | null;
    lorasButtonExpander?: HTMLButtonElement | null;

    constructor() {
        this.init();
    }

    handleLoraClicked(ev: MouseEvent) {
        const el = this as unknown as HTMLLIElement;
        ev.preventDefault();
        //console.log('lora clicked', el.innerText);

        // like a million edge cases here, probably didnt catch them all

        const path = walkUpListToFindFullLoraPath(document.querySelector('li.p-tree-node[aria-label="loras"]')!, el);
        const label = path.map((p) => p.ariaLabel);

        const loraPath = label.join('/').toLowerCase().replace('.safetensors', '');
        const lorasDict = TextAreaAutoComplete.groups['jk-nodes.loras']!;

        const found = Object.values(lorasDict).find((l) => {
            const meta = l.meta;
            const outputName = meta?.ss_output_name as string | undefined;
            const modelName = meta?.ss_sd_model_name as string | undefined;
            if (outputName && outputName.toLowerCase() === el.innerText.toLowerCase()) {
                console.log('matched output name');
                return true;
            }

            const baseLname = l?.lora_name?.toLowerCase() ?? '';
            const noExt = baseLname.substring(0, baseLname.lastIndexOf('.'));
            const lNamePath = baseLname.replaceAll('//', '/').replaceAll('\\', '/');
            const lNamePathNoExt = noExt.replaceAll('//', '/').replaceAll('\\', '/');
            if ([baseLname, noExt, lNamePath, lNamePathNoExt].includes(loraPath)) {
                console.log('matched lora path');
                return true;
            }

            if (modelName && modelName.toLowerCase() === el.innerText.toLowerCase()) {
                console.log('last resort matched model name');
                return true;
            } else if (outputName && outputName.match(el.innerText.toLowerCase())) {
                console.log('output name match resort match');
                return true;
            } else if (baseLname?.toLowerCase()?.match(el.innerText.toLowerCase())) {
                console.log('REALLY resort match, probably wrong...');
                return true;
            } else {
                return false;
            }
        });

        if (found) {
            found.info?.();
        }
    }

    recurse = (currentEl: HTMLLIElement) => {
        const children = currentEl.querySelectorAll('li');
        children.forEach((li) => {
            const maybeLoraFile = li.querySelector('.tree-leaf') as HTMLLIElement;
            if (maybeLoraFile) {
                // console.log('found lora', maybeLoraFile, maybeLoraFile.innerText);
                maybeLoraFile.removeEventListener('contextmenu', this.handleLoraClicked);
                maybeLoraFile.addEventListener('contextmenu', this.handleLoraClicked);
            } else {
                this.recurse(li);
            }
        });
    };

    handleLorasExpanded = (ev: Event) => {
        setTimeout(() => {
            const isExpanded = this.lorasListItemExpander?.ariaExpanded === 'true';
            // console.log(`loras bar bar is ${isExpanded ? 'expanded' : 'closed'}`);
            if (isExpanded) {
                setTimeout(() => {
                    this.recurse(this.lorasListItemExpander!);
                }, 1);
            }
        }, 1);
    };

    attachTopLevelListeners = () => {
        this.lorasListItemExpander = document.querySelector('li.p-tree-node[aria-label="loras"]');
        this.lorasButtonExpander = this.lorasListItemExpander?.querySelector('button');
        // click wasnt working consistently for some reason, hence mouseup
        this.lorasListItemExpander?.removeEventListener('mouseup', this.handleLorasExpanded);
        this.lorasListItemExpander?.addEventListener('mouseup', this.handleLorasExpanded);
        this.lorasButtonExpander?.removeEventListener('mouseup', this.handleLorasExpanded);
        this.lorasButtonExpander?.addEventListener('mouseup', this.handleLorasExpanded);
    };

    init() {
        const interval = setInterval(() => {
            this.modelLibraryButton = document.querySelector('button[aria-label="Model Library (m)"]');
            if (this.modelLibraryButton) {
                clearInterval(interval);
                this.modelLibraryButton.addEventListener('click', (ev) => {
                    console.log('model library toggled');
                    this.attachTopLevelListeners();
                });
            }
        }, 100);
    }
}
new LoraClickHacker();
