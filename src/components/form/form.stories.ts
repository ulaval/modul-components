import { storiesOf } from '@storybook/vue';
import Vue from 'vue';
import { componentsHierarchyRootSeparator } from '../../../conf/storybook/utils';
import { ControlValidatorValidationType } from '../../utils/form/control-validator-validation-type';
import { FormArray } from '../../utils/form/form-array';
import { FormControl } from '../../utils/form/form-control';
import { FormGroup } from '../../utils/form/form-group';
import { BetweenValidator } from '../../utils/form/validators/between/between';
import { CompareValidator } from '../../utils/form/validators/compare/compare';
import { DateBetweenValidator } from '../../utils/form/validators/date-between/date-between';
import { DateFormatValidator } from '../../utils/form/validators/date-format/date-format';
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



const ROLE_NAMES: string[] = ['Sys admin', 'Unit admin', 'Conceptor', 'Assitant', 'Moderator', 'Student', 'Invited'];
const TYPE_NAMES: string[] = ['douce', 'blanche', 'sec'];
const COUPE_NAMES: string[] = ['régulière', 'julienne', 'ondulé'];

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
        computed: {
            nameField(): void {
                return this.$data.formGroup.getControl('name');
            }
        },
        template: `
        <m-form class="m-u--margin-top"
                :form-group="formGroup"
                @reset="reset()"
                @submit="submit()">
            <m-textfield v-model.trim="nameField.value"
                        :error-message="nameField.errors.length > 0 ? nameField.errors[0].message : null"
                        :label="nameField.name"
                        v-m-control="nameField">
            </m-textfield>
            <p class="m-u--margin-bottom--l">
                <m-button type="submit">Submit</m-button>
                <m-button type="reset"
                            skin="secondary">Reset</m-button>
            </p>
        </m-form>
        `
    }));

