import Vue, { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';
import ButtonPlugin from '../button/button';
import { CHECKBOX_NAME } from '../component-names';
import CheckboxPlugin from './checkbox';
import WithRender from './checkbox.sandbox.html';

@WithRender
@Component
export class MCheckboxSandbox extends Vue {
    public disabledCheckboxValue: boolean = false;
    public disabledCheckbox: boolean = false;
    public checkboxReadOnlyValue: boolean = true;
    public isReadOnly: boolean = true;

    onClick(): void {
        alert('onClick');
    }
}

const CheckboxSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.use(ButtonPlugin);
        v.use(CheckboxPlugin);
        v.component(`${CHECKBOX_NAME}-sandbox`, MCheckboxSandbox);
    }
};

export default CheckboxSandboxPlugin;
