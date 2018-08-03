export class PopupPlugin {
    private buttonName: string;
    private pluginName: string;

    constructor(name: string, private editor: any, private buttonList: string[]) {
        this.buttonName = `${name}Popup`;
        this.pluginName = `${name}Plugin`;
    }

    public initPopup(): void {
        let buttons: string = (this.buttonList.length > 1) ? `<div class="fr-buttons">${this.editor.button.buildList(this.buttonList)}</div>` : '';

        // Load popup template.
        let template: any = {
            buttons: buttons,
            custom_layer: ''
        };

        return this.editor.popups.create(`${this.pluginName}.popup`, template);
    }

    public showPopup(): void {
        // To improve performance it is best to create the popup when it is first needed
        // and not when the editor is initialized.
        if (!this.editor.popups.get(`${this.pluginName}.popup`)) {
            this.initPopup();
        }

        // Set the editor toolbar as the popup's container.
        this.editor.popups.setContainer(`${this.pluginName}.popup`, this.editor.$tb);

        // This custom popup is opened by pressing a button from the editor's toolbar.
        // Get the button's object in order to place the popup relative to it.
        let btn: any = this.editor.$tb.find(`.fr-command[data-cmd="${this.buttonName}"]`);

        // Set the popup's position right under the button.
        let left: any = btn.offset().left + btn.outerWidth() / 2;
        let top: any = btn.offset().top + (this.editor.opts.toolbarBottom ? 10 : btn.outerHeight() - 10);

        // The button's outerHeight is required in case the popup needs to be displayed above it.
        this.editor.popups.show(`${this.pluginName}.popup`, left, top, btn.outerHeight());
    }

    public hidePopup(): void {
        this.editor.popups.hide(`${this.pluginName}.popup`);
    }
}
