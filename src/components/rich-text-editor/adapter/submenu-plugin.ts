export default class SubMenuPlugin {
    private subButtons: any[];

    constructor(private editor: any, buttonNames: string[]) {
        this.subButtons = buttonNames.map(name => this.editor.$tb.find(`.fr-command[data-cmd="${name}"]`));
    }

    public showSubMenu(): void {
        // hide fullscreen buttons
        this.editor.$tb.find(`.fr-command[data-cmd="fullscreen"]`).hide(200);
        // hide toggle buttons
        this.editor.$tb.find(`.fr-command[data-cmd*="-sub-menu"]`).hide(200, () => {
            // show hide button
            this.editor.$tb.find(`.fr-command[data-cmd="hide"]`).show(250);
            // show sub-menu buttons
            this.subButtons.forEach(btn => btn.show(250));
        });

    }

    public hideSubMenu(): void {
        // show sub-menu buttons
        this.subButtons.forEach(btn => btn.hide(200));

        // hide hide button
        this.editor.$tb.find(`.fr-command[data-cmd="hide"]`).hide(200, () => {
            // show toggle buttons
            this.editor.$tb.find(`.fr-command[data-cmd*="-sub-menu"]`).show(250);
            // show fullscreen buttons
            this.editor.$tb.find(`.fr-command[data-cmd="fullscreen"]`).show(250);
        });
    }
}
