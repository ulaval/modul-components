export default class SubMenuPlugin {
    private isSubMenuVisible: boolean;
    private subButtons: any[];
    private menuButton: any;

    constructor(menuName: string, private editor: any, buttonNames: string[]) {
        const menuButtonCmd: string = `${menuName}-sub-menu`;
        this.isSubMenuVisible = false;
        this.menuButton = this.editor.$tb.find(`.fr-command[data-cmd="${menuButtonCmd}"]`);
        this.subButtons = buttonNames.map(name => this.editor.$tb.find(`.fr-command[data-cmd="${name}"]`));

        this.editor.$wp.click(() => { this.hideSubmenu(); });
    }

    public showSubMenu(): void {
        // hide toggle buttons
        this.editor.$tb.find(`.fr-command[data-cmd*="-sub-menu"]`).hide();
        // hide fullscreen buttons
        this.editor.$tb.find(`.fr-command[data-cmd="fullscreen"]`).hide();

        this.subButtons.forEach(btn => btn.show());
        this.isSubMenuVisible = true;
    }

    public hideSubmenu(): void {
        // show toggle buttons
        this.editor.$tb.find(`.fr-command[data-cmd*="-sub-menu"]`).show();
        // hide fullscreen buttons
        this.editor.$tb.find(`.fr-command[data-cmd="fullscreen"]`).show();

        this.subButtons.forEach(btn => btn.hide());
        this.isSubMenuVisible = false;
    }
}
