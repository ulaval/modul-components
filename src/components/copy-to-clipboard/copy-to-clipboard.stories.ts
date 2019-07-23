import { withA11y } from '@storybook/addon-a11y';
import { storiesOf } from '@storybook/vue';
import Vue from 'vue';
import { componentsHierarchyRootSeparator } from '../../../conf/storybook/utils';
import { MButton } from '../button/button';
import { COPY_TO_CLIPBOARD_NAME } from '../component-names';
import { MTextfield } from '../textfield/textfield';
import { COPY_TO_CLIPBOARD_FEEDBACK_NAME } from './../component-names';
import CopyToClipboardPlugin from './copy-to-clipboard';

Vue.use(CopyToClipboardPlugin);
const componentName: string = COPY_TO_CLIPBOARD_NAME;
const feedbackComponentName: string = COPY_TO_CLIPBOARD_FEEDBACK_NAME;

storiesOf(`${componentsHierarchyRootSeparator}${COPY_TO_CLIPBOARD_NAME}`, module)
    .addDecorator(withA11y)
    .add('default', () => ({
        template: `<${componentName} :value="''" />`
    }))
    .add('default with value', () => ({
        template: `<${componentName} :value="'some value'" />`
    }))
    .add('user feedback', () => ({
        template: `
        <${feedbackComponentName}>
            <template slot-scope="{ showToast }">
                <${componentName} :value="'some value'" @copy="showToast" />
            </template>
        </${feedbackComponentName}>`
    }))
    .add('custom user feedback', () => ({
        template: `
        <${feedbackComponentName} :message="'some message'" :position="'top-center'" :timeout="'none'">
            <template slot-scope="{ showToast }">
                <${componentName} :value="'some value'" @copy="showToast" />
            </template>
        </${feedbackComponentName}>`
    }))
    .add('custom', () => ({
        template: `
        <div>
            <${componentName} :value="value">
                <template slot-scope="{ inputProps, buttonHandlers }">
                    <m-textfield v-bind="inputProps" :label="'some label'">
                    </m-textfield>
                    <button v-on="buttonHandlers">Some button</button>
                </template>
            </${componentName}>
            <${componentName} :value="value">
                <template slot="inputButton" slot-scope="{ buttonHandlers }">
                    <button v-on="buttonHandlers">Some button</button>
                </template>
            </${componentName}>
        </div>`,
        data: () => ({
            value: 'some value'
        }),
        components: {
            MTextfield,
            MButton
        }
    }));
