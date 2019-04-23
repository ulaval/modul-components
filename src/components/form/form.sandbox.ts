import { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';
import { AbstractControlValidationType } from '../../utils/form/abstract-control';
import { FormControl } from '../../utils/form/form-control';
import { FormGroup } from '../../utils/form/form-group';
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
        AbstractControlValidationType.Optimistic,
        [
            new FormControl<string>('name',
                AbstractControlValidationType.Optimistic,
                [
                    {
                        validationFunction: (formControl: FormControl<string>): boolean => {
                            return !!formControl.value;
                        },
                        error: {
                            key: 'required',
                            message: 'this field is required',
                            summaryMessage: 'the field name is required'
                        }
                    }
                ],
                ''
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
