import { withA11y } from '@storybook/addon-a11y';
import { withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/vue';
import Vue from 'vue';
import { componentsHierarchyRootSeparator } from '../../../conf/storybook/utils';
import { ControlValidatorValidationType } from '../../utils/form/control-validator-validation-type';
import { FormControl } from '../../utils/form/form-control';
import { FormGroup } from '../../utils/form/form-group';
import { BetweenValidator } from '../../utils/form/validators/between/between';
import { CompareValidator } from '../../utils/form/validators/compare/compare';
import { EmailValidator } from '../../utils/form/validators/email/email';
import { MaxLengthValidator } from '../../utils/form/validators/max-length/max-length';
import { MaxValidator } from '../../utils/form/validators/max/max';
import { MinLengthValidator } from '../../utils/form/validators/min-length/min-length';
import { MinValidator } from '../../utils/form/validators/min/min';
import { RequiredValidator } from '../../utils/form/validators/required/required';
import { FORM_NAME } from '../component-names';
import { ClearErrorToast, ClearSummaryMessage, ErrorToast, FocusOnFirstError, SummaryMessage } from './fallouts/built-in-form-action-fallouts';
import FormPlugin from './form.plugin';

Vue.use(FormPlugin);

declare module '@storybook/addon-knobs' {
    export function withKnobs(): any;
}

storiesOf(`${componentsHierarchyRootSeparator}${FORM_NAME}`, module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .add('default', () => ({
        methods: {
            submit: () => {
                Vue.prototype.$log.log('submited');
            },
            reset: () => {
                Vue.prototype.$log.log('reseted');
            }
        },
        data: () => ({
            formGroup: new FormGroup(
                'my form',
                [
                    new FormControl<string>(
                        'name',
                        []
                    )
                ]
            )
        }),
        template: `
        <m-form class="m-u--margin-top"
                :form-group="formGroup"
                @reset="reset()"
                @submit="submit()">
            <m-textfield v-model.trim="formGroup.getControl('name').value"
                        :error-message="formGroup.getControl('name').errors.length > 0 ? formGroup.getControl('name').errors[0].message : null"
                        :label="formGroup.getControl('name').name"
                        v-m-control="formGroup.getControl('name')">
            </m-textfield>
            <p class="m-u--margin-bottom--l">
                <m-button type="submit"
                        :form="formGroup.id">Submit</m-button>
                <m-button type="reset"
                        skin="secondary"
                        :form="formGroup.id">Reset</m-button>
            </p>
        </m-form>
        `
    }));

storiesOf(`${componentsHierarchyRootSeparator}${FORM_NAME}/built-in action-fallouts`, module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .add('default', () => ({
        data: () => ({
            formGroup: new FormGroup(
                'my form',
                [
                    new FormControl<string>(
                        'name',
                        [RequiredValidator('name')]
                    )
                ]
            )
        }),
        template: `
        <m-form class="m-u--margin-top"
                :form-group="formGroup">
            <m-textfield v-model.trim="formGroup.getControl('name').value"
                        :error-message="formGroup.getControl('name').errors.length > 0 ? formGroup.getControl('name').errors[0].message : null"
                        :label="formGroup.getControl('name').name"
                        v-m-control="formGroup.getControl('name')">
            </m-textfield>
            <p class="m-u--margin-bottom--l">
                <m-button type="submit"
                        :form="formGroup.id">Submit</m-button>
                <m-button type="reset"
                        skin="secondary"
                        :form="formGroup.id">Reset</m-button>
            </p>
        </m-form>
        `
    }))
    .add('toast and clear toast', () => ({
        data: () => ({
            formGroup: new FormGroup(
                'my form',
                [
                    new FormControl<string>(
                        'name',
                        [RequiredValidator('name')]
                    )
                ]
            ),
            actionFallouts: [
                ErrorToast,
                ClearErrorToast
            ]
        }),
        template: `
        <m-form class="m-u--margin-top"
                :form-group="formGroup"
                :action-fallouts="actionFallouts">
            <m-textfield v-model.trim="formGroup.getControl('name').value"
                        :error-message="formGroup.getControl('name').errors.length > 0 ? formGroup.getControl('name').errors[0].message : null"
                        :label="formGroup.getControl('name').name"
                        v-m-control="formGroup.getControl('name')">
            </m-textfield>
            <p class="m-u--margin-bottom--l">
                <m-button type="submit"
                        :form="formGroup.id">Submit</m-button>
                <m-button type="reset"
                        skin="secondary"
                        :form="formGroup.id">Reset</m-button>
            </p>
        </m-form>
        `
    }))
    .add('focus first field with error', () => ({
        data: () => ({
            formGroup: new FormGroup(
                'my form',
                [
                    new FormControl<string>(
                        'name',
                        [RequiredValidator('name')]
                    )
                ]
            ),
            actionFallouts: [
                FocusOnFirstError
            ]
        }),
        template: `
        <m-form class="m-u--margin-top"
                :form-group="formGroup"
                :action-fallouts="actionFallouts">
            <m-textfield v-model.trim="formGroup.getControl('name').value"
                        :error-message="formGroup.getControl('name').errors.length > 0 ? formGroup.getControl('name').errors[0].message : null"
                        :label="formGroup.getControl('name').name"
                        v-m-control="formGroup.getControl('name')">
            </m-textfield>
            <p class="m-u--margin-bottom--l">
                <m-button type="submit"
                        :form="formGroup.id">Submit</m-button>
                <m-button type="reset"
                        skin="secondary"
                        :form="formGroup.id">Reset</m-button>
            </p>
        </m-form>
        `
    }))
    .add('message summary and clear message summary', () => ({
        data: () => ({
            formGroup: new FormGroup(
                'my form',
                [
                    new FormControl<string>(
                        'name',
                        [RequiredValidator('name')]
                    )
                ]
            ),
            actionFallouts: [
                SummaryMessage,
                ClearSummaryMessage
            ]
        }),
        template: `
        <m-form class="m-u--margin-top"
                :form-group="formGroup"
                :action-fallouts="actionFallouts">
            <m-textfield v-model.trim="formGroup.getControl('name').value"
                        :error-message="formGroup.getControl('name').errors.length > 0 ? formGroup.getControl('name').errors[0].message : null"
                        :label="formGroup.getControl('name').name"
                        v-m-control="formGroup.getControl('name')">
            </m-textfield>
            <p class="m-u--margin-bottom--l">
                <m-button type="submit"
                        :form="formGroup.id">Submit</m-button>
                <m-button type="reset"
                        skin="secondary"
                        :form="formGroup.id">Reset</m-button>
            </p>
        </m-form>
        `
    }));

storiesOf(`${componentsHierarchyRootSeparator}${FORM_NAME}/built-in validators`, module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .add('required', () => ({
        data: () => ({
            formGroup: new FormGroup(
                'my form',
                [
                    new FormControl<string>(
                        'name',
                        [RequiredValidator('name')]
                    )
                ]
            )
        }),
        template: `
        <m-form class="m-u--margin-top"
                :form-group="formGroup">
            <m-textfield v-model.trim="formGroup.getControl('name').value"
                        :error-message="formGroup.getControl('name').errors.length > 0 ? formGroup.getControl('name').errors[0].message : null"
                        :label="formGroup.getControl('name').name"
                        v-m-control="formGroup.getControl('name')">
            </m-textfield>
            <p class="m-u--margin-bottom--l">
                <m-button type="submit"
                        :form="formGroup.id">Submit</m-button>
                <m-button type="reset"
                        skin="secondary"
                        :form="formGroup.id">Reset</m-button>
            </p>
        </m-form>
        `
    }))
    .add('email', () => ({
        data: () => ({
            formGroup: new FormGroup(
                'my form',

                [
                    new FormControl<string>(
                        'email',
                        [EmailValidator('email')]
                    )
                ]
            )
        }),
        template: `
        <m-form class="m-u--margin-top"
                :form-group="formGroup">
            <m-textfield v-model.trim="formGroup.getControl('email').value"
                        :error-message="formGroup.getControl('email').errors.length > 0 ? formGroup.getControl('email').errors[0].message : null"
                        :label="formGroup.getControl('email').name"
                        v-m-control="formGroup.getControl('email')">
            </m-textfield>
            <p class="m-u--margin-bottom--l">
                <m-button type="submit"
                        :form="formGroup.id">Submit</m-button>
                <m-button type="reset"
                        skin="secondary"
                        :form="formGroup.id">Reset</m-button>
            </p>
        </m-form>
        `
    }))
    .add('min-length', () => ({
        data: () => ({
            formGroup: new FormGroup(
                'my form',

                [
                    new FormControl<string>(
                        'min 5',
                        [MinLengthValidator('min 5', 5)]
                    )
                ]
            )
        }),
        template: `
        <m-form class="m-u--margin-top"
                :form-group="formGroup">
            <m-textfield v-model.trim="formGroup.getControl('min 5').value"
                        :error-message="formGroup.getControl('min 5').errors.length > 0 ? formGroup.getControl('min 5').errors[0].message : null"
                        :label="formGroup.getControl('min 5').name"
                        v-m-control="formGroup.getControl('min 5')">
            </m-textfield>
            <p class="m-u--margin-bottom--l">
                <m-button type="submit"
                        :form="formGroup.id">Submit</m-button>
                <m-button type="reset"
                        skin="secondary"
                        :form="formGroup.id">Reset</m-button>
            </p>
        </m-form>
        `
    }))
    .add('max-length', () => ({
        data: () => ({
            formGroup: new FormGroup(
                'my form',
                [
                    new FormControl<string>(
                        'max 5',
                        [MaxLengthValidator('max 5', 5)]
                    )
                ]
            )
        }),
        template: `
        <m-form class="m-u--margin-top"
                :form-group="formGroup">
            <m-textfield v-model.trim="formGroup.getControl('max 5').value"
                        :error-message="formGroup.getControl('max 5').errors.length > 0 ? formGroup.getControl('max 5').errors[0].message : null"
                        :label="formGroup.getControl('max 5').name"
                        v-m-control="formGroup.getControl('max 5')">
            </m-textfield>
            <p class="m-u--margin-bottom--l">
                <m-button type="submit"
                        :form="formGroup.id">Submit</m-button>
                <m-button type="reset"
                        skin="secondary"
                        :form="formGroup.id">Reset</m-button>
            </p>
        </m-form>
        `
    }))
    .add('min', () => ({
        data: () => ({
            formGroup: new FormGroup(
                'my form',
                [
                    new FormControl<number>(
                        'min 5',
                        [MinValidator('min 5', 5)]
                    ),
                    new FormControl<Date>(
                        'min 1/1/2019',
                        [MinValidator('min 1/1/2019', new Date(2019, 0, 1))]
                    )
                ]
            )
        }),
        template: `
        <m-form class="m-u--margin-top"
                :form-group="formGroup">
            <m-integerfield v-model.trim="formGroup.getControl('min 5').value"
                        :error-message="formGroup.getControl('min 5').errors.length > 0 ? formGroup.getControl('min 5').errors[0].message : null"
                        :label="formGroup.getControl('min 5').name"
                        v-m-control="formGroup.getControl('min 5')">
            </m-integerfield>
            <m-datepicker v-model.trim="formGroup.getControl('min 1/1/2019').value"
                        :error-message="formGroup.getControl('min 1/1/2019').errors.length > 0 ? formGroup.getControl('min 1/1/2019').errors[0].message : null"
                        :label="formGroup.getControl('min 1/1/2019').name"
                        v-m-control="formGroup.getControl('min 1/1/2019')">
            </m-datepicker>
            <p class="m-u--margin-bottom--l">
                <m-button type="submit"
                        :form="formGroup.id">Submit</m-button>
                <m-button type="reset"
                        skin="secondary"
                        :form="formGroup.id">Reset</m-button>
            </p>
        </m-form>
        `
    }))
    .add('max', () => ({
        data: () => ({
            formGroup: new FormGroup(
                'my form',
                [
                    new FormControl<number>(
                        'max 5',
                        [MaxValidator('max 5', 5)]
                    ),
                    new FormControl<Date>(
                        'max 1/1/2019',
                        [MaxValidator('max 1/1/2019', new Date(2019, 0, 1))]
                    )
                ]
            )
        }),
        template: `
        <m-form class="m-u--margin-top"
                :form-group="formGroup">
            <m-integerfield v-model.trim="formGroup.getControl('max 5').value"
                        :error-message="formGroup.getControl('max 5').errors.length > 0 ? formGroup.getControl('max 5').errors[0].message : null"
                        :label="formGroup.getControl('max 5').name"
                        v-m-control="formGroup.getControl('max 5')">
            </m-integerfield>
            <m-datepicker v-model.trim="formGroup.getControl('max 1/1/2019').value"
                        :error-message="formGroup.getControl('max 1/1/2019').errors.length > 0 ? formGroup.getControl('max 1/1/2019').errors[0].message : null"
                        :label="formGroup.getControl('max 1/1/2019').name"
                        v-m-control="formGroup.getControl('max 1/1/2019')">
            </m-datepicker>
            <p class="m-u--margin-bottom--l">
                <m-button type="submit"
                        :form="formGroup.id">Submit</m-button>
                <m-button type="reset"
                        skin="secondary"
                        :form="formGroup.id">Reset</m-button>
            </p>
        </m-form>
        `
    }))
    .add('between', () => ({
        data: () => ({
            formGroup: new FormGroup(
                'my form',
                [
                    new FormControl<number>(
                        'between 2 and 4',
                        [BetweenValidator('between 2 and 4', 2, 4)]
                    ),
                    new FormControl<Date>(
                        'between 1/1/2019 and 1/2/2019',
                        [BetweenValidator('between 2 and 4', new Date(2019, 0, 1), new Date(2019, 1, 1))]
                    )
                ]
            )
        }),
        template: `
        <m-form class="m-u--margin-top"
                :form-group="formGroup">
            <m-integerfield v-model.trim="formGroup.getControl('between 2 and 4').value"
                        :error-message="formGroup.getControl('between 2 and 4').errors.length > 0 ? formGroup.getControl('between 2 and 4').errors[0].message : null"
                        :label="formGroup.getControl('between 2 and 4').name"
                        v-m-control="formGroup.getControl('between 2 and 4')">
            </m-integerfield>
            <m-datepicker v-model.trim="formGroup.getControl('between 1/1/2019 and 1/2/2019').value"
                        :error-message="formGroup.getControl('between 1/1/2019 and 1/2/2019').errors.length > 0 ? formGroup.getControl('between 1/1/2019 and 1/2/2019').errors[0].message : null"
                        :label="formGroup.getControl('between 1/1/2019 and 1/2/2019').name"
                        v-m-control="formGroup.getControl('between 1/1/2019 and 1/2/2019')">
            </m-datepicker>
            <p class="m-u--margin-bottom--l">
                <m-button type="submit"
                        :form="formGroup.id">Submit</m-button>
                <m-button type="reset"
                        skin="secondary"
                        :form="formGroup.id">Reset</m-button>
            </p>
        </m-form>
        `
    }))
    .add('compare', () => ({
        data: () => ({
            formGroup: new FormGroup(
                'my group',
                [
                    new FormControl<number>(
                        'email',
                        [EmailValidator('email')]
                    ),
                    new FormControl<number>(
                        'confirm email',
                        [EmailValidator('confirm email')]
                    )
                ],
                [
                    CompareValidator(['email', 'confirm email'])
                ]
            )
        }),
        template: `
        <m-form class="m-u--margin-top"
                :form-group="formGroup"
                v-m-control="formGroup">
            <m-input-group :legend="formGroup.name"
                :error-message="formGroup.errors.length > 0 ? formGroup.errors[0].message : null">
                <div slot-scope="{  }">
                    <m-textfield v-model.trim="formGroup.getControl('email').value"
                                :error-message="formGroup.getControl('email').errors.length > 0 ? formGroup.getControl('email').errors[0].message : null"
                                :label="formGroup.getControl('email').name"
                                v-m-control="formGroup.getControl('email')">
                    </m-textfield>
                    <m-textfield v-model.trim="formGroup.getControl('confirm email').value"
                                :error-message="formGroup.getControl('confirm email').errors.length > 0 ? formGroup.getControl('confirm email').errors[0].message : null"
                                :label="formGroup.getControl('confirm email').name"
                                v-m-control="formGroup.getControl('confirm email')">
                    </m-textfield>
                </div>
            </m-input-group>
            <p class="m-u--margin-bottom--l">
                <m-button type="submit"
                        :form="formGroup.id">Submit</m-button>
                <m-button type="reset"
                        skin="secondary"
                        :form="formGroup.id">Reset</m-button>
            </p>
        </m-form>
        `
    }));

storiesOf(`${componentsHierarchyRootSeparator}${FORM_NAME}/validation-type`, module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .add('at-exit', () => ({
        data: () => ({
            formGroup: new FormGroup(
                'my form',
                [
                    new FormControl<string>(
                        'email',
                        [
                            EmailValidator('email', {
                                validationType: ControlValidatorValidationType.AtExit
                            })
                        ]
                    )
                ]
            )
        }),
        template: `
        <m-form class="m-u--margin-top"
        :form-group="formGroup">
            <p>edition context: {{formGroup.getControl('email')['editionContext']}}</p>
            <m-textfield v-model.trim="formGroup.getControl('email').value"
                        :error-message="formGroup.getControl('email').errors.length > 0 ? formGroup.getControl('email').errors[0].message : null"
                        :label="formGroup.getControl('email').name"
                        v-m-control="formGroup.getControl('email')">
            </m-textfield>
            <p class="m-u--margin-bottom--l">
                <m-button type="submit"
                        :form="formGroup.id">Submit</m-button>
                <m-button type="reset"
                        skin="secondary"
                        :form="formGroup.id">Reset</m-button>
            </p>
        </m-form>
        `
    }))
    .add('correction', () => ({
        data: () => ({
            formGroup: new FormGroup(
                'my form',
                [
                    new FormControl<string>(
                        'email',
                        [EmailValidator('email')]
                    )
                ]
            )
        }),
        template: `
        <m-form class="m-u--margin-top"
        :form-group="formGroup">
            <p>edition context: {{formGroup.getControl('email')['editionContext']}}</p>
            <m-textfield v-model.trim="formGroup.getControl('email').value"
                        :error-message="formGroup.getControl('email').errors.length > 0 ? formGroup.getControl('email').errors[0].message : null"
                        :label="formGroup.getControl('email').name"
                        v-m-control="formGroup.getControl('email')">
            </m-textfield>
            <p class="m-u--margin-bottom--l">
                <m-button type="submit"
                        :form="formGroup.id">Submit</m-button>
                <m-button type="reset"
                        skin="secondary"
                        :form="formGroup.id">Reset</m-button>
            </p>
        </m-form>
        `
    }))
    .add('modification', () => ({
        data: () => ({
            formGroup: new FormGroup(
                'my form',
                [
                    new FormControl<string>(
                        'email',
                        [
                            EmailValidator('email', {
                                validationType: ControlValidatorValidationType.Modification
                            })
                        ]
                    )
                ]
            )
        }),
        template: `
        <m-form class="m-u--margin-top"
        :form-group="formGroup">
            <p>edition context: {{formGroup.getControl('email')['editionContext']}}</p>
            <m-textfield v-model.trim="formGroup.getControl('email').value"
                        :error-message="formGroup.getControl('email').errors.length > 0 ? formGroup.getControl('email').errors[0].message : null"
                        :label="formGroup.getControl('email').name"
                        v-m-control="formGroup.getControl('email')">
            </m-textfield>
            <p class="m-u--margin-bottom--l">
                <m-button type="submit"
                        :form="formGroup.id">Submit</m-button>
                <m-button type="reset"
                        skin="secondary"
                        :form="formGroup.id">Reset</m-button>
            </p>
        </m-form>
        `
    }))
    .add('on-going', () => ({
        data: () => ({
            formGroup: new FormGroup(
                'my form',
                [
                    new FormControl<string>(
                        'email',
                        [
                            EmailValidator('email', {
                                validationType: ControlValidatorValidationType.OnGoing
                            })
                        ]
                    )
                ]
            )
        }),
        template: `
        <m-form class="m-u--margin-top"
        :form-group="formGroup">
            <p>edition context: {{formGroup.getControl('email')['editionContext']}}</p>
            <m-textfield v-model.trim="formGroup.getControl('email').value"
                        :error-message="formGroup.getControl('email').errors.length > 0 ? formGroup.getControl('email').errors[0].message : null"
                        :label="formGroup.getControl('email').name"
                        v-m-control="formGroup.getControl('email')">
            </m-textfield>
            <p class="m-u--margin-bottom--l">
                <m-button type="submit"
                        :form="formGroup.id">Submit</m-button>
                <m-button type="reset"
                        skin="secondary"
                        :form="formGroup.id">Reset</m-button>
            </p>
        </m-form>
        `
    }));

