import { withA11y } from '@storybook/addon-a11y';
import { text, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/vue';
import Vue from 'vue';
import { componentsHierarchyRootSeparator } from '../../../conf/storybook/utils';
import { BUTTON_NAME } from '../component-names';
import ButtonPlugin from './button';
Vue.use(ButtonPlugin);


declare module '@storybook/addon-knobs' {
    export function withKnobs(): any;
}


storiesOf(`${componentsHierarchyRootSeparator}${BUTTON_NAME}`, module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .add('default', () => ({
        props: {
            text: {
                default: text('Text', 'A Button')
            }
        },
        template: '<m-button>{{ text }}</m-button>'
    }))
    .add('disabled', () => ({
        template: '<m-button :disabled="true">A Button</m-button>'
    }))
    .add('waiting', () => ({
        template: '<m-button :waiting="true">A Button</m-button>'
    }))
    .add('fullsize', () => ({
        template: '<m-button fullSize="true">A Button</m-button>'
    }))
    .add('precision', () => ({
        template: '<m-button >A Button <template slot="precision">Button precision</template></m-button>'
    }))
    .add('submit', () => ({
        template: '<m-button type="submit">A Button</m-button>'
    }))
    .add('reset', () => ({
        template: '<m-button type="reset">A Button</m-button>'
    }));

storiesOf(`${componentsHierarchyRootSeparator}${BUTTON_NAME}/skin="secondary"`, module)
    .addDecorator(withA11y)
    .add('default', () => ({
        template: '<m-button skin="secondary">A Button</m-button>'
    }))
    .add('disabled', () => ({
        template: '<m-button skin="secondary" :disabled="true">A Button</m-button>'
    }))
    .add('waiting', () => ({
        template: '<m-button skin="secondary" :waiting="true">A Button</m-button>'
    }))
    .add('fullSize', () => ({
        template: '<m-button :fullSize="true" skin="secondary">A Button</m-button>'
    }))
    .add('icon-name="m-svg__close-clear"', () => ({
        template: '<m-button icon-name="m-svg__close-clear" skin="secondary">A Button</m-button>'
    }))
    .add('icon="20px"', () => ({
        template: '<m-button icon-name="m-svg__close-clear" icon-size="20px" skin="secondary">A Button</m-button>'
    }))
    .add('icon-position="right"', () => ({
        template: '<m-button icon-name="m-svg__close-clear" icon-position="right" skin="secondary">A Button</m-button>'
    }))
    .add('precision', () => ({
        template: '<m-button skin="secondary" >A Button <template slot="precision">Button precision</template></m-button>'
    }));

storiesOf(`${componentsHierarchyRootSeparator}${BUTTON_NAME}/icon-name="m-svg__close-clear"`, module)
    .addDecorator(withA11y)
    .add('default', () => ({
        template: '<m-button icon-name="m-svg__close-clear">A Button</m-button>'
    }))
    .add('disabled', () => ({
        template: '<m-button :disabled="true" icon-name="m-svg__close-clear">A Button</m-button>'
    }))
    .add('waiting', () => ({
        template: '<m-button icon-name="m-svg__close-clear" waiting="true">A Button</m-button>'
    }))
    .add('fullSize', () => ({
        template: '<m-button :fullSize="true" icon-name="m-svg__close-clear">A Button</m-button>'
    }))
    .add('icon="20px"', () => ({
        template: '<m-button icon-name="m-svg__close-clear" icon-size="20px">A Button</m-button>'
    }))
    .add('precision', () => ({
        template: '<m-button icon-name="m-svg__close-clear">A Button <template slot="precision">' +
            'Button precision</template></m-button>'
    }));

storiesOf(`${componentsHierarchyRootSeparator}${BUTTON_NAME}/icon-position="right"`, module)
    .addDecorator(withA11y)
    .add('default', () => ({
        template: '<m-button icon-name="m-svg__close-clear" icon-position="right">A Button</m-button>'
    }))
    .add('disabled', () => ({
        template: '<m-button :disabled="true" icon-name="m-svg__close-clear" icon-position="right">A Button</m-button>'
    }))
    .add('waiting', () => ({
        template: '<m-button icon-position="right" icon-name="m-svg__close-clear" waiting="true">A Button</m-button>'
    }))
    .add('fullSize', () => ({
        template: '<m-button :fullSize="true" icon-name="m-svg__close-clear" icon-position="right">A Button</m-button>'
    }))
    .add('icon="20px"', () => ({
        template: '<m-button icon-name="m-svg__close-clear" icon-position="right" icon-size="20px">A Button</m-button>'
    }))
    .add('precision', () => ({
        template: '<m-button icon-name="m-svg__close-clear" icon-position="right" >A Button <template slot="precision">' +
            'Button precision</template></m-button>'
    }));

