import { storiesOf } from '@storybook/vue';
import Vue from 'vue';
import { componentsHierarchyRootSeparator } from '../../../conf/storybook/utils';
import { SELECT_NAME } from '../component-names';
import SelectPlugin from './select';

Vue.use(SelectPlugin);



storiesOf(`${componentsHierarchyRootSeparator}${SELECT_NAME}`, module)
    .add('default', () => ({
        data: () => ({
            model1: 'apple',
            options: ['apple', 'bannana', 'etc']
        }),
        template: `<div><m-select :options="options" v-model="model1"><template slot="selection">{{ model1 }}</template><template  slot="option" slot-scope="{option, index}"> {{ index }} - {{ option }} </template></m-select> {{ model1 }}</div>`
    })
    );