storiesOf(`${componentsHierarchyRootSeparator}${FORM_NAME}`, module)
    .add('submit outside-form', () => ({
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
        <div>
            <m-form class="m-u--margin-top"
                id="123-456"
                :form-group="formGroup"
                @reset="reset()"
                @submit="submit()">
            <m-textfield v-model.trim="formGroup.getControl('name').value"
                        :error-message="formGroup.getControl('name').errors.length > 0 ? formGroup.getControl('name').errors[0].message : null"
                        :label="formGroup.getControl('name').name"
                        v-m-control="formGroup.getControl('name')">
            </m-textfield>
            </m-form>
            <p class="m-u--margin-bottom--l">
                <m-button type="submit"
                        form="123-456">Submit</m-button>
                <m-button type="reset"
                        skin="secondary"
                        form="123-456">Reset</m-button>
            </p>
        </div>

        `
    }));
storiesOf(`${componentsHierarchyRootSeparator}${FORM_NAME}`, module)
    .add('reactive initial value', () => ({
        data: () => ({
            formGroup: new FormGroup(
                {
                    'name': new FormControl<string>([RequiredValidator({ controlLabel: 'name' })], { initialValue: 'blabla' })
                }

            )
        }),
        methods: {
            submit(value: string): void {
                Vue.prototype.$log.log('submited');
                this.$data.formGroup.getControl('name').initalValue = value;
            },
            reset(): void {
                Vue.prototype.$log.log('reseted');
            },
            resetToNewValue(): void {
                this.$data.formGroup.getControl('name').reset('newValue');
                Vue.prototype.$log.log('resetToNewValue');
            }

        },
        template: `
            <div>
                <m-form class="m-u--margin-top"
                    :form-group="formGroup"
                    @reset="reset()"
                    @submit="submit(formGroup.getControl('name').value)">
                <m-textfield v-model.trim="formGroup.getControl('name').value"
                            :error-message="formGroup.getControl('name').errors.length > 0 ? formGroup.getControl('name').errors[0].message : null"
                            :label="formGroup.getControl('name').name"
                            v-m-control="formGroup.getControl('name')">
                </m-textfield>
                <p class="m-u--margin-bottom--l">
                    <m-button type="submit">Submit</m-button>
                    <m-button type="reset"
                            >Reset</m-button>
                    <m-button skin="secondary"
                            @click="resetToNewValue">Reset to new value</m-button>
                </p>
                </m-form>
            </div>

            `
    }));

storiesOf(`${componentsHierarchyRootSeparator}${FORM_NAME}/built-in action-fallouts`, module)


    .add('default', () => ({
        data: () => ({
            formGroup: new FormGroup(
                {
                    'name': new FormControl<string>(
                        [RequiredValidator({ controlLabel: 'name' })]
                    )
                }
            )
        }),
        computed: {
            nameField(): void {
                return this.$data.formGroup.getControl('name');
            }
        },
        template: `
        <m-form class="m-u--margin-top"
                :form-group="formGroup">
            <m-textfield v-model.trim="nameField.value"
                        :error-message="nameField.errors.length > 0 ? nameField.errors[0].message : null"
                        :label="nameField.name"
                        v-m-control="nameField">
            </m-textfield>
            <p class="m-u--margin-bottom--l">
                <m-button type="submit">Submit</m-button>
                <m-button type="reset"
                            skin="secondary">Reset</m-button>
            </p>
        </m-form>
        `
    }))
    .add('toast and clear toast', () => ({
        data: () => ({
            formGroup: new FormGroup(
                {
                    'name': new FormControl<string>(
                        [RequiredValidator({ controlLabel: 'name' })]
                    )
                }
            ),
            actionFallouts: [
                ErrorToast,
                ClearErrorToast
            ]
        }),
        computed: {
            nameField(): void {
                return this.$data.formGroup.getControl('name');
            }
        },
        template: `
        <m-form class="m-u--margin-top"
                :form-group="formGroup"
                :action-fallouts="actionFallouts">
            <m-textfield v-model.trim="nameField.value"
                        :error-message="nameField.errors.length > 0 ? nameField.errors[0].message : null"
                        :label="nameField.name"
                        v-m-control="nameField">
            </m-textfield>
            <p class="m-u--margin-bottom--l">
                <m-button type="submit">Submit</m-button>
                <m-button type="reset"
                            skin="secondary">Reset</m-button>
            </p>
        </m-form>
        `
    }))
    .add('focus first field with error', () => ({
        data: () => ({
            formGroup: new FormGroup(
                {
                    'name': new FormControl<string>(
                        [RequiredValidator({ controlLabel: 'name' })]
                    )
                }
            ),
            actionFallouts: [
                FocusOnFirstError
            ]
        }),
        computed: {
            nameField(): void {
                return this.$data.formGroup.getControl('name');
            }
        },
        template:
            ` <m-form class="m-u--margin-top"
                :form-group="formGroup"
                :action-fallouts="actionFallouts">
            <m-textfield v-model.trim="nameField.value"
                        :error-message="nameField.errors.length > 0 ? nameField.errors[0].message : null"
                        :label="nameField.name"
                        v-m-control="nameField">
            </m-textfield>
            <p class="m-u--margin-bottom--l">
                <m-button type="submit">Submit</m-button>
                <m-button type="reset"
                            skin="secondary">Reset</m-button>
            </p>
        </m-form>`

    }))
    .add('message summary and clear message summary', () => ({
        data: () => ({
            formGroup: new FormGroup(
                {
                    'name': new FormControl<string>(
                        [RequiredValidator({ controlLabel: 'name' })]
                    )
                }
            ),
            actionFallouts: [
                SummaryMessage,
                ClearSummaryMessage
            ]
        }),
        computed: {
            nameField(): void {
                return this.$data.formGroup.getControl('name');
            }
        },
        template: `
        <m-form class="m-u--margin-top"
                :form-group="formGroup"
                :action-fallouts="actionFallouts">
            <m-textfield v-model.trim="nameField.value"
                        :error-message="nameField.errors.length > 0 ? nameField.errors[0].message : null"
                        :label="nameField.name"
                        v-m-control="nameField">
            </m-textfield>
            <p class="m-u--margin-bottom--l">
                <m-button type="submit">Submit</m-button>
                <m-button type="reset"
                            skin="secondary">Reset</m-button>
            </p>
        </m-form>
        `
    }));

storiesOf(`${componentsHierarchyRootSeparator}${FORM_NAME}/validators`, module)


    .add('required', () => ({
        data: () => ({
            formGroup: new FormGroup(
                {
                    'name': new FormControl<string>(
                        [RequiredValidator({ controlLabel: 'name' })]
                    )
                }
            )
        }),
        computed: {
            nameField(): FormControl<string> {
                return this.formGroup.getControl('name');
            }
        },
        template: `
        <m-form class="m-u--margin-top"
                :form-group="formGroup">
            <p>default validationType =  {{ nameField.validators[0].validationType }}</p>
            <m-textfield v-model="nameField.value"
                        :error="nameField.hasError()"
                        :error-message="nameField.errorMessage"
                        :label="nameField.name"
                        :valid="nameField.valid"
                        v-m-control="nameField">
            </m-textfield>
            <p class="m-u--margin-bottom--l">
                <m-button type="submit">Submit</m-button>
                <m-button type="reset"
                            skin="secondary">Reset</m-button>
            </p>
        </m-form>
        `
    }))
    .add('email', () => ({
        data: () => ({
            formGroup: new FormGroup(
                {
                    'email': new FormControl<string>(
                        [EmailValidator({ controlLabel: 'email' })]
                    )
                }
            )
        }),
        computed: {
            emailField(): FormControl<string> {
                return this.formGroup.getControl('email');
            }
        },
        template: `
        <m-form class="m-u--margin-top"
                :form-group="formGroup">
            <p>default validationType =  {{ emailField.validators[0].validationType }}</p>
            <m-textfield    v-model="emailField.value"
                            :error="emailField.hasError()"
                            :error-message="emailField.errorMessage"
                            :label="emailField.name"
                            :valid="emailField.valid"
                            v-m-control="emailField">
            </m-textfield>
            <p class="m-u--margin-bottom--l">
                <m-button type="submit">Submit</m-button>
                <m-button type="reset"
                            skin="secondary">Reset</m-button>
            </p>
        </m-form>
        `
    }))
    .add('min-length', () => ({
        data: () => ({
            formGroup: new FormGroup(
                {
                    'min5': new FormControl<string>(
                        [MinLengthValidator(5, { controlLabel: 'min5' })]
                    )
                }
            )
        }),
        computed: {
            min5Field(): FormControl<string> {
                return this.formGroup.getControl('min5');
            }
        },
        template: `
        <m-form class="m-u--margin-top"
                :form-group="formGroup">
            <p>default validationType =  {{ min5Field.validators[0].validationType }}</p>
            <m-textfield    v-model="min5Field.value"
                            :error="min5Field.hasError()"
                            :error-message="min5Field.errorMessage"
                            :label="min5Field.name"
                            :valid="min5Field.valid"
                            v-m-control="min5Field">
            </m-textfield>
            <p class="m-u--margin-bottom--l">
                <m-button type="submit">Submit</m-button>
                <m-button type="reset"
                            skin="secondary">Reset</m-button>
            </p>
        </m-form>
        `
    }))
    .add('max-length', () => ({
        data: () => ({
            formGroup: new FormGroup(
                {
                    'max5': new FormControl<string>(
                        [MaxLengthValidator(5, { controlLabel: 'max5' })]
                    )
                }
            )
        }),
        computed: {
            max5Field(): FormControl<string> {
                return this.formGroup.getControl('max5');
            }
        },
        template: `
        <m-form class="m-u--margin-top"
                :form-group="formGroup">
            <p>default validationType =  {{ max5Field.validators[0].validationType }}</p>
            <m-textfield v-model="max5Field.value"
                        :error="max5Field.hasError()"
                        :error-message="max5Field.errorMessage"
                        :label="max5Field.name"
                        :valid="max5Field.valid"
                        v-m-control="max5Field">
            </m-textfield>
            <p class="m-u--margin-bottom--l">
                <m-button type="submit">Submit</m-button>
                <m-button type="reset"
                            skin="secondary">Reset</m-button>
            </p>
        </m-form>
        `
    }))
    .add('min number', () => ({
        data: () => ({
            formGroup: new FormGroup(
                {
                    'min5': new FormControl<number>(
                        [MinValidator(5, { controlLabel: 'min5' })]
                    )
                }
            )
        }),
        computed: {
            min5Field(): FormControl<string> {
                return this.formGroup.getControl('min5');
            }
        },
        template: `
        <m-form class="m-u--margin-top"
                :form-group="formGroup">
            <p>default validationType =  {{ min5Field.validators[0].validationType }}</p>
            <m-integerfield v-model="min5Field.value"
                            :error="min5Field.hasError()"
                            :error-message="min5Field.errorMessage"
                            :label="min5Field.name"
                            :valid="min5Field.valid"
                            v-m-control="min5Field">
            </m-integerfield>
            <p class="m-u--margin-bottom--l">
                <m-button type="submit">Submit</m-button>
                <m-button type="reset"
                            skin="secondary">Reset</m-button>
            </p>
        </m-form>
        `
    }))
    .add('max number', () => ({
        data: () => ({
            formGroup: new FormGroup(
                {
                    'max5': new FormControl<number>(
                        [MaxValidator(5, { controlLabel: 'max5' })]
                    )
                }
            )
        }),
        computed: {
            max5Field(): FormControl<string> {
                return this.formGroup.getControl('max5');
            }
        },
        template: `
        <m-form class="m-u--margin-top"
                :form-group="formGroup">
            <p>default validationType =  {{ max5Field.validators[0].validationType }}</p>
            <m-integerfield v-model="max5Field.value"
                            :error="max5Field.hasError()"
                            :error-message="max5Field.errorMessage"
                            :label="max5Field.name"
                            :valid="max5Field.valid"
                            v-m-control="max5Field">
            </m-integerfield>
            <p class="m-u--margin-bottom--l">
                <m-button type="submit">Submit</m-button>
                <m-button type="reset"
                            skin="secondary">Reset</m-button>
            </p>
        </m-form>
        `
    }))
    .add('between number', () => ({
        data: () => ({
            formGroup: new FormGroup(
                {
                    'between': new FormControl<number>(
                        [BetweenValidator(2, 4, { controlLabel: 'between' })]
                    )
                }
            )
        }),
        computed: {
            betweenField(): FormControl<string> {
                return this.formGroup.getControl('between');
            }
        },

        template: `
        <m-form class="m-u--margin-top"
                :form-group="formGroup">
            <p>default validationType =  {{ betweenField.validators[0].validationType }}</p>
            <m-integerfield v-model="betweenField.value"
                            :error="betweenField.hasError()"
                            :error-message="betweenField.errorMessage"
                            :label="betweenField.name"
                            :valid="betweenField.valid"
                            v-m-control="betweenField">
            </m-integerfield>
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
    .add('date format', () => ({
        data: () => ({
            formGroup: new FormGroup(
                {
                    'date': new FormControl<string>([
                        MinLengthValidator(10, {
                            controlLabel: 'date',
                            validationType: ControlValidatorValidationType.Correction
                        }),
                        DateFormatValidator({ controlLabel: 'date' })]
                    )
                }
            )
        }),
        computed: {
            dateField(): FormControl<string> {
                return this.formGroup.getControl('date');
            }
        },

        template: `
        <m-form class="m-u--margin-top"
                :form-group="formGroup">
            <p>default validationType =  {{ dateField.validators[0].validationType }}</p>
            <m-datepicker v-model="dateField.value"
                            :skip-input-validation="true"
                            :error="dateField.hasError()"
                            :error-message="dateField.errorMessage"
                            :label="dateField.name"
                            :valid="dateField.valid"
                            v-m-control="dateField">
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
    .add('date between', () => ({
        data: () => ({
            formGroup: new FormGroup(
                {
                    'date': new FormControl<string>(
                        [DateBetweenValidator('2019-05-20', '2019-05-30', { controlLabel: 'date' })]
                    )
                }
            )
        }),
        computed: {
            dateField(): FormControl<string> {
                return this.formGroup.getControl('date');
            }
        },

        template: `
        <m-form class="m-u--margin-top"
                :form-group="formGroup">
            <p> min = 2019-05-20  max = 2019-05-30</p>
            <p>default validationType =  {{ dateField.validators[0].validationType }}</p>
            <m-datepicker v-model="dateField.value"
                            :skip-input-validation="true"
                            min="2008-01-01"
                            max="2019-05-30"
                            :error="dateField.hasError()"
                            :error-message="dateField.errorMessage"
                            :label="dateField.name"
                            :valid="dateField.valid"
                            v-m-control="dateField">
            </m-datepicker>
            <p class="m-u--margin-bottom--l">
                <m-button type="submit">Submit</m-button>
                <m-button type="reset"
                            skin="secondary">Reset</m-button>
            </p>
        </m-form>
        `
    }))
    .add('compare fields', () => ({
        data: () => ({
            formGroup: new FormGroup(
                {
                    'email': new FormControl<number>(
                        [EmailValidator({ controlLabel: 'email' })]
                    ),
                    'confirmemail': new FormControl<number>(
                        [EmailValidator({ controlLabel: 'confirmemail' })]
                    )
                },
                [
                    CompareValidator(['email', 'confirmemail'])
                ]
            )
        }),
        computed: {
            emailField(): FormControl<string> {
                return this.formGroup.getControl('email');
            },
            confirmemailField(): FormControl<string> {
                return this.formGroup.getControl('confirmemail');
            }
        },
        template: `
        <m-form class="m-u--margin-top"
                :form-group="formGroup">
            <p>default validationType =  {{ formGroup.validators[0].validationType }}</p>
            <m-input-group legend="compare two field"
                           :valid="formGroup.valid"
                           :error="formGroup.hasError()"
                           :error-message="formGroup.errorMessage">
                <div slot-scope="{  }">
                    <m-textfield v-model="emailField.value"
                                    :error="emailField.hasError()"
                                    :error-message="emailField.errorMessage"
                                    label="email"
                                    :valid="emailField.valid"
                                    v-m-control="emailField">
                    </m-textfield>
                    <m-textfield v-model="confirmemailField.value"
                                    :error="confirmemailField.hasError()"
                                    :error-message="confirmemailField.errorMessage"
                                    label="confirm email"
                                    :valid="confirmemailField.valid"
                                    v-m-control="confirmemailField">
                    </m-textfield>
                </div>
            </m-input-group>
            <p class="m-u--margin-bottom--l">
                <m-button type="submit">Submit</m-button>
                <m-button type="reset"
                            skin="secondary">Reset</m-button>
            </p>
        </m-form>
        `
    }));

storiesOf(`${componentsHierarchyRootSeparator}${FORM_NAME}/validation-type`, module)


    .add('at-exit', () => ({
        data: () => ({
            formGroup: new FormGroup(
                {
                    'email': new FormControl<string>(
                        [
                            EmailValidator({
                                controlLabel: 'email',
                                validationType: ControlValidatorValidationType.AtExit
                            })
                        ]
                    )
                }
            )
        }),
        computed: {
            email(): void {
                return this.$data.formGroup.getControl('email');
            }
        },
        template: `
        <m-form class="m-u--margin-top"
                 :form-group="formGroup">
            <p>edition context: {{email['_editionContext']}}</p>
            <m-textfield v-model.trim="email.value"
                        :error-message="email.errors.length > 0 ? email.errors[0].message : null"
                        :label="email.name"
                        v-m-control="email">
            </m-textfield>
            <p class="m-u--margin-bottom--l">
                <m-button type="submit">Submit</m-button>
                <m-button type="reset"
                            skin="secondary">Reset</m-button>
            </p>
        </m-form>
        `
    }))
    .add('correction', () => ({
        data: () => ({
            formGroup: new FormGroup(
                {
                    'email': new FormControl<string>(
                        [EmailValidator({ controlLabel: 'email' })]
                    )
                }
            )
        }),
        computed: {
            email(): void {
                return this.$data.formGroup.getControl('email');
            }
        },
        template: `
        <m-form class="m-u--margin-top"
        :form-group="formGroup">
            <p>edition context: {{email['_editionContext']}}</p>
            <m-textfield v-model.trim="email.value"
                        :error-message="email.errors.length > 0 ? email.errors[0].message : null"
                        :label="email.name"
                        v-m-control="email">
            </m-textfield>
            <p class="m-u--margin-bottom--l">
                <m-button type="submit">Submit</m-button>
                <m-button type="reset"
                            skin="secondary">Reset</m-button>
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
                            EmailValidator({
                                controlLabel: 'email',
                                validationType: ControlValidatorValidationType.Modification
                            })
                        ]
                    )
                }
            )
        }),
        computed: {
            email(): void {
                return this.$data.formGroup.getControl('email');
            }
        },
        template: `
        <m-form class="m-u--margin-top"
        :form-group="formGroup">
            <p>edition context: {{email['_editionContext']}}</p>
            <m-textfield v-model.trim="email.value"
                        :error-message="email.errors.length > 0 ? email.errors[0].message : null"
                        :label="email.name"
                        v-m-control="email">
            </m-textfield>
            <p class="m-u--margin-bottom--l">
                <m-button type="submit">Submit</m-button>
                <m-button type="reset"
                            skin="secondary">Reset</m-button>
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
                            EmailValidator({
                                controlLabel: 'email',
                                validationType: ControlValidatorValidationType.OnGoing
                            })
                        ]
                    )
                }
            )
        }),
        computed: {
            email(): void {
                return this.$data.formGroup.getControl('email');
            }
        },
        template: `
        <m-form class="m-u--margin-top"
        :form-group="formGroup">
            <p>edition context: {{email['_editionContext']}}</p>
            <m-textfield v-model.trim="email.value"
                        :error-message="email.errors.length > 0 ? email.errors[0].message : null"
                        :label="email.name"
                        v-m-control="email">
            </m-textfield>
            <p class="m-u--margin-bottom--l">
                <m-button type="submit">Submit</m-button>
                <m-button type="reset"
                            skin="secondary">Reset</m-button>
            </p>
        </m-form>
        `
    }));

storiesOf(`${componentsHierarchyRootSeparator}${FORM_NAME}/rules`, module)


    .add('required and 20 characters max', () => ({
        data: () => ({
            formGroup: new FormGroup(
                {
                    'required max20': new FormControl<string>(
                        [
                            RequiredValidator({
                                error: {
                                    message: 'Enter a title'
                                }
                            }),
                            MaxLengthValidator(20, {
                                error: {
                                    message: 'Enter a title less than 20 characters'
                                }
                            })
                        ]
                    )
                }
            )
        }),
        computed: {
            requiredMax20(): void {
                return this.$data.formGroup.getControl('required max20');
            }
        },
        template: `
        <div>
        <h2>Required and 20 characters max</h2>
        <m-form class="m-u--margin-top"
                :form-group="formGroup">
            <m-textfield label="Title"
                        v-model.trim="requiredMax20.value"
                        :max-length="20"
                        :character-count="true"
                        :character-count-threshold="20 * .75"
                        :error-message="requiredMax20.errors.length > 0 ? requiredMax20.errors[0].message : null"
                        v-m-control="requiredMax20">
            </m-textfield>
            <p class="m-u--margin-bottom--l">
                <m-button type="submit">Submit</m-button>
                <m-button type="reset"
                            skin="secondary">Reset</m-button>
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
                            RequiredValidator({
                                error: {
                                    message: 'Enter a security answer'
                                },
                                controlLabel: 'required min5'
                            }),
                            MinLengthValidator(5, {
                                error: {
                                    message: 'Enter a security answer at least 5 characters long'
                                },
                                controlLabel: 'required min5'
                            })
                        ]
                    )
                }
            )
        }),
        computed: {
            requiredMin5(): void {
                return this.$data.formGroup.getControl('required min5');
            }
        },
        template: `
        <div>
        <h2>Required and 5 characters min</h2>
        <m-form class="m-u--margin-top"
                :form-group="formGroup">
            <m-textfield label="Security answer"
                        v-model.trim="requiredMin5.value"
                        :error-message="requiredMin5.errors.length > 0 ? requiredMin5.errors[0].message : null"
                        v-m-control="requiredMin5">
            </m-textfield>
            <p class="m-u--margin-bottom--l">
                <m-button type="submit">Submit</m-button>
                <m-button type="reset"
                            skin="secondary">Reset</m-button>
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
                            RequiredValidator(),
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
        computed: {
            postalCode(): void {
                return this.$data.formGroup.getControl('postal code');
            }
        },
        template: `
        <div>
        <h2>Format with fixed max characters (postal code)</h2>
        <m-form class="m-u--margin-top"
                :form-group="formGroup">
            <m-textfield label="Postal code"
                        v-model.trim="postalCode.value"
                        :error-message="postalCode.errors.length > 0 ? postalCode.errors[0].message : null"
                        v-m-control="postalCode">
            </m-textfield>
            <p class="m-u--margin-bottom--l">
                <m-button type="submit">Submit</m-button>
                <m-button type="reset"
                            skin="secondary">Reset</m-button>
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
                            RequiredValidator({
                                error: {
                                    message: 'Enter an email address'
                                }
                            }),
                            EmailValidator({
                                error: {
                                    message: 'Enter a valid email address'
                                }
                            })
                        ]
                    )
                }
            )
        }),
        computed: {
            email(): void {
                return this.$data.formGroup.getControl('email');
            }
        },
        template: `
        <div>
        <h2>Format without fixed max characters (email)</h2>
        <m-form class="m-u--margin-top"
                :form-group="formGroup">
            <m-textfield label="Email"
                        v-model.trim="email.value"
                        :error-message="email.errors.length > 0 ? email.errors[0].message : null"
                        v-m-control="email">
            </m-textfield>
            <p class="m-u--margin-bottom--l">
                <m-button type="submit">Submit</m-button>
                <m-button type="reset"
                            skin="secondary">Reset</m-button>
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
                            RequiredValidator({
                                error: {
                                    message: 'Enter a course code'
                                }
                            }),
                            MaxLengthValidator(8, {
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
                            }
                        ]
                    )
                }
            )
        }),
        computed: {
            courseCode(): void {
                return this.$data.formGroup.getControl('course code');
            }
        },
        template: `
        <div>
        <h2>More than one validations (course code)</h2>
        <p>'MAT-0000' and 'MAT-0001' are reserved</p>
        <m-form class="m-u--margin-top"
                :form-group="formGroup">
            <m-textfield label="Course code (ex. : MAT-1000)"
                        v-model.trim="courseCode.value"
                        :error-message="courseCode.errors.length > 0 ? courseCode.errors[0].message : null"
                        v-m-control="courseCode">
            </m-textfield>
            <p class="m-u--margin-bottom--l">
                <m-button type="submit">Submit</m-button>
                <m-button type="reset"
                            skin="secondary">Reset</m-button>
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
                            RequiredValidator({
                                error: {
                                    message: 'Username is required'
                                },
                                validationType: ControlValidatorValidationType.AtExit,
                                controlLabel: 'Value'
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
        computed: {
            username(): void {
                return this.$data.formGroup.getControl('username');
            }
        },
        template: `
        <div>
        <h2>Live check username availability (async)</h2>
        <p>'John', 'Jane' and 'Doe' are reserved</p>
        <m-form class="m-u--margin-top"
                :form-group="formGroup">
            <m-textfield label="Username"
                        v-model.trim="username.value"
                        :error-message="username.errors.length > 0 ? username.errors[0].message : null"
                        :valid="username.valid"
                        :valid-message="username.valid ? 'Username is available' : ''"
                        :waiting="username.waiting"
                        v-m-control="username">
            </m-textfield>
            <p class="m-u--margin-bottom--l">
                <m-button type="submit">Submit</m-button>
                <m-button type="reset"
                            skin="secondary">Reset</m-button>
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
                            RequiredValidator({
                                error: {
                                    message: 'Select a role'
                                },
                                controlLabel: 'Value'
                            })
                        ]
                    )
                }
            )
        }),
        computed: {
            radioRequired(): void {
                return this.$data.formGroup.getControl('radio required');
            }
        },
        template: `
        <div>
        <h2>Radio button required</h2>
        <m-form class="m-u--margin-top"
                :form-group="formGroup">
            <m-radio-group label="Select a role :"
                            v-model.trim="radioRequired.value"
                           :error-message="radioRequired.errors.length > 0 ? radioRequired.errors[0].message : null"
                           v-m-control="radioRequired">
                <m-radio value="Sys admin">Sys admin</m-radio>
                <m-radio value="Unit admin">Unit admin</m-radio>
                <m-radio value="Conceptor">Conceptor</m-radio>
                <m-radio value="Assistant">Assistant</m-radio>
                <m-radio value="Student">Student</m-radio>
            </m-radio-group>

            <p class="m-u--margin-bottom--l">
                <m-button type="submit">Submit</m-button>
                <m-button type="reset"
                            skin="secondary">Reset</m-button>
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
        computed: {
            roles(): void {
                return this.$data.formGroup.getControl('roles');
            }
        },
        template: `
        <div>
        <h2>Checkbox 2 to 5 selections</h2>
        <m-form class="m-u--margin-top"
                :form-group="formGroup">
            <p><strong>Select 2 to 5 roles :</strong></p>
            <ul class="m-u--no-margin">
                <m-input-group :error-message="roles.errors.length > 0 ? roles.errors[0].message : null"
                v-m-control="roles"
                :visible="false">
                    <li v-for="(control, index) in roles.controls">
                        <m-checkbox
                            v-model="control.value"
                            v-m-control="control"
                            :key="index">
                            {{rolesName[index]}}</m-checkbox>
                    </li>
    </m-input-group>
            </ul>

            <p class="m-u--margin-bottom--l">
                <m-button type="submit">Submit</m-button>
                <m-button type="reset"
                            skin="secondary">Reset</m-button>
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
                            RequiredValidator({
                                error: {
                                    message: 'Enter an email address'
                                }
                            }),
                            EmailValidator({
                                error: {
                                    message: 'Enter a valid email address'
                                }
                            })
                        ]
                    ),
                    'email confirmation': new FormControl<string>(
                        [
                            EmailValidator({
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
        computed: {
            email(): void {
                return this.$data.formGroup.getControl('email');
            },
            emailConfirmation(): void {
                return this.$data.formGroup.getControl('email confirmation');
            }
        },
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
                            v-model.trim="email.value"
                            :error-message="email.errors.length > 0 ? email.errors[0].message : null"
                            v-m-control="email">
                </m-textfield>

                <m-textfield label="Email confirmation"
                            v-model.trim="emailConfirmation.value"
                             :error-message="emailConfirmation.errors.length > 0 ? emailConfirmation.errors[0].message : null"
                             v-m-control="emailConfirmation">
                </m-textfield>

            </m-input-group>

            <p class="m-u--margin-bottom--l">
                <m-button type="submit">Submit</m-button>
                <m-button type="reset"
                            skin="secondary">Reset</m-button>
            </p>
        </m-form>
        </div>
        `
    }));

