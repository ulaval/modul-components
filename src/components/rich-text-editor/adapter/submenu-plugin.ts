/* tslint:disable:no-console */
export default class SubMenuPlugin {
    private isSubMenuVisible: boolean;
    private subButtons: any[];
    private menuButton: any;

    constructor(menuName: string, private editor: any, buttonNames: string[]) {
        const menuButtonCmd: string = `${menuName}-sub-menu`;
        this.isSubMenuVisible = false;
        this.menuButton = this.editor.$tb.find(`.fr-command[data-cmd="${menuButtonCmd}"]`);
        this.subButtons = buttonNames.map(name => this.editor.$tb.find(`.fr-command[data-cmd="${name}"]`));
        console.log(this.menuButton);
    }

    public toggle(): void {
        (this.isSubMenuVisible) ? this.hideSubmenu() : this.showSubmenu();
    }

    private showSubmenu(): void {
        console.log('showSubmenu');
        this.isSubMenuVisible = true;
    }

    private hideSubmenu(): void {
        console.log('hideSubmenu');
        this.isSubMenuVisible = false;
    }
}
