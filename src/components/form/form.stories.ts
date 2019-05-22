import { withA11y } from '@storybook/addon-a11y';
import { withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/vue';
import Vue from 'vue';
import { componentsHierarchyRootSeparator } from '../../../conf/storybook/utils';
import { ControlValidatorValidationType } from '../../utils/form/control-validator-validation-type';
import { FormArray } from '../../utils/form/form-array';
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

const ROLE_NAMES: string[] = ['Sys admin', 'Unit admin', 'Conceptor', 'Assitant', 'Moderator', 'Student', 'Invited'];

storiesOf(`${componentsHierarchyRootSeparator}${FORM_NAME}`, module)
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
                {
                    'name': new FormControl<string>()
                }
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

storiesOf(`${componentsHierarchyRootSeparator}${FORM_NAME}/fields`, module)
    .add('datepicker', () => ({
        data: () => ({
            formGroup: new FormGroup(
                {
                    'date': new FormControl<string>(
                        [
                            RequiredValidator('date')
                        ]
                    )
                }
            )
        }),
        template: `
        <m-form class="m-u--margin-top"
                :form-group="formGroup">
                <m-datepicker   v-m-control="formGroup.getControl('date')"
                                v-model="formGroup.getControl('date').value"
                                :required-marker="true"
                                label="Birthdate"
                                min="1900-01-01"
                                max="2020-01-01"
                                :error="formGroup.getControl('date').hasError()"
                                :error-message="formGroup.getControl('date').errorMessage"
                                :disabled="!formGroup.getControl('date').enabled"
                                :readonly="formGroup.getControl('date').readonly"
                                :waiting="formGroup.getControl('date').waiting"></m-datepicker>
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
                {
                    'name': new FormControl<string>(
                        [RequiredValidator('name')]
                    )
                }
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
                {
                    'name': new FormControl<string>(
                        [RequiredValidator('name')]
                    )
                }
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
                {
                    'name': new FormControl<string>(
                        [RequiredValidator('name')]
                    )
                }
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
                {
                    'name': new FormControl<string>(
                        [RequiredValidator('name')]
                    )
                }
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
                {
                    'name': new FormControl<string>(
                        [RequiredValidator('name')]
                    )
                }
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
                {
                    'email': new FormControl<string>(
                        [EmailValidator('email')]
                    )
                }
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
                {
                    'min 5': new FormControl<string>(
                        [MinLengthValidator('min 5', 5)]
                    )
                }
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
                {
                    'max 5': new FormControl<string>(
                        [MaxLengthValidator('max 5', 5)]
                    )
                }
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
                {
                    'min 5': new FormControl<number>(
                        [MinValidator('min 5', 5)]
                    ),
                    'min 1/1/2019': new FormControl<Date>(
                        [MinValidator('min 1/1/2019', new Date(2019, 0, 1))]
                    )
                }
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
                {
                    'max 5': new FormControl<number>(
                        [MaxValidator('max 5', 5)]
                    ),
                    'max 1/1/2019': new FormControl<Date>(
                        [MaxValidator('max 1/1/2019', new Date(2019, 0, 1))]
                    )
                }
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
                {
                    'between': new FormControl<number>(
                        [BetweenValidator('between', 2, 4)]
                    ),
                    'betweenDate': new FormControl<Date>(
                        [BetweenValidator('betweenDate', new Date(2019, 0, 1), new Date(2019, 1, 1))]
                    )
                }
            )
        }),
        template: `
        <m-form class="m-u--margin-top"
                :form-group="formGroup">
            <m-integerfield v-model.trim="formGroup.getControl('between').value"
                        :error-message="formGroup.getControl('between').errors.length > 0 ? formGroup.getControl('between').errors[0].message : null"
                        :label="formGroup.getControl('between').name"
                        v-m-control="formGroup.getControl('between')">
            </m-integerfield>
            <m-datepicker v-model.trim="formGroup.getControl('betweenDate').value"
                        :error-message="formGroup.getControl('betweenDate').errors.length > 0 ? formGroup.getControl('betweenDate').errors[0].message : null"
                        :label="formGroup.getControl('betweenDate').name"
                        v-m-control="formGroup.getControl('betweenDate')">
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
                {
                    'email': new FormControl<number>(
                        [EmailValidator('email')]
                    ),
                    'confirm email': new FormControl<number>(
                        [EmailValidator('confirm email')]
                    )
                },
                [
                    CompareValidator(['email', 'confirm email'])
                ]
            )
        }),
        template: `
        <m-form class="m-u--margin-top"
                :form-group="formGroup">
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
                {
                    'email': new FormControl<string>(
                        [
                            EmailValidator('email', {
                                validationType: ControlValidatorValidationType.AtExit
                            })
                        ]
                    )
                }
            )
        }),
        template: `
        <m-form class="m-u--margin-top"
                 :form-group="formGroup">
            <p>edition context: {{formGroup.getControl('email')['_editionContext']}}</p>
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
                {
                    'email': new FormControl<string>(
                        [EmailValidator('email')]
                    )
                }
            )
        }),
        template: `
        <m-form class="m-u--margin-top"
        :form-group="formGroup">
            <p>edition context: {{formGroup.getControl('email')['_editionContext']}}</p>
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
                {
                    'email': new FormControl<string>(
                        [
                            EmailValidator('email', {
                                validationType: ControlValidatorValidationType.Modification
                            })
                        ]
                    )
                }
            )
        }),
        template: `
        <m-form class="m-u--margin-top"
        :form-group="formGroup">
            <p>edition context: {{formGroup.getControl('email')['_editionContext']}}</p>
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
                {
                    'email': new FormControl<string>(
                        [
                            EmailValidator('email', {
                                validationType: ControlValidatorValidationType.OnGoing
                            })
                        ]
                    )
                }
            )
        }),
        template: `
        <m-form class="m-u--margin-top"
        :form-group="formGroup">
            <p>edition context: {{formGroup.getControl('email')['_editionContext']}}</p>
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

storiesOf(`${componentsHierarchyRootSeparator}${FORM_NAME}/rules`, module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .add('required and 20 characters max', () => ({
        data: () => ({
            formGroup: new FormGroup(
                {
                    'required max20': new FormControl<string>(
                        [
                            RequiredValidator('', {
                                error: {
                                    message: 'Enter a title'
                                }
                            }),
                            MaxLengthValidator('', 20, {
                                error: {
                                    message: 'Enter a title less than 20 characters'
                                }
                            })
                        ]
                    )
                }
            )
        }),
        template: `
        <div>
        <h2>Required and 20 characters max</h2>
        <m-form class="m-u--margin-top"
                :form-group="formGroup">
            <m-textfield label="Title"
                        v-model.trim="formGroup.getControl('required max20').value"
                        :max-length="20"
                        :character-count="true"
                        :character-count-threshold="20 * .75"
                        :error-message="formGroup.getControl('required max20').errors.length > 0 ? formGroup.getControl('required max20').errors[0].message : null"
                        v-m-control="formGroup.getControl('required max20')">
            </m-textfield>
            <p class="m-u--margin-bottom--l">
                <m-button type="submit"
                        :form="formGroup.id">Submit</m-button>
                <m-button type="reset"
                        skin="secondary"
                        :form="formGroup.id">Reset</m-button>
            </p>
        </m-form>
        </div>
        `
    }))
    .add('required and 5 characters min', () => ({
        data: () => ({
            formGroup: new FormGroup(
                {
                    'required min5': new FormControl<string>(
                        [
                            RequiredValidator('required min5', {
                                error: {
                                    message: 'Enter a security answer'
                                }
                            }),
                            MinLengthValidator('', 5, {
                                error: {
                                    message: 'Enter a security answer at least 5 characters long'
                                }
                            })
                        ]
                    )
                }
            )
        }),
        template: `
        <div>
        <h2>Required and 5 characters min</h2>
        <m-form class="m-u--margin-top"
                :form-group="formGroup">
            <m-textfield label="Security answer"
                        v-model.trim="formGroup.getControl('required min5').value"
                        :error-message="formGroup.getControl('required min5').errors.length > 0 ? formGroup.getControl('required min5').errors[0].message : null"
                        v-m-control="formGroup.getControl('required min5')">
            </m-textfield>
            <p class="m-u--margin-bottom--l">
                <m-button type="submit"
                        :form="formGroup.id">Submit</m-button>
                <m-button type="reset"
                        skin="secondary"
                        :form="formGroup.id">Reset</m-button>
            </p>
        </m-form>
        </div>
        `
    }))
    .add('Format with fixed max characters (postal code)', () => ({
        data: () => ({
            formGroup: new FormGroup(
                {
                    'postal code': new FormControl<string>(
                        [
                            RequiredValidator(''),
                            {
                                key: 'postal-code-format',
                                validationFunction: (control: FormControl<string>): boolean => {
                                    const regex: RegExp = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/;

                                    return regex.test(control.value || '');
                                },
                                error: {
                                    message: 'Enter postal code.'
                                },
                                validationType: ControlValidatorValidationType.OnGoing
                            }
                        ]
                    )
                }
            )
        }),
        template: `
        <div>
        <h2>Format with fixed max characters (postal code)</h2>
        <m-form class="m-u--margin-top"
                :form-group="formGroup">
            <m-textfield label="Postal code"
                        v-model.trim="formGroup.getControl('postal code').value"
                        :error-message="formGroup.getControl('postal code').errors.length > 0 ? formGroup.getControl('postal code').errors[0].message : null"
                        v-m-control="formGroup.getControl('postal code')">
            </m-textfield>
            <p class="m-u--margin-bottom--l">
                <m-button type="submit"
                        :form="formGroup.id">Submit</m-button>
                <m-button type="reset"
                        skin="secondary"
                        :form="formGroup.id">Reset</m-button>
            </p>
        </m-form>
        </div>
        `
    }))
    .add('Format without fixed max characters (email)', () => ({
        data: () => ({
            formGroup: new FormGroup(
                {
                    'email': new FormControl<string>(
                        [
                            RequiredValidator('', {
                                error: {
                                    message: 'Enter an email address'
                                }
                            }),
                            EmailValidator('', {
                                error: {
                                    message: 'Enter a valid email address'
                                }
                            })
                        ]
                    )
                }
            )
        }),
        template: `
        <div>
        <h2>Format without fixed max characters (email)</h2>
        <m-form class="m-u--margin-top"
                :form-group="formGroup">
            <m-textfield label="Email"
                        v-model.trim="formGroup.getControl('email').value"
                        :error-message="formGroup.getControl('email').errors.length > 0 ? formGroup.getControl('email').errors[0].message : null"
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
        </div>
        `
    }))
    .add('More than one validations (course code)', () => ({
        data: () => ({
            formGroup: new FormGroup(
                {
                    'course code': new FormControl<string>(
                        [
                            RequiredValidator('', {
                                error: {
                                    message: 'Enter a course code'
                                }
                            }),
                            MaxLengthValidator('course code', 8, {
                                error: {
                                    message: 'Enter a 7 characters long course code'
                                },
                                validationType: ControlValidatorValidationType.OnGoing
                            }),
                            {
                                key: 'course-code-format',
                                validationFunction: (control: FormControl<string>): boolean => {
                                    const regex: RegExp = /^[A-Za-z]{3}[-]?\d{4}$/;

                                    return regex.test(control.value || '');
                                },
                                error: {
                                    message: 'Enter a course in the format AAA-0000'
                                },
                                validationType: ControlValidatorValidationType.Correction
                            },
                            {
                                key: 'duplicate-course-code',
                                validationFunction: undefined,
                                error: {
                                    message: 'This course code already exists.'
                                },
                                validationType: ControlValidatorValidationType.External
                            }
                        ]
                    )
                }
            )
        }),
        template: `
        <div>
        <h2>More than one validations (course code)</h2>
        <p>'MAT-0000' and 'MAT-0001' are reserved</p>
        <m-form class="m-u--margin-top"
                :form-group="formGroup">
            <m-textfield label="Course code (ex. : MAT-1000)"
                        v-model.trim="formGroup.getControl('course code').value"
                        :error-message="formGroup.getControl('course code').errors.length > 0 ? formGroup.getControl('course code').errors[0].message : null"
                        v-m-control="formGroup.getControl('course code')">
            </m-textfield>
            <p class="m-u--margin-bottom--l">
                <m-button type="submit"
                        :form="formGroup.id">Submit</m-button>
                <m-button type="reset"
                        skin="secondary"
                        :form="formGroup.id">Reset</m-button>
            </p>
        </m-form>
        </div>
        `
    }))
    .add('Live check username availability (async)', () => ({
        data: () => ({
            formGroup: new FormGroup(
                {
                    'username': new FormControl<string>(
                        [
                            RequiredValidator('Value', {
                                error: {
                                    message: 'Username is required'
                                },
                                validationType: ControlValidatorValidationType.AtExit
                            }),
                            {
                                key: '',
                                validationFunction: async (control: FormControl<string>): Promise<boolean> => {
                                    return new Promise(res => {
                                        if (control.value) {
                                            setTimeout(() => res(![
                                                'John',
                                                'Jane',
                                                'Doe'
                                            ].includes(control.value || '')), 2000);
                                        } else {
                                            res(false);
                                        }
                                    });
                                },
                                async: true,
                                error: {
                                    message: 'Username is not available'
                                },
                                validationType: ControlValidatorValidationType.AtExit
                            }

                        ]
                    )
                }
            )
        }),
        template: `
        <div>
        <h2>Live check username availability (async)</h2>
        <p>'John', 'Jane' and 'Doe' are reserved</p>
        <m-form class="m-u--margin-top"
                :form-group="formGroup">
            <m-textfield label="Username"
                        v-model.trim="formGroup.getControl('username').value"
                        :error-message="formGroup.getControl('username').errors.length > 0 ? formGroup.getControl('username').errors[0].message : null"
                        :valid="formGroup.getControl('username').valid"
                        :valid-message="formGroup.getControl('username').valid ? 'Username is available' : ''"
                        :waiting="formGroup.getControl('username').waiting"
                        v-m-control="formGroup.getControl('username')">
            </m-textfield>
            <p class="m-u--margin-bottom--l">
                <m-button type="submit"
                        :form="formGroup.id">Submit</m-button>
                <m-button type="reset"
                        skin="secondary"
                        :form="formGroup.id">Reset</m-button>
            </p>
        </m-form>
        </div>
        `
    }))
    .add('Radio button required', () => ({
        data: () => ({
            formGroup: new FormGroup(
                {
                    'radio required': new FormControl<string>(
                        [
                            RequiredValidator('Value', {
                                error: {
                                    message: 'Select a role'
                                }
                            })
                        ]
                    )
                }
            )
        }),
        template: `
        <div>
        <h2>Radio button required</h2>
        <m-form class="m-u--margin-top"
                :form-group="formGroup">
            <m-radio-group label="Select a role :"
                            v-model.trim="formGroup.getControl('radio required').value"
                           :error-message="formGroup.getControl('radio required').errors.length > 0 ? formGroup.getControl('radio required').errors[0].message : null"
                           v-m-control="formGroup.getControl('radio required')">
                <m-radio value="Sys admin">Sys admin</m-radio>
                <m-radio value="Unit admin">Unit admin</m-radio>
                <m-radio value="Conceptor">Conceptor</m-radio>
                <m-radio value="Assistant">Assistant</m-radio>
                <m-radio value="Student">Student</m-radio>
            </m-radio-group>

            <p class="m-u--margin-bottom--l">
                <m-button type="submit"
                          :form="formGroup.id">Submit</m-button>
                <m-button type="reset"
                          skin="secondary"
                          :form="formGroup.id">Reset</m-button>
            </p>
        </m-form>
        </div>
        `
    }))
    .add('Checkbox 2 to 5 selections', () => ({
        data: () => ({
            rolesName: [...ROLE_NAMES],
            formGroup: new FormGroup(
                {
                    roles: new FormArray(
                        ROLE_NAMES.map(() => new FormControl<boolean>([], { initialValue: false })),
                        [
                            {
                                key: 'selection-min-count',
                                validationFunction: (array: FormArray): boolean => {
                                    return array.value.filter((v: boolean) => v).length >= 2;
                                },
                                error: {
                                    message: 'Select at least 2 roles'
                                },
                                validationType: ControlValidatorValidationType.OnGoing
                            },
                            {
                                key: 'selection-max-count',
                                validationFunction: (array: FormArray): boolean => {
                                    return array.value.filter((v: boolean) => v).length <= 5;
                                },
                                error: {
                                    message: 'Select 5 roles or less'
                                },
                                validationType: ControlValidatorValidationType.OnGoing
                            }
                        ])
                }
            )
        }),
        template: `
        <div>
        <h2>Checkbox 2 to 5 selections</h2>
        <m-form class="m-u--margin-top"
                :form-group="formGroup">
            <p><strong>Select 2 to 5 roles :</strong></p>
            <ul class="m-u--no-margin">
                <m-input-group :error-message="formGroup.getControl('roles').errors.length > 0 ?                       formGroup.getControl('roles').errors[0].message : null"
                v-m-control="formGroup.getControl('roles')"
                :visible="false">
                    <li v-for="(control, index) in formGroup.getControl('roles').controls">
                        <m-checkbox
                            v-model="control.value"
                            v-m-control="control"
                            :key="index">
                            {{rolesName[index]}}</m-checkbox>
                    </li>
    </m-input-group>
            </ul>

            <p class="m-u--margin-bottom--l">
                <m-button type="submit"
                          :form="formGroup.id">Submit</m-button>
                <m-button type="reset"
                          skin="secondary"
                          :form="formGroup.id">Reset</m-button>
            </p>
        </m-form>
        </div>
        `
    }))
    .add('Email confirmation', () => ({
        data: () => ({
            formGroup: new FormGroup(
                {
                    'email': new FormControl<string>(
                        [
                            RequiredValidator('', {
                                error: {
                                    message: 'Enter an email address'
                                }
                            }),
                            EmailValidator('', {
                                error: {
                                    message: 'Enter a valid email address'
                                }
                            })
                        ]
                    ),
                    'email confirmation': new FormControl<string>(
                        [
                            EmailValidator('', {
                                error: {
                                    message: 'Confirm email address'
                                }
                            })
                        ]
                    )
                },
                [
                    {
                        key: 'compare-email',
                        validationFunction: (control: FormGroup): boolean => {
                            return (
                                !(control.getControl('email') as FormControl<string>).value
                                ||
                                ['email', 'email confirmation']
                                    .map(cn => (control.getControl(cn) as FormControl<any>))
                                    .every(fc => fc.value === (control.controls[0] as FormControl<any>).value)
                            );
                        },
                        error: {
                            message: `Emails don't match`
                        },
                        validationType: ControlValidatorValidationType.Correction
                    }
                ]
            )
        }),
        template: `
        <div>
        <h2>Email confirmation</h2>
        <m-form :form-group="formGroup"
        <m-form class="m-u--margin-top"
                :form-group="formGroup">
            <m-input-group :error-message="formGroup.errors.length > 0 ? formGroup.errors[0].message : null"
                           legend=""
                           v-m-control="formGroup">

                <m-textfield label="Email"
                            v-model.trim="formGroup.getControl('email').value"
                            :error-message="formGroup.getControl('email').errors.length > 0 ? formGroup.getControl('email').errors[0].message : null"
                            v-m-control="formGroup.getControl('email')">
                </m-textfield>

                <m-textfield label="Email confirmation"
                            v-model.trim="formGroup.getControl('email confirmation').value"
                             :error-message="formGroup.getControl('email confirmation').errors.length > 0 ? formGroup.getControl('email confirmation').errors[0].message : null"
                             v-m-control="formGroup.getControl('email confirmation')">
                </m-textfield>

            </m-input-group>

            <p class="m-u--margin-bottom--l">
                <m-button type="submit"
                          :form="formGroup.id">Submit</m-button>
                <m-button type="reset"
                          skin="secondary"
                          :form="formGroup.id">Reset</m-button>
            </p>
        </m-form>
        </div>
        `
    }));
