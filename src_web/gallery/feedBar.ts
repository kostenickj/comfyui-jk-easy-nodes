export class JKFeedBar {
    buttonGroup: HTMLDivElement;
    constructor(private el: HTMLDivElement) {
        this.el.classList.add('comfyui-menu', 'flex', 'items-center');
        this.buttonGroup = document.createElement('div');
        this.el.append(this.buttonGroup);
        this.buttonGroup.classList.add('comfyui-button-group')
    }

    async init() {
        //@ts-ignore
        const ComfyButton = (await import('../../../scripts/ui/components/button.js')).ComfyButton;

        const test = new ComfyButton({
            icon: 'image-multiple',
            action: () => {
                console.log('gldkdkd');
            },
            tooltip: 'Toggle Image Window',
            content: 'test button'
        });
        this.buttonGroup.append(test.element);
        console.log(test);
    }
}
