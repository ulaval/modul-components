import { withA11y } from '@storybook/addon-a11y';
import { withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/vue';
import Vue from 'vue';
import { componentsHierarchyRootSeparator } from '../../../conf/storybook/utils';
import { TIMEPICKER_NAME } from '../component-names';
import TimepickerPlugin from './timepicker';
Vue.use(TimepickerPlugin);


declare module '@storybook/addon-knobs' {
    export function withKnobs(): any;
}


storiesOf(`${componentsHierarchyRootSeparator}${TIMEPICKER_NAME}`, module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .add('default', () => ({
        data(): any {
            return {
                model: undefined
            };
        },
        template: `<m-timepicker v-model="model"></m-timepicker>`
    }))
    .add('label', () => ({
        data(): any {
            return {
                model: undefined
            };
        },
        template: `<m-timepicker v-model="model" label="Activity start time"></m-timepicker>`
    }))
    .add('min 8:45 / max 15:15', () => ({
        template: '<m-timepicker v-model="model" :min="min" :max="max"></m-timepicker>',
        props: {
            max: {
                default: '15:15'
            },
            min: {
                default: '8:45'
            }
        },
        data(): any {
            return {
                model: '12:05'
            };
        }
    }))
    .add('step 15m', () => ({
        template: '<m-timepicker :step="step"></m-timepicker>',
        props: {
            step: {
                default: '15'
            }
        }
    }))
    .add('max widht', () => ({
        template: '<m-timepicker :max-width="maxWidth"></m-timepicker>',
        props: {
            maxWidth: {
                default: 'large'
            }
        }
    }))
    .add('reactivity', () => ({
        data(): any {
            return {
                model: undefined
            };
        },
        template: `<div>
            <m-timepicker v-model="model"></m-timepicker>
            <m-timepicker v-model="model"></m-timepicker>
        </div>`
    }));
