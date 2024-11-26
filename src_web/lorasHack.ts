import { TextAreaAutoComplete } from './common/autocomplete.js';

const walkUpListToFindFullLoraPath = (targetNode: HTMLElement, startNode: HTMLElement) => {
    const path = [];
    let currentNode = startNode;

    while (currentNode !== targetNode && currentNode !== null) {
        if(currentNode instanceof HTMLLIElement)
        {
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
        console.log('lora clicked', el.innerText);

        const path = walkUpListToFindFullLoraPath(document.querySelector('li.p-tree-node[aria-label="loras"]')!, el);
        console.log(path);
        const label = path.map(p => p.ariaLabel);
        // TODO, use this instead!
        const loraPath = label.join('/');
        console.log(loraPath);
        // almost working but its not finding all clicks...
        // i need to walk up the element tree and find thje full patth to think loras i think :(... or store it during the recursion
        const lorasDict = TextAreaAutoComplete.groups['jk-nodes.loras']!;

        const found = Object.values(lorasDict).find((l) => {
            const meta = l.meta;
            if (meta) {
                console.log(meta);
                if ((meta?.ss_sd_model_name as string)?.toLowerCase().match(el.innerText.toLowerCase())) {
                    return true;
                }
            }

            const lName = l.lora_name?.substring(0, l.lora_name.lastIndexOf('.')) || l.lora_name;
            if (lName?.toLowerCase()?.match(el.innerText.toLowerCase())) {
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
                maybeLoraFile.removeEventListener('click', this.handleLoraClicked);
                maybeLoraFile.addEventListener('click', this.handleLoraClicked);
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
