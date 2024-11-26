import { TextAreaAutoComplete } from './common/autocomplete.js';
import { LoraInfoDialog } from './modelInfo.js';

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

        // almost working but its not finding all clicks...
        const lorasDict = TextAreaAutoComplete.groups['jk-nodes.loras']!;

        const found = Object.values(lorasDict).find((l) => {
            const lName = l.lora_name?.substring(0, l.lora_name.lastIndexOf('.')) || l.lora_name
            return lName?.toLowerCase()?.match(el.innerText.toLowerCase());
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
