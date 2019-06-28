import { storiesOf } from '@storybook/vue';
import Vue from 'vue';
import { componentsHierarchyRootSeparator } from '../../../conf/storybook/utils';
import { TOGGLE_BUTTONS_NAME } from '../component-names';
import ToggleButtonsPlugin, { MToggleButton, MToggleButtonSkin } from './toggle-buttons';

Vue.use(ToggleButtonsPlugin);

const JUNE: MToggleButton = { id: 'june', title: 'June' };
const JULY: MToggleButton = { id: 'july', title: 'July' };
const AUGUST: MToggleButton = { id: 'august', title: 'August' };
const SEPTEMBER: MToggleButton = { id: 'september', title: 'September' };
const OCTOBER: MToggleButton = { id: 'october', title: 'October', pressed: true };
const NOVEMBER: MToggleButton = { id: 'november', title: 'November' };
const DECEMBER: MToggleButton = { id: 'december', title: 'December', pressed: true };

const monthsDefault: MToggleButton[] = [JUNE, JULY, AUGUST, SEPTEMBER];
const monthsMultipleSelection: MToggleButton[] = [SEPTEMBER, OCTOBER, NOVEMBER, DECEMBER];
const monthsSingleSelection: MToggleButton[] = [AUGUST, SEPTEMBER, OCTOBER, NOVEMBER];

storiesOf(`${componentsHierarchyRootSeparator}${TOGGLE_BUTTONS_NAME}`, module)
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
