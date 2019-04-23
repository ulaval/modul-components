import { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';
import { AbstractControlValidationType } from '../../utils/form/abstract-control-validation-type';
import { FormControl } from '../../utils/form/form-control';
import { FormGroup } from '../../utils/form/form-group';
import { ModulVue } from '../../utils/vue/vue';
import { FORM } from '../component-names';
import { AbstractControlMinLengthValidator, AbstractControlRequiredValidator } from './abstract-control-validations';
import FormPlugin from './form.plugin';
import WithRender from './form.sandbox.html';

@WithRender
@Component

export class MFormSandbox extends ModulVue {

    formGroup: FormGroup = new FormGroup(
        'my form',
        [],
        [
            new FormControl<string>(
                'name',
                [
                    AbstractControlRequiredValidator('name'),
                    AbstractControlMinLengthValidator('name', 5)
                ],
                {
                    validationType: AbstractControlValidationType.AtExit,
                    initialValue: 'Jon Doe'
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
