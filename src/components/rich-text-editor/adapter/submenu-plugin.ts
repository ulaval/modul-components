export default class SubMenuPlugin {
    private subButtons: any[];
    private isSubmenuVisible: boolean = false;
    private HIDE_ANIMATION_DURATION: number = 200;
    private SHOW_ANIMATION_DURATION: number = 200;
    private FULLSCREEN_CMD: string = 'fullscreen';
    private HIDE_CMD: string = 'hide';
    private SUBMENU_CMD: string = '-sub-menu';

    constructor(private editor: any, buttonNames: string[]) {
        this.subButtons = buttonNames.map(name => this.editor.$tb.find(`.fr-command[data-cmd="${name}"]`));
    }

    public showSubMenu(): void {
        if (!this.isSubmenuVisible) {
            // hide fullscreen buttons
            this.editor.$tb.find(`.fr-command[data-cmd="${this.FULLSCREEN_CMD}"]`).hide(this.HIDE_ANIMATION_DURATION);
            // hide toggle buttons
            this.editor.$tb.find(`.fr-command[data-cmd*="${this.SUBMENU_CMD}"]`).hide(this.HIDE_ANIMATION_DURATION, () => {
                // show hide button
                this.editor.$tb.find(`.fr-command[data-cmd="${this.HIDE_CMD}"]`).show(this.SHOW_ANIMATION_DURATION);
                // show sub-menu buttons
                this.subButtons.forEach(btn => btn.show(this.SHOW_ANIMATION_DURATION));
            });
            this.isSubmenuVisible = true;
        }

    }

    public hideSubMenu(): void {
        if (this.isSubmenuVisible) {
            // show sub-menu buttons
            this.subButtons.forEach(btn => btn.hide(this.HIDE_ANIMATION_DURATION));

            // hide hide button
            this.editor.$tb.find(`.fr-command[data-cmd="${this.HIDE_CMD}"]`).hide(this.HIDE_ANIMATION_DURATION, () => {
                // show toggle buttons
                this.editor.$tb.find(`.fr-command[data-cmd*="${this.SUBMENU_CMD}"]`).show(this.SHOW_ANIMATION_DURATION);
                // show fullscreen buttons
                this.editor.$tb.find(`.fr-command[data-cmd="${this.FULLSCREEN_CMD}"]`).show(this.SHOW_ANIMATION_DURATION);
            });
            this.isSubmenuVisible = false;
        }
    }
}
