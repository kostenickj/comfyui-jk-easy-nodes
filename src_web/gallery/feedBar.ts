export enum EFeedBarEvents {
    'feed-clear' = 'feed-clear',
    'check-change' = 'check-change',
    'feed-mode' = 'feed-mode'
}
export enum EFeedMode {
    feed = 'feed',
    grid = 'grid'
}

export class FeedBarEvent<T> extends CustomEvent<T> {
    constructor(eventType: EFeedBarEvents, payload: T) {
        super(eventType, { detail: payload });
    }
}

import type SlDropdown from '@shoelace-style/shoelace/dist/components/dropdown/dropdown.js';
import type SLMenu from '@shoelace-style/shoelace/dist/components/menu/menu.js';
import type SLmenuItem from '@shoelace-style/shoelace/dist/components/menu-item/menu-item.js';
export class JKFeedBar extends EventTarget {
    rightButtonGroup: HTMLDivElement;
    leftButtonGroup: HTMLDivElement;
    checkboxMenuWrapper: HTMLDivElement;
    checkboxMenuDropdown: SlDropdown;
    checkBoxMenuMenu: SLMenu;

    currentMode: EFeedMode = EFeedMode.feed;

    private _checkedItems: Map<string, boolean> = new Map<string, boolean>();

    public get checkedItems() {
        return this._checkedItems;
    }

    constructor(private el: HTMLDivElement) {
        super();
        this.el.classList.add('comfyui-menu', 'flex', 'items-center', 'justify-start');
        this.rightButtonGroup = document.createElement('div');
        this.el.append(this.rightButtonGroup);
        this.rightButtonGroup.classList.add('comfyui-button-group', 'right');

        this.leftButtonGroup = document.createElement('div');
        this.el.append(this.leftButtonGroup);
        this.leftButtonGroup.classList.add('comfyui-button-group', 'center');

        this.checkboxMenuWrapper = document.createElement('div');
        this.checkboxMenuWrapper.classList.add('jk-checkbox-wrapper');
        this.checkboxMenuWrapper.innerHTML = `
            <sl-dropdown id="jk-checkbox-menu-dropdown" stay-open-on-select="true">
            <sl-button title="Toggle which images node to show" class="checkbox-menu-trigger" size="small" variant="neutral" slot="trigger" caret>Toggle Node Visibility</sl-button>
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
            this.dispatchEvent(new FeedBarEvent(EFeedBarEvents['check-change'], {}));
        });
    }

    private createMenuItem(item: string, isChecked: boolean) {
        const menuItem = document.createElement('sl-menu-item') as SLmenuItem;
        menuItem.type = 'checkbox';
        menuItem.value = item;
        menuItem.innerText = item;
        menuItem.checked = isChecked;
        return menuItem;
    }

    public addCheckboxOptionIfNeeded(item: string, isChecked: boolean) {
        let needsInsert = false;
        if (!this.checkedItems.has(item)) {
            needsInsert = true;
        }

        this.checkedItems.set(item, isChecked);
        if (needsInsert) {
            const menuItem = this.createMenuItem(item, isChecked);
            this.checkBoxMenuMenu.appendChild(menuItem);
        }
    }

    public updateCheckboxOptions(items: string[], checkAll: boolean) {
        this.checkBoxMenuMenu.innerHTML = '';
        items.forEach((x) => {
            const menuItem = this.createMenuItem(x, checkAll || this.checkedItems.get(x) ? true : false);
            this.checkBoxMenuMenu.appendChild(menuItem);
        });

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
                this.dispatchEvent(new FeedBarEvent(EFeedBarEvents['feed-clear'], {}));
            },
            tooltip: 'Clear the feed',
            content: 'Clear Feed'
        });

        const feedModeButton = new ComfyButton({
            icon: 'image-frame',
            action: () => {
                if(this.currentMode !== EFeedMode.feed)
                    {
                        this.currentMode = EFeedMode.feed;
                        feedModeButton.element.classList.add('primary');
                        gridModeButton.element.classList.remove('primary');
                        this.dispatchEvent(new FeedBarEvent(EFeedBarEvents['feed-mode'], EFeedMode.feed));
                    }
            },
            tooltip: 'Feed Display Node',
            content: 'Feed'
        });

        feedModeButton.element.classList.add('primary');

        const gridModeButton = new ComfyButton({
            icon: 'view-grid',
            action: () => {
                if(this.currentMode !== EFeedMode.grid)
                {
                    this.currentMode = EFeedMode.grid;
                    gridModeButton.element.classList.add('primary');
                    feedModeButton.element.classList.remove('primary');
                    this.dispatchEvent(new FeedBarEvent(EFeedBarEvents['feed-mode'], EFeedMode.grid));
                }
           
            },
            tooltip: 'Grid Display Mode',
            content: 'Grid'
        });

        this.rightButtonGroup.append(clearFeedButton.element);
        this.leftButtonGroup.append(feedModeButton.element, gridModeButton.element);
    }
}
