export default class SubMenuPlugin {
    private subButtons: any[];
    private isSubmenuVisible: boolean = false;

    constructor(private editor: any, buttonNames: string[]) {
        this.subButtons = buttonNames.map(name => this.editor.$tb.find(`.fr-command[data-cmd="${name}"]`));
    }

    public showSubMenu(): void {
        if (!this.isSubmenuVisible) {
            // hide fullscreen buttons
            this.editor.$tb.find(`.fr-command[data-cmd="fullscreen"]`).hide(200);
            // hide toggle buttons
            this.editor.$tb.find(`.fr-command[data-cmd*="-sub-menu"]`).hide(200, () => {
                // show hide button
                this.editor.$tb.find(`.fr-command[data-cmd="hide"]`).show(250);
                // show sub-menu buttons
                this.subButtons.forEach(btn => btn.show(250));
            });
            this.isSubmenuVisible = true;
        }

    }

    public hideSubMenu(): void {
        if (this.isSubmenuVisible) {
            // show sub-menu buttons
            this.subButtons.forEach(btn => btn.hide(200));

            // hide hide button
            this.editor.$tb.find(`.fr-command[data-cmd="hide"]`).hide(200, () => {
                // show toggle buttons
                this.editor.$tb.find(`.fr-command[data-cmd*="-sub-menu"]`).show(250);
                // show fullscreen buttons
                this.editor.$tb.find(`.fr-command[data-cmd="fullscreen"]`).show(250);
            });
            this.isSubmenuVisible = false;
        }
    }
}
