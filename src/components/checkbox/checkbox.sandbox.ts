import Vue, { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';
import { CHECKBOX_NAME } from '../component-names';
import { MCheckboxPosition } from './checkbox';
import WithRender from './checkbox.sandbox.html';

@WithRender
@Component
export class MCheckboxSandbox extends Vue {
    public disabledCheckboxValue: boolean = false;
    public disabledCheckbox: boolean = false;
    public checkboxReadOnlyValue: boolean = true;
    public isReadOnly: boolean = true;
    public checkboxPosition: MCheckboxPosition = MCheckboxPosition.Left;

    get checkboxPositionAsArray(): any {
        return MCheckboxPosition;
    }
}

const CheckboxSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.component(`${CHECKBOX_NAME}-sandbox`, MCheckboxSandbox);
    }
};

export default CheckboxSandboxPlugin;
