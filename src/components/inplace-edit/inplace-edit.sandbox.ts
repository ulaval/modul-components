import Vue, { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';
import { INPLACE_EDIT_NAME } from '../component-names';
import TextfieldPlugin from '../textfield/textfield';
import InplaceEditPlugin from './inplace-edit';
import WithRender from './inplace-edit.sandbox.html';


@WithRender
@Component
export class MInplaceEditSandbox extends Vue {
    private value1: string = 'a default value';
    private editMode1: boolean = false;
    private editMode2: boolean = false;
    private editMode3: boolean = false;
    private editMode4: boolean = false;

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
        v.use(InplaceEditPlugin);
        v.use(TextfieldPlugin);
        v.component(`${INPLACE_EDIT_NAME}-sandbox`, MInplaceEditSandbox);
    }
};

export default InplaceEditSandboxPlugin;
