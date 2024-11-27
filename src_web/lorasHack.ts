import { TextAreaAutoComplete } from './common/autocomplete.js';

const logDebug = false;

// extremely hacky but it works. dont see another way to do this.
class LoraClickHacker {
    modelLibraryButton?: HTMLButtonElement | null;
    lorasListItemExpander?: HTMLLIElement | null;
    lorasButtonExpander?: HTMLButtonElement | null;

    // lora name from DOM -> lora key in textautocomplete loras
    static loraMapCache: Map<string, string> = new Map<string, string>();

    static walkUpListToFindFullLoraPath = (targetNode: HTMLElement, startNode: HTMLElement) => {
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

    constructor() {
        this.init();
        TextAreaAutoComplete.addEventListener('loras-refreshed', () => {
            if (logDebug) console.log('loras reloaded');
            LoraClickHacker.loraMapCache = new Map<string, string>();
        });
    }

    handleLoraClicked(ev: MouseEvent) {
        if (!TextAreaAutoComplete.enabled) return;

        const el = this as unknown as HTMLLIElement;
        ev.preventDefault();
        if (logDebug) console.log('lora clicked', el.innerText);

        const lorasInfoDict = TextAreaAutoComplete.groups['jk-nodes.loras']!;

        const cachedInfoKey = LoraClickHacker.loraMapCache.get(el.innerText);
        if (cachedInfoKey) {
            const info = lorasInfoDict[cachedInfoKey];
            if (info) {
                if (logDebug) console.log(`found cached lora with ${cachedInfoKey}`);
                info.info?.();
                return;
            }
            if (logDebug) console.log(`no lora found with ${cachedInfoKey}`);
        } else {
            if (logDebug) console.log(`no cached lora key found with ${el.innerText}`);
        }

        // there is like a million edge cases here, and i probably didnt catch them all

        const path = LoraClickHacker.walkUpListToFindFullLoraPath(document.querySelector('li.p-tree-node[aria-label="loras"]')!, el);
        const label = path.map((p) => p.ariaLabel);

        const loraPath = label.join('/').toLowerCase().replace('.safetensors', '');

        const found = Object.values(lorasInfoDict).find((l) => {
            const meta = l.meta;
            const outputName = meta?.ss_output_name as string | undefined;
            const modelName = meta?.ss_sd_model_name as string | undefined;
            if (outputName && outputName.toLowerCase() === el.innerText.toLowerCase()) {
                if (logDebug) console.log('matched output name');
                return true;
            }

            const baseLname = l?.lora_name?.toLowerCase() ?? '';
            const noExt = baseLname.substring(0, baseLname.lastIndexOf('.'));
            const lNamePath = baseLname.replaceAll('//', '/').replaceAll('\\', '/');
            const lNamePathNoExt = noExt.replaceAll('//', '/').replaceAll('\\', '/');
            if ([baseLname, noExt, lNamePath, lNamePathNoExt].includes(loraPath)) {
                if (logDebug) console.log('matched lora path');
                return true;
            }

            if (modelName && modelName.toLowerCase() === el.innerText.toLowerCase()) {
                if (logDebug) console.log('last resort matched model name');
                return true;
            } else if (outputName && outputName.match(el.innerText.toLowerCase())) {
                if (logDebug) console.log('output name match resort match');
                return true;
            } else if (baseLname?.toLowerCase()?.match(el.innerText.toLowerCase())) {
                if (logDebug) console.log('REALLY resort match, probably wrong...');
                return true;
            } else {
                return false;
            }
        });

        if (found) {
            LoraClickHacker.loraMapCache.set(el.innerText, found.text);
            found.info?.();
        }
    }

    recurse = (currentEl: HTMLLIElement) => {
        const children = currentEl.querySelectorAll('li');
        children.forEach((li) => {
            const maybeLoraFile = li.querySelector('.tree-leaf') as HTMLLIElement;
            if (maybeLoraFile) {
                if (logDebug) console.log('found lora', maybeLoraFile, maybeLoraFile.innerText);
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
            if (logDebug) console.log(`loras bar bar is ${isExpanded ? 'expanded' : 'closed'}`);
            if (isExpanded) {
                setTimeout(() => {
                    this.recurse(this.lorasListItemExpander!);
                }, 1);
            }
        }, 1);
    };

    tryAttachTopLevelListeners = () => {
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
                    if (logDebug) console.log('model library toggled');
                    this.tryAttachTopLevelListeners();
                });
            }
        }, 100);
    }
}
new LoraClickHacker();
