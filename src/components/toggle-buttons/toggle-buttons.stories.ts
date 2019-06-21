import { withA11y } from '@storybook/addon-a11y';
import { withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/vue';
import Vue from 'vue';
import { componentsHierarchyRootSeparator } from '../../../conf/storybook/utils';
import { TOGGLE_BUTTONS_NAME } from '../component-names';
import ToggleButtonsPlugin, { MToggleButton, MToggleButtonSkin } from './toggle-buttons';

Vue.use(ToggleButtonsPlugin);

declare module '@storybook/addon-knobs' {
    export function withKnobs(): any;
}

const june: MToggleButton = { id: 'june', title: 'June' };
const july: MToggleButton = { id: 'july', title: 'July' };
const august: MToggleButton = { id: 'august', title: 'August' };
const september: MToggleButton = { id: 'september', title: 'September' };
const october: MToggleButton = { id: 'october', title: 'October', pressed: true };
const november: MToggleButton = { id: 'november', title: 'November' };
const december: MToggleButton = { id: 'december', title: 'December', pressed: true };

const monthsDefault: MToggleButton[] = [june, july, august, september];
const monthsMultipleSelection: MToggleButton[] = [september, october, november, december];
const monthsSingleSelection: MToggleButton[] = [august, september, october, november];

storiesOf(`${componentsHierarchyRootSeparator}${TOGGLE_BUTTONS_NAME}`, module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .add('default', () => ({
        data: () => ({
            buttons: monthsDefault
        }),
        template: '<m-toggle-buttons v-model="buttons" />'
    }))
    .add('skin rounded', () => ({
        props: {
            skin: {
                default: MToggleButtonSkin.ROUNDED
            }
        },
        data: () => ({
            buttons: monthsDefault
        }),
        template: '<m-toggle-buttons v-model="buttons" :skin="skin" />'
    }))
    .add('multiple selection', () => ({
        data: () => ({
            buttons: monthsMultipleSelection
        }),
        template: '<m-toggle-buttons v-model="buttons" />'
    }))
    .add('single selection', () => ({
        data: () => ({
            buttons: monthsSingleSelection,
            multiple: false
        }),
        template: '<m-toggle-buttons v-model="buttons" :multiple="multiple" />'
    }))
    .add('with slots', () => ({
        data: () => ({
            buttons: monthsSingleSelection
        }),
        template: `<m-toggle-buttons v-model="buttons">
                        <template slot-scope="{button}">
                            <m-icon name="m-svg__close-clear"></m-icon> {{ button.title }} <m-icon name="m-svg__close-clear"></m-icon>
                        </template>
                    </m-toggle-buttons>`
    }))
    .add('disabled', () => ({
        data: () => ({
            buttons: monthsSingleSelection,
            disabled: true
        }),
        template: '<m-toggle-buttons v-model="buttons" :disabled="disabled" />'
    }));
