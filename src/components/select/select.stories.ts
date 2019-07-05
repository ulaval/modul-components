import { actions } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/vue';
import Vue from 'vue';
import { componentsHierarchyRootSeparator } from '../../../conf/storybook/utils';
import { SELECT_NAME } from '../component-names';
import SelectPlugin from './select';

Vue.use(SelectPlugin);

storiesOf(`${componentsHierarchyRootSeparator}${SELECT_NAME}`, module)
    .add('default', () => ({
        methods: actions(
            'open',
            'close',
            'focus',
            'blur'
        ),
        data: () => ({
            model1: 'avocados',
            options: ['apple', 'bannana', 'patate', 'tomato', 'avocados', 'etc']
        }),
        template: `<div><m-select  @open="open" @close="close" @focus="focus" @blur="blur" :options="options" v-model="model1"><template slot="selection">{{ model1 }}</template><template  slot="option" slot-scope="{option, index}"> {{ index }} - {{ option }} </template></m-select> <p>v-model = {{ model1 }}</p></div>`
    })
    );

