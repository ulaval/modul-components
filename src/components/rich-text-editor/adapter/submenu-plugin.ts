enum FROALA_CMD {
    FULLSCREEN_CMD = 'fullscreen',
    LINK_CMD = 'insertLink',
    SPECIAL_CMD = 'specialCharacters',
    HIDE_CMD = 'hide',
    SUBMENU_CMD = '-sub-menu',
    IMAGE_CMD = 'insertImage'
}

export default class SubMenuPlugin {
    private subButtons: any[];
    private isSubmenuVisible: boolean = false;
    private HIDE_ANIMATION_DURATION: number = 200;
    private SHOW_ANIMATION_DURATION: number = 200;

    constructor(private editor: any, buttonNames: string[]) {
        this.subButtons = buttonNames.map(name => this.editor.$tb.find(`.fr-command[data-cmd="${name}"]`));
    }

    public showSubMenu(): void {
        if (!this.isSubmenuVisible) {
            // hide buttons that are not in submenus
            this.editor.$tb.find(`.fr-command[data-cmd="${FROALA_CMD.FULLSCREEN_CMD}"]`).hide(this.HIDE_ANIMATION_DURATION);
            this.editor.$tb.find(`.fr-command[data-cmd="${FROALA_CMD.LINK_CMD}"]`).hide(this.HIDE_ANIMATION_DURATION);
            this.editor.$tb.find(`.fr-command[data-cmd="${FROALA_CMD.SPECIAL_CMD}"]`).hide(this.HIDE_ANIMATION_DURATION);
            this.editor.$tb.find(`.fr-command[data-cmd="${FROALA_CMD.IMAGE_CMD}"]`).hide(this.HIDE_ANIMATION_DURATION);
            // hide toggle buttons
            this.editor.$tb.find(`.fr-command[data-cmd*="${FROALA_CMD.SUBMENU_CMD}"]`).hide(this.HIDE_ANIMATION_DURATION, () => {
                // show hide button
                this.editor.$tb.find(`.fr-command[data-cmd="${FROALA_CMD.HIDE_CMD}"]`).show(this.SHOW_ANIMATION_DURATION);
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
            this.editor.$tb.find(`.fr-command[data-cmd="${FROALA_CMD.HIDE_CMD}"]`).hide(this.HIDE_ANIMATION_DURATION, () => {
                // show toggle buttons
                this.editor.$tb.find(`.fr-command[data-cmd*="${FROALA_CMD.SUBMENU_CMD}"]`).show(this.SHOW_ANIMATION_DURATION);
                // show buttons that are not in submenus
                this.editor.$tb.find(`.fr-command[data-cmd="${FROALA_CMD.FULLSCREEN_CMD}"]`).show(this.SHOW_ANIMATION_DURATION);
                this.editor.$tb.find(`.fr-command[data-cmd="${FROALA_CMD.LINK_CMD}"]`).show(this.SHOW_ANIMATION_DURATION);
                this.editor.$tb.find(`.fr-command[data-cmd="${FROALA_CMD.SPECIAL_CMD}"]`).show(this.SHOW_ANIMATION_DURATION);
                this.editor.$tb.find(`.fr-command[data-cmd="${FROALA_CMD.IMAGE_CMD}"]`).show(this.SHOW_ANIMATION_DURATION);
            });
            this.isSubmenuVisible = false;
        }
    }
}
