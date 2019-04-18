import { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';
import { AbstractControlValidationType, FormControl, FormGroup } from '../../utils/form/form-control';
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
            new FormControl<string>('name',
                [
                    {
                        validationFunction: (formControl: FormControl<string>): boolean => {
                            return !!formControl.value;
                        },
                        error: {
                            key: 'required',
                            message: 'this field is required'
                        }
                    }
                ],
                '',
                {
                    validationType: AbstractControlValidationType.Correctable
                }
            )
        ]
    );

    submit(): void {
    }

    reset(): void {
    }
}

const MFormSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.use(FormPlugin);
        v.component(`${FORM}-sandbox`, MFormSandbox);
    }
};

export default MFormSandboxPlugin;
