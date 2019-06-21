import { storiesOf } from '@storybook/vue';
import Vue from 'vue';
import { componentsHierarchyRootSeparator } from '../../../conf/storybook/utils';
import { PERIODPICKER_NAME } from '../component-names';
import PeriodpickerPlugin from './periodpicker';


Vue.use(PeriodpickerPlugin);

storiesOf(`${componentsHierarchyRootSeparator}${PERIODPICKER_NAME}`, module)
    .add('default', () => ({
        data: () => ({
            model1: {}
        }),
        template: `<div>
                        <m-periodpicker v-model="model1">
                            <m-datepicker slot="first"
                                        slot-scope="{ props, handlers }"
                                        label="From"
                                        v-on="handlers"
                                        v-bind="props">
                            </m-datepicker>
                            <m-datepicker slot="second"
                                        slot-scope="{ props, handlers }"
                                        label="To"
                                        v-on="handlers"
                                        v-bind="props">
                            </m-datepicker>
                        </m-periodpicker>
                        <br/><br/>model value = {{model1}}
                    </div>`
    }));
