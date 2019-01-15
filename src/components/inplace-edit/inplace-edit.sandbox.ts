import Vue, { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';
import { INPLACE_EDIT_NAME } from '../component-names';
import WithRender from './inplace-edit.sandbox.html';


@WithRender
@Component
export class MInplaceEditSandbox extends Vue {
    value1: string = 'a default value';
    editMode1: boolean = false;
    editMode2: boolean = false;
    editMode3: boolean = false;
    editMode4: boolean = false;
    editorPadding: number = 10;
    editorEditModePadding: number = 10;

    private click1(): void {
        this.editMode1 = true;
    }
    private click2(): void {
        this.editMode2 = true;
    }
    private click3(): void {
        this.editMode3 = true;
    }
    private click4(): void {
        this.editMode4 = true;
    }
}

const InplaceEditSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.component(`${INPLACE_EDIT_NAME}-sandbox`, MInplaceEditSandbox);
    }
};

export default InplaceEditSandboxPlugin;
