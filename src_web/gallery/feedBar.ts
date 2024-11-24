export const FeedBarEvents = {
    'feed-clear': 'feed-clear'
};

export class JKFeedBar extends EventTarget {
    buttonGroup: HTMLDivElement;
    constructor(private el: HTMLDivElement) {
        super();
        this.el.classList.add('comfyui-menu', 'flex', 'items-center');
        this.buttonGroup = document.createElement('div');
        this.el.append(this.buttonGroup);
        this.buttonGroup.classList.add('comfyui-button-group');
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
