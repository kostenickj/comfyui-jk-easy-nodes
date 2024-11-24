export const FeedBarEvents = {
    'feed-clear': 'feed-clear',
    'check-change': 'check-change'
};
import type SlDropdown from '@shoelace-style/shoelace/dist/components/dropdown/dropdown.js';
import type SLMenu from '@shoelace-style/shoelace/dist/components/menu/menu.js';
import type SLmenuItem from '@shoelace-style/shoelace/dist/components/menu-item/menu-item.js';
export class JKFeedBar extends EventTarget {
    buttonGroup: HTMLDivElement;
    checkboxMenuWrapper: HTMLDivElement;
    checkboxMenuDropdown: SlDropdown;
    checkBoxMenuMenu: SLMenu;

    private _checkedItems: Map<string, boolean> = new Map<string, boolean>();

    public get checkedItems() {
        return this._checkedItems;
    }

    constructor(private el: HTMLDivElement) {
        super();
        this.el.classList.add('comfyui-menu', 'flex', 'items-center');
        this.buttonGroup = document.createElement('div');
        this.el.append(this.buttonGroup);
        this.buttonGroup.classList.add('comfyui-button-group');

        this.checkboxMenuWrapper = document.createElement('div');
        this.checkboxMenuWrapper.classList.add('jk-checkbox-wrapper');
        this.checkboxMenuWrapper.innerHTML = `
            <sl-dropdown id="jk-checkbox-menu-dropdown" stay-open-on-select="true">
            <sl-button class="checkbox-menu-trigger" size="small" variant="neutral" slot="trigger" caret>Toggle Outputs</sl-button>
            <sl-menu id="jk-checkbox-menu-menu">           
            </sl-menu>
            </sl-dropdown>
            <style>
                sl-button.checkbox-menu-trigger::part(base) { 
                    font-size:16px;
                    background-color: var(--comfy-menu-bg);
                    min-width: 250px;
                    text-align:left;
                    display: flex;
                    align-items: center;
                    justify-content: flex-start;
                }
                    sl-button.checkbox-menu-trigger::part(caret) { 
                        margin-left: auto;
                    }
                    sl-menu{
                        background-color: var(--comfy-menu-bg);
                        min-width: 250px;
                        color:  var(--fg-color);
                        sl-menu-item::part(base){
                            color:  var(--fg-color);
                            background-color: var(--comfy-menu-bg);
                        }
                        sl-menu-item::part(base):hover{
                            background-color: var(--primary-hover-bg);
                        }
                    }
            </style>
        `;
        this.el.prepend(this.checkboxMenuWrapper);
        this.checkboxMenuDropdown = document.getElementById('jk-checkbox-menu-dropdown') as SlDropdown;
        this.checkBoxMenuMenu = document.getElementById('jk-checkbox-menu-menu') as SLMenu;

        this.checkBoxMenuMenu.addEventListener('sl-select', (ev) => {
            const item: SLmenuItem = (ev as any)?.detail?.item;
            this._checkedItems.set(item.value, item.checked);
            this.dispatchEvent(new Event(FeedBarEvents['check-change']));
        });
    }

    public updateCheckboxOptions(items: string[], checkAll: boolean) {
        this.checkBoxMenuMenu.innerHTML = `${items.map((i) => {
            return `<sl-menu-item type="checkbox" ${!!(checkAll || this._checkedItems.get(i)) ? 'checked' : ''} value="${i}">${i}</sl-menu-item>`
        })}`;
        if (checkAll) {
            this._checkedItems.clear();
            items.forEach((x) => {
                this._checkedItems.set(x, true);
            });
        }
    }

    async init() {
        //@ts-ignore
        const ComfyButton = (await import('../../../scripts/ui/components/button.js')).ComfyButton;

        const clearFeedButton = new ComfyButton({
            icon: 'nuke',
            action: () => {
                this.dispatchEvent(new Event(FeedBarEvents['feed-clear']));
            },
            tooltip: 'Clear the feed',
            content: 'Clear Feed'
        });
        this.buttonGroup.append(clearFeedButton.element);
    }
}
