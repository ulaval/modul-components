import { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';
import { FormControl, FormGroup } from '../../utils/form/form-control';
import { ModulVue } from '../../utils/vue/vue';
import { FORM } from '../component-names';
import FormPlugin from './form.plugin';
import WithRender from './form.sandbox.html';

@WithRender
@Component

export class MFormSandbox extends ModulVue {

    formGroup: FormGroup = new FormGroup(
        'my form',
        [],
        [
            new FormControl<string>('name', [
                {
                    validationFunction: (formControl: FormControl<string>): boolean => {
                        return !!formControl.value;
                    },
                    key: 'required',
                    message: 'error message'
                }
            ])
        ]
    );

    submit(): void {
        alert('ok');
    }

    reset(): void {
        // let x: number = 1;
    }

}

const MFormSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.use(FormPlugin);
        v.component(`${FORM}-sandbox`, MFormSandbox);
    }
};

export default MFormSandboxPlugin;
