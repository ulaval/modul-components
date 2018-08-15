export default class SubMenuPlugin {
    private isSubMenuVisible: boolean;
    private subButtons: any[];
    private menuButton: any;

    constructor(menuName: string, private editor: any, buttonNames: string[]) {
        const menuButtonCmd: string = `${menuName}-sub-menu`;
        this.isSubMenuVisible = false;
        this.menuButton = this.editor.$tb.find(`.fr-command[data-cmd="${menuButtonCmd}"]`);
        this.subButtons = buttonNames.map(name => this.editor.$tb.find(`.fr-command[data-cmd="${name}"]`));
    }

    public showSubMenu(): void {
        // hide toggle buttons
        this.editor.$tb.find(`.fr-command[data-cmd*="-sub-menu"]`).hide();
        // hide fullscreen buttons
        this.editor.$tb.find(`.fr-command[data-cmd="fullscreen"]`).hide();

        // show hide button
        this.editor.$tb.find(`.fr-command[data-cmd="hide"]`).show();
        // show sub-menu buttons
        this.subButtons.forEach(btn => btn.show());
        this.isSubMenuVisible = true;
    }

    public hideSubMenu(): void {
        // show toggle buttons
        this.editor.$tb.find(`.fr-command[data-cmd*="-sub-menu"]`).show();
        // show fullscreen buttons
        this.editor.$tb.find(`.fr-command[data-cmd="fullscreen"]`).show();

        // hide hide button
        this.editor.$tb.find(`.fr-command[data-cmd="hide"]`).hide();
        // show sub-menu buttons
        this.subButtons.forEach(btn => btn.hide());
        this.isSubMenuVisible = false;
    }
}
