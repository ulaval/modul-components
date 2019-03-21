import { withA11y } from '@storybook/addon-a11y';
import centered from '@storybook/addon-centered/vue';
import { storiesOf } from '@storybook/vue';
import Vue from 'vue';
import { componentshierarchyRootSeparator } from '../../../conf/storybook/utils';
import { BUTTON_NAME } from '../component-names';
import ButtonPlugin from './button';
Vue.use(ButtonPlugin);



storiesOf(`${componentshierarchyRootSeparator}${BUTTON_NAME}/primary`, module)
    .addDecorator(withA11y)
    .addDecorator(centered)
    .add('default', () => ({
        template: '<m-button>A Button</m-button>'
    }))
    .add('disabled', () => ({
        template: '<m-button :disabled="true">A Button</m-button>'
    }))
    .add('waiting', () => ({
        template: '<m-button :waiting="true">A Button</m-button>'
    }))
    .add('fullsize', () => ({
        template: '<m-button :fullSize="true">A Button</m-button>'
    }))
    .add('icon', () => ({
        template: '<m-button icon-name="m-svg__close-clear">A Button</m-button>'
    }))
    .add('icon 20px', () => ({
        template: '<m-button icon-name="m-svg__close-clear" icon-size="20px">A Button</m-button>'
    }))
    .add('icon right', () => ({
        template: '<m-button icon-name="m-svg__close-clear" icon-position="right">A Button</m-button>'
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

storiesOf(`${componentshierarchyRootSeparator}${BUTTON_NAME}/secondary`, module)
    .addDecorator(withA11y)
    .addDecorator(centered)
    .add('default', () => ({
        template: '<m-button skin="secondary">A Button</m-button>'
    }))
    .add('disabled', () => ({
        template: '<m-button skin="secondary" :disabled="true">A Button</m-button>'
    }))
    .add('waiting', () => ({
        template: '<m-button skin="secondary" :waiting="true">A Button</m-button>'
    }))
    .add('icon', () => ({
        template: '<m-button skin="secondary" icon-name="m-svg__close-clear">A Button</m-button>'
    }))
    .add('precision', () => ({
        template: '<m-button skin="secondary" >A Button <template slot="precision">Button precision</template></m-button>'
    }));