storiesOf(`${componentsHierarchyRootSeparator}${FORM_NAME}/all fields`, module)


    .add('textfield', () => ({
        data: () => ({
            formGroup: new FormGroup(
                {
                    'name': new FormControl<string>(
                        [
                            RequiredValidator({ controlLabel: 'name' }),
                            MaxLengthValidator(20, { controlLabel: 'name' })
                        ]
                    )
                }
            )
        }),
        computed: {
            nameField(): void {
                return this.$data.formGroup.getControl('name');
            }
        },
        template: `
    <m-form :form-group="formGroup"
            v-m-control="formGroup">
            <h4 class="m-u--h6">Textfield</h4>
            <p>edition context: {{nameField['_editionContext']}}</p>
            <span style="width: 300px; margin-bottom: 5px; border-bottom: 1px solid black; display: flex; padding-bottom: 10px"></span>
            <m-textfield v-m-control="nameField"
                         v-model="nameField.value"
                         label="Name Field"
                         :error="nameField.hasError()"
                         :error-message="nameField.errorMessage"">
            </m-textfield>
            <div class="m-u--margin-top--l m-u--margin-bottom--l">
                <m-button type="submit">Submit</m-button>
                <m-button type="reset"
                          skin="secondary">Reset</m-button>
            </div>
        </m-form>
        `
    }))
    .add('textarea', () => ({
        data: () => ({
            formGroup: new FormGroup(
                {
                    'description': new FormControl<string>(
                        [
                            RequiredValidator({ controlLabel: 'description' }),
                            MaxLengthValidator(255, { controlLabel: 'description' })
                        ]
                    )
                }
            )
        }),
        computed: {
            descriptionField(): void {
                return this.$data.formGroup.getControl('description');
            }
        },
        template: `
    <m-form :form-group="formGroup"
            v-m-control="formGroup">
            <h4 class="m-u--h6">TextArea</h4>
            <p>edition context: {{descriptionField['_editionContext']}}</p>
            <span style="width: 300px; margin-bottom: 5px; border-bottom: 1px solid black; display: flex; padding-bottom: 10px"></span>
        <m-textarea v-m-control="descriptionField"
                    v-model="descriptionField.value"
                    label="Description Field"
                    :error="descriptionField.hasError()"
                    :error-message="descriptionField.errorMessage""></m-textarea>
            <div class="m-u--margin-top--l m-u--margin-bottom--l">
                <m-button type="submit">Submit</m-button>
                <m-button type="reset"
                          skin="secondary">Reset</m-button>
            </div>
        </m-form>
        `
    }))
    .add('datepicker', () => ({
        data: () => ({
            formGroup: new FormGroup(
                {
                    'birthDate': new FormControl<string>(
                        [
                            RequiredValidator()
                        ]
                    )
                }
            )
        }),
        computed: {
            birthDateField(): void {
                return this.$data.formGroup.getControl('birthDate');
            }
        },
        template: `
    <m-form :form-group="formGroup"
            v-m-control="formGroup">
            <h4 class="m-u--h6">Datepicker</h4>
            <p>edition context: {{birthDateField['_editionContext']}}</p>
            <span style="width: 300px; margin-bottom: 5px; border-bottom: 1px solid black; display: flex; padding-bottom: 10px"></span>
        <m-datepicker v-m-control="birthDateField"
                      v-model="birthDateField.value"
                      label="Birthdate"
                      min="1900-01-01"
                      max="2020-01-01"
                      :required-marker="true"
                      :error="birthDateField.hasError()"
                      :error-message="birthDateField.errorMessage"></m-datepicker>
            <div class="m-u--margin-top--l m-u--margin-bottom--l">
                <m-button type="submit">Submit</m-button>
                <m-button type="reset"
                          skin="secondary">Reset</m-button>
            </div>
        </m-form>
        `
    }))
    .add('dropdown', () => ({
        data: () => ({
            types: [...TYPE_NAMES],
            formGroup: new FormGroup(
                {
                    'type': new FormControl<string>(
                        [
                            RequiredValidator({ controlLabel: 'type' })
                        ]
                    )
                }
            )
        }),
        computed: {
            typeField(): void {
                return this.$data.formGroup.getControl('type');
            }
        },
        template: `
    <m-form :form-group="formGroup"
            v-m-control="formGroup">
            <h4 class="m-u--h6">Dropdown</h4>
            <p>edition context: {{typeField['_editionContext']}}</p>
            <span style="width: 300px; margin-bottom: 5px; border-bottom: 1px solid black; display: flex; padding-bottom: 10px"></span>
        <m-dropdown v-m-control="typeField"
                    v-model="typeField.value"
                    label="Type"
                    :required-marker="true"
                    :error="typeField.hasError()"
                    :error-message="typeField.errorMessage">
            <m-dropdown-item v-for="type of types"
                             :value="type"
                             :label="type"></m-dropdown-item>
        </m-dropdown>
            <div class="m-u--margin-top--l m-u--margin-bottom--l">
                <m-button type="submit">Submit</m-button>
                <m-button type="reset"
                          skin="secondary">Reset</m-button>
            </div>
        </m-form>
        `
    }))
    .add('checkbox', () => ({
        data: () => ({
            formGroup: new FormGroup(
                {
                    'active': new FormControl<string>(
                        [
                            RequiredValidator({ controlLabel: 'active' })
                        ]
                    )
                }
            )
        }),
        computed: {
            activeField(): void {
                return this.$data.formGroup.getControl('active');
            }
        },
        template: `
    <m-form :form-group="formGroup"
            v-m-control="formGroup">
            <h4 class="m-u--h6">Checkbox</h4>
            <p>edition context: {{activeField['_editionContext']}}</p>
            <span style="width: 300px; margin-bottom: 5px; border-bottom: 1px solid black; display: flex; padding-bottom: 10px"></span>
        <m-checkbox v-m-control="activeField"
                    v-model="activeField.value"
                    :error="activeField.hasError()"
                    :error-message="activeField.errorMessage">Is active ?</m-checkbox>
            <div class="m-u--margin-top--l m-u--margin-bottom--l">
                <m-button type="submit">Submit</m-button>
                <m-button type="reset"
                          skin="secondary">Reset</m-button>
            </div>
        </m-form>
        `
    }))
    .add('radio', () => ({
        data: () => ({
            coupes: [...COUPE_NAMES],
            formGroup: new FormGroup(
                {
                    'coupe': new FormControl<string>(
                        [
                            RequiredValidator({ controlLabel: 'Style de coupe' })
                        ]
                    )
                }
            )
        }),
        computed: {
            coupeField(): void {
                return this.$data.formGroup.getControl('coupe');
            }
        },
        template: `
    <m-form :form-group="formGroup"
            v-m-control="formGroup">
            <h4 class="m-u--h6">Radio</h4>
            <p>edition context: {{coupeField['_editionContext']}}</p>
            <span style="width: 300px; margin-bottom: 5px; border-bottom: 1px solid black; display: flex; padding-bottom: 10px"></span>
        <m-radio-group v-m-control="coupeField"
                       v-model="coupeField.value"
                       label="Style de coupe"
                       :error="coupeField.hasError()"
                       :error-message="coupeField.errorMessage">
            <m-radio v-for="coupe of coupes"
                     :value="coupe">{{coupe}}</m-radio>
         </m-radio-group>
            <div class="m-u--margin-top--l m-u--margin-bottom--l">
                <m-button type="submit">Submit</m-button>
                <m-button type="reset"
                          skin="secondary">Reset</m-button>
            </div>
        </m-form>
        `
    }))
    .add('timepicker', () => ({
        data: () => ({
            formGroup: new FormGroup(
                {
                    'time': new FormControl<string>(
                        [
                            RequiredValidator({ controlLabel: 'Time' })
                        ]
                    )
                }
            )
        }),
        computed: {
            timeField(): void {
                return this.$data.formGroup.getControl('time');
            }
        },
        template: `
    <m-form :form-group="formGroup"
            v-m-control="formGroup">
            <h4 class="m-u--h6">Timepicker</h4>
            <p>edition context: {{timeField['_editionContext']}}</p>
            <span style="width: 300px; margin-bottom: 5px; border-bottom: 1px solid black; display: flex; padding-bottom: 10px"></span>
        <m-timepicker v-m-control="timeField"
                      v-model="timeField.value"
                      label="Time"
                      :required-marker="true"
                      :error="timeField.hasError()"
                      :error-message="timeField.errorMessage"></m-timepicker>
            <div class="m-u--margin-top--l m-u--margin-bottom--l">
                <m-button type="submit"
                         >Submit</m-button>
                <m-button type="reset"
                          skin="secondary"
                          >Reset</m-button>
            </div>
        </m-form>
        `
    }))
    .add('decimalfield', () => ({
        data: () => ({
            formGroup: new FormGroup(
                {
                    'decimal': new FormControl<string>(
                        [
                            RequiredValidator({ controlLabel: 'decimal' })
                        ]
                    )
                }
            )
        }),
        computed: {
            decimalField(): void {
                return this.$data.formGroup.getControl('decimal');
            }
        },
        template: `<m-form :form-group="formGroup"
            v-m-control="formGroup">
            <h4 class="m-u--h6">Decimalfield</h4>
            <p>edition context: {{decimalField['_editionContext']}}</p>
            <span style="width: 300px; margin-bottom: 5px; border-bottom: 1px solid black; display: flex; padding-bottom: 10px"></span>
        <m-decimalfield v-m-control="decimalField"
                        v-model="decimalField.value"
                        label="Decimal"
                        :required-marker="true"
                        :error="decimalField.hasError()"
                        :error-message="decimalField.errorMessage">

        </m-decimalfield>
            <div class="m-u--margin-top--l m-u--margin-bottom--l">
                <m-button type="submit"
                          >Submit</m-button>
                <m-button type="reset"
                          skin="secondary"
                          >Reset</m-button>
            </div>
        </m-form>`
    }))
    .add('moneyfield', () => ({
        data: () => ({
            formGroup: new FormGroup(
                {
                    'money': new FormControl<string>(
                        [
                            RequiredValidator({ controlLabel: 'Price' })
                        ]
                    )
                }
            )
        }),
        computed: {
            priceField(): void {
                return this.$data.formGroup.getControl('money');
            }
        },
        template: `
    <m-form :form-group="formGroup"
            v-m-control="formGroup">
            <h4 class="m-u--h6">Moneyfield</h4>
            <p>edition context: {{priceField['_editionContext']}}</p>
            <span style="width: 300px; margin-bottom: 5px; border-bottom: 1px solid black; display: flex; padding-bottom: 10px"></span>
        <m-moneyfield v-m-control="priceField"
                      v-model="priceField.value"
                      label="Price"
                      :required-marker="true"
                      :error="priceField.hasError()"
                      :error-message="priceField.errorMessage"></m-moneyfield>
            <div class="m-u--margin-top--l m-u--margin-bottom--l">
                <m-button type="submit">Submit</m-button>
                <m-button type="reset"
                          skin="secondary">Reset</m-button>
            </div>
        </m-form>
        `
    }))
    .add('integerfield', () => ({
        data: () => ({
            formGroup: new FormGroup(
                {
                    'integer': new FormControl<string>(
                        [
                            RequiredValidator({ controlLabel: 'Integer' })
                        ]
                    )
                }
            )
        }),
        computed: {
            integerField(): void {
                return this.$data.formGroup.getControl('integer');
            }
        },
        template: `
    <m-form :form-group="formGroup"
            v-m-control="formGroup">
            <h4 class="m-u--h6">Integerfield</h4>
            <p>edition context: {{integerField['_editionContext']}}</p>
            <span style="width: 300px; margin-bottom: 5px; border-bottom: 1px solid black; display: flex; padding-bottom: 10px"></span>
        <m-integerfield v-m-control="integerField"
                        v-model="integerField.value"
                        label="Integer"
                        :required-marker="true"
                        :error="integerField.hasError()"
                        :error-message="integerField.errorMessage">

        </m-integerfield>
            <div class="m-u--margin-top--l m-u--margin-bottom--l">
                <m-button type="submit">Submit</m-button>
                <m-button type="reset"
                          skin="secondary">Reset</m-button>
            </div>
        </m-form>
        `
    }))
    .add('switch', () => ({
        data: () => ({
            formGroup: new FormGroup(
                {
                    'switch': new FormControl<string>(
                        [
                            RequiredValidator({ controlLabel: 'switch' })
                        ]
                    )
                }
            )
        }),
        computed: {
            switchField(): void {
                return this.$data.formGroup.getControl('switch');
            }
        },
        template: `
    <m-form :form-group="formGroup"
            v-m-control="formGroup">
            <h4 class="m-u--h6">Switch</h4>
            <p>edition context: {{switchField['_editionContext']}}</p>
            <span style="width: 300px; margin-bottom: 5px; border-bottom: 1px solid black; display: flex; padding-bottom: 10px"></span>
        <m-switch v-m-control="switchField"
                  v-model="switchField.value"
                  :error="switchField.hasError()"
                  :error-message="switchField.errorMessage">État</m-switch>
            <div class="m-u--margin-top--l m-u--margin-bottom--l">
                <m-button type="submit">Submit</m-button>
                <m-button type="reset"
                          skin="secondary">Reset</m-button>
            </div>
        </m-form>
        `
    }))
    .add('autocomplete', () => ({
        data: () => ({
            autocompleteResults: [{ label: 'RandomDog', value: 'RandomDog' }, {
                label: 'RandomDog2',
                value: 'RandomDog2'
            }],
            formGroup: new FormGroup(
                {
                    'autocomplete': new FormControl<string>(
                        [
                            RequiredValidator({ controlLabel: 'autocomplete' })
                        ]
                    )
                }
            )
        }),
        methods: {
            onComplete(): void {
                this.$data.autocompleteResults = [...this.$data.autocompleteResults];
            }
        },
        computed: {
            autocompleteField(): void {
                return this.$data.formGroup.getControl('autocomplete');
            }
        },
        template: `
    <m-form :form-group="formGroup"
            v-m-control="formGroup">
            <h4 class="m-u--h6">Autocomplete</h4>
            <p>edition context: {{autocompleteField['_editionContext']}}</p>
            <span style="width: 300px; margin-bottom: 5px; border-bottom: 1px solid black; display: flex; padding-bottom: 10px"></span>
        <m-autocomplete v-m-control="autocompleteField"
                        v-model="autocompleteField.value"
                        label="Autocomplete"
                        :results="autocompleteResults"
                        :required-marker="true"
                        :error="autocompleteField.hasError()"
                        :error-message="autocompleteField.errorMessage"
                        @complete="onComplete"></m-autocomplete>
            <div class="m-u--margin-top--l m-u--margin-bottom--l">
                <m-button type="submit">Submit</m-button>
                <m-button type="reset"
                          skin="secondary">Reset</m-button>
            </div>
        </m-form>
        `
    }))
    .add('daterangepicker', () => ({
        data: () => ({
            formGroup: new FormGroup(
                {
                    'daterange': new FormControl<string>(
                        [
                            RequiredValidator({ controlLabel: 'daterange' })
                        ]
                    )
                }
            )
        }),
        computed: {
            daterangeField(): void {
                return this.$data.formGroup.getControl('daterange');
            }
        },
        template: `
    <m-form :form-group="formGroup"
            v-m-control="formGroup">
            <h4 class="m-u--h6">Daterangepicker</h4>
            <p>edition context: {{daterangeField['_editionContext']}}</p>
            <span style="width: 300px; margin-bottom: 5px; border-bottom: 1px solid black; display: flex; padding-bottom: 10px"></span>
        <m-daterangepicker v-m-control="daterangeField"
                           v-model="daterangeField.value"
                           :error="daterangeField.hasError()"
                           :error-message="daterangeField.errorMessage">
        </m-daterangepicker>
            <div class="m-u--margin-top--l m-u--margin-bottom--l">
                <m-button type="submit">Submit</m-button>
                <m-button type="reset"
                          skin="secondary">Reset</m-button>
            </div>
        </m-form>
        `
    }));
