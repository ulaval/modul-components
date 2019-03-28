import { withA11y } from '@storybook/addon-a11y';
import { withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/vue';
import Vue from 'vue';
import { componentsHierarchyRootSeparator } from '../../../conf/storybook/utils';
import { INPUT_STYLE_NAME } from '../component-names';
import InputStylePlugin from './input-style';
Vue.use(InputStylePlugin);


declare module '@storybook/addon-knobs' {
    export function withKnobs(): any;
}


storiesOf(`${componentsHierarchyRootSeparator}${INPUT_STYLE_NAME}`, module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .add('default', () => ({
        template: '<m-input-style></m-input-style>'
    }))
    .add('label', () => ({
        template: '<m-input-style label="Label"></m-input-style>'
    }))
    .add('labelFor', () => ({
        template: '<div><m-input-style label="Label" label-for="Label for"></m-input-style><p>Open <em>Page Inspector</em> to see <strong>for</strong> attribute on label tag.</p></div>'
    }))
    .add('empty', () => ({
        template: '<div><h2>Prop empty = true</h2><m-input-style label="Label" :empty="true">Hello</m-input-style> <h2>Prop empty = false</h2><m-input-style label="Label" :empty="false">Hello</m-input-style></div>'
    }))
    .add('focus', () => ({
        template: '<m-input-style label="Label" :focus="true" :empty="false">Hello</m-input-style>'
    }))
    .add('width', () => ({
        template: '<div><h2>Prop width = 300px</h2><m-input-style label="Label" width="300px" :focus="true" :empty="false">Hello</m-input-style></div>'
    }))
    .add('requiredMarker', () => ({
        template: '<m-input-style label="Label" required-marker="m-svg__error" :empty="false">Hello</m-input-style>'
    }))
    .add('readonly', () => ({
        template: '<m-input-style label="Label" :readonly="true" :empty="false">Hello</m-input-style>'
    }))
    .add('cursorPointer', () => ({
        template: '<m-input-style label="Label" :cursor-pointer="true" :empty="false">Hello</m-input-style>'
    }))
    .add('disabled', () => ({
        template: '<m-input-style label="Label" :disabled="true" :empty="false">Hello</m-input-style>'
    }))
    .add('waiting', () => ({
        template: '<m-input-style label="Label" :waiting="true" :empty="false">Hello</m-input-style>'
    }))
    .add('error', () => ({
        template: '<div><m-input-style label="Label" :error="true" :empty="false">Hello</m-input-style><p>Visual when the prop prop <strong>error = true</strong> and prop <strong>valide = true</strong></p><m-input-style label="Label" :error="true" valid="true" :empty="false">Hello</m-input-style></div>'
    }))
    .add('valid', () => ({
        template: '<div><m-input-style label="Label" :valid="true" :empty="false">Hello</m-input-style><p>Visual when the prop prop <strong>error = true</strong> and prop <strong>valide = true</strong></p><m-input-style label="Label" :error="true" valid="true" :empty="false">Hello</m-input-style></div>'
    }))
    .add('tagStyle', () => ({
        template: '<div><m-input-style label="H1" :empty="false" tag-style="h1">h1</m-input-style><m-input-style label="H2" :empty="false" tag-style="h2">h2</m-input-style><m-input-style label="H3" :empty="false" tag-style="h3">h3</m-input-style><m-input-style label="H4" :empty="false" tag-style="h4">h4</m-input-style><m-input-style label="H5" :empty="false" tag-style="h5">h5</m-input-style><m-input-style label="H6" :empty="false" tag-style="h6">h6</m-input-style></div>'
    }));
