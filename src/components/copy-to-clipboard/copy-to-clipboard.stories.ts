import { withA11y } from '@storybook/addon-a11y';
import { storiesOf } from '@storybook/vue';
import Vue from 'vue';
import { componentsHierarchyRootSeparator } from '../../../conf/storybook/utils';
import { MButton } from '../button/button';
import { COPY_TO_CLIPBOARD_NAME } from '../component-names';
import { MTextfield } from '../textfield/textfield';
import CopyToClipboardPlugin from './copy-to-clipboard';

Vue.use(CopyToClipboardPlugin);
const componentName: string = COPY_TO_CLIPBOARD_NAME;

storiesOf(`${componentsHierarchyRootSeparator}${COPY_TO_CLIPBOARD_NAME}`, module)
    .addDecorator(withA11y)
    .add('default', () => ({
        template: `<${componentName} :value="''" />`
    }))
    .add('default with value', () => ({
        template: `<${componentName} :value="'some value'" />`
    }))
    .add('custom', () => ({
        template: `
        <${componentName} :value="value">
            <template slot="input" slot-scope="{ props, handlers }">
                <m-textfield v-bind="props" v-on="handlers" :label="'some label'">
                </m-textfield>
            </template>
            <template slot="button" slot-scope="{ handlers }">
                <m-button v-on="handlers" skin="secondary">Custom Copy Button</m-button>
            </template>
        </${componentName}>`,
        data: () => ({
            value: 'some value'
        }),
        components: {
            MTextfield,
            MButton
        }
    }));
