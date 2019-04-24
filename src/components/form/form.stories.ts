import { withA11y } from '@storybook/addon-a11y';
import { withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/vue';
import Vue from 'vue';
import { componentsHierarchyRootSeparator } from '../../../conf/storybook/utils';
import { FormControl } from '../../utils/form/form-control';
import { FormGroup } from '../../utils/form/form-group';
import { FORM } from '../component-names';
import { RequiredValidator } from './abstract-control-validations';
import { ClearErrorToast, ClearSummaryMessage, ErrorToast, FocusOnFirstError, SummaryMessage } from './form-after-action-effects';
import FormPlugin from './form.plugin';

Vue.use(FormPlugin);

declare module '@storybook/addon-knobs' {
    export function withKnobs(): any;
}

storiesOf(`${componentsHierarchyRootSeparator}${FORM}`, module)
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
                [],
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

storiesOf(`${componentsHierarchyRootSeparator}${FORM}/after-action-effects`, module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .add('default', () => ({
        data: () => ({
            formGroup: new FormGroup(
                'my form',
                [],
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
                [],
                [
                    new FormControl<string>(
                        'name',
                        [RequiredValidator('name')]
                    )
                ]
            ),
            afterActionEffects: [
                ErrorToast,
                ClearErrorToast
            ]
        }),
        template: `
        <m-form class="m-u--margin-top"
                :form-group="formGroup"
                :after-action-effects="afterActionEffects">
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
                [],
                [
                    new FormControl<string>(
                        'name',
                        [RequiredValidator('name')]
                    )
                ]
            ),
            afterActionEffects: [
                FocusOnFirstError
            ]
        }),
        template: `
        <m-form class="m-u--margin-top"
                :form-group="formGroup"
                :after-action-effects="afterActionEffects">
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
    .add('message summary and clear message summar', () => ({
        data: () => ({
            formGroup: new FormGroup(
                'my form',
                [],
                [
                    new FormControl<string>(
                        'name',
                        [RequiredValidator('name')]
                    )
                ]
            ),
            afterActionEffects: [
                SummaryMessage,
                ClearSummaryMessage
            ]
        }),
        template: `
        <m-form class="m-u--margin-top"
                :form-group="formGroup"
                :after-action-effects="afterActionEffects">
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
