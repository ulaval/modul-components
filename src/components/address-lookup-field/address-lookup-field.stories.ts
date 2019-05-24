import { withA11y } from '@storybook/addon-a11y';
import { withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/vue';
import Vue from 'vue';
import { componentsHierarchyRootSeparator } from '../../../conf/storybook/utils';
import { ADDRESS_LOOKUP_FIELD_NAME } from '../component-names';
import AddressLookupFieldPlugin from './address-lookup-field';

Vue.use(AddressLookupFieldPlugin);

declare module '@storybook/addon-knobs' {
    export function withKnobs(): any;
}

storiesOf(`${componentsHierarchyRootSeparator}${ADDRESS_LOOKUP_FIELD_NAME}`, module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .add('default', () => ({
        data: () => ({
            model: ''
        }),
        template: '<div><m-address-lookup-field></m-address-lookup-field></div>'
    }));
