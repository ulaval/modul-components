import { storiesOf } from '@storybook/vue';
import Vue from 'vue';
import { componentsHierarchyRootSeparator } from '../../../conf/storybook/utils';
import { DROPDOWN_NAME } from '../component-names';
import DropdownPlugin from './dropdown';

Vue.use(DropdownPlugin);



storiesOf(`${componentsHierarchyRootSeparator}${DROPDOWN_NAME}`, module)

    .add('default', () => ({
        data: () => ({
            model1: ''
        }),
        template: `<m-dropdown label="Vegetable" v-model="model1">
                        <m-dropdown-item value="1" label="Artichoke"></m-dropdown-item>
                        <m-dropdown-item value="2" label="Asparagus"></m-dropdown-item>
                        <m-dropdown-item value="3" label="Broccoli"></m-dropdown-item>
                        <m-dropdown-item value="4" label="Bok choy"></m-dropdown-item>
                        <m-dropdown-item value="5" label="Lettuce"></m-dropdown-item>
                        <m-dropdown-item value="6" label="Tomato"></m-dropdown-item>
                    </m-dropdown>`
    }))
    .add('focus', () => ({
        data: () => ({
            model2: ''
        }),
        template: `<m-dropdown :focus="true" label="Avengers" v-model="model2">
                        <m-dropdown-item value="a" label="Iron Man"></m-dropdown-item>
                        <m-dropdown-item value="b" label="Hulk"></m-dropdown-item>
                        <m-dropdown-item value="c" label="Thor"></m-dropdown-item>
                        <m-dropdown-item value="d" label="Widow choy"></m-dropdown-item>
                        <m-dropdown-item value="e" label="Vision"></m-dropdown-item>
                        <m-dropdown-item value="f" label="Captain America"></m-dropdown-item>
                    </m-dropdown>`
    }))
    .add('filterable', () => ({
        data: () => ({
            model3: ''
        }),
        template: `<m-dropdown label="Animals" v-model="model3" placeholder-icon-name="m-svg__search"
        filterable="true">
                        <m-dropdown-item value="1a" label="Steer"></m-dropdown-item>
                        <m-dropdown-item value="1b" label="Chameleon"></m-dropdown-item>
                        <m-dropdown-item value="1c" label="Alpaca"></m-dropdown-item>
                        <m-dropdown-item value="1d" label="Monkey"></m-dropdown-item>
                        <m-dropdown-item value="1e" label="Cow"></m-dropdown-item>
                        <m-dropdown-item value="1f" label="Pig"></m-dropdown-item>
                    </m-dropdown>`
    }))
    .add('filterable and placeholder', () => ({
        data: () => ({
            model4: ''
        }),
        template: `<m-dropdown label="Animals" v-model="model4" placeholder="Type to filter" placeholder-icon-name="m-svg__search"
        filterable="true">
                        <m-dropdown-item value="1a" label="Steer"></m-dropdown-item>
                        <m-dropdown-item value="1b" label="Chameleon"></m-dropdown-item>
                        <m-dropdown-item value="1c" label="Alpaca"></m-dropdown-item>
                        <m-dropdown-item value="1d" label="Monkey"></m-dropdown-item>
                        <m-dropdown-item value="1e" label="Cow"></m-dropdown-item>
                        <m-dropdown-item value="1f" label="Pig"></m-dropdown-item>
                    </m-dropdown>`
    }))
    .add('label-up', () => ({
        data: () => ({
            model5: ''
        }),
        template: `<m-dropdown :label-up="true" label="Name" v-model="model5" placeholder="placeholder">
                        <m-dropdown-item value="james" label="James"></m-dropdown-item>
                        <m-dropdown-item value="yvan" label="Yvan"></m-dropdown-item>
                    </m-dropdown>`
    }))
    .add('readonly', () => ({
        data: () => ({
            model6: '',
            model7: '',
            model8: 'f'
        }),
        template: `<div>
                    <p class="m-u--font-weight--semi-bold m-u--padding-bottom--s">No item selected, no label</p>
                    <m-dropdown :readonly="true" v-model="model6">
                        <m-dropdown-item value="a" label="Iron Man"></m-dropdown-item>
                        <m-dropdown-item value="b" label="Hulk"></m-dropdown-item>
                        <m-dropdown-item value="c" label="Thor"></m-dropdown-item>
                        <m-dropdown-item value="d" label="Widow choy"></m-dropdown-item>
                        <m-dropdown-item value="e" label="Vision"></m-dropdown-item>
                        <m-dropdown-item value="f" label="Captain America"></m-dropdown-item>
                    </m-dropdown>
                    <p class="m-u--font-weight--semi-bold">No item selected, with label</p>
                    <m-dropdown :readonly="true" label="Avenger" v-model="model7">
                        <m-dropdown-item value="a" label="Iron Man"></m-dropdown-item>
                        <m-dropdown-item value="b" label="Hulk"></m-dropdown-item>
                        <m-dropdown-item value="c" label="Thor"></m-dropdown-item>
                        <m-dropdown-item value="d" label="Widow choy"></m-dropdown-item>
                        <m-dropdown-item value="e" label="Vision"></m-dropdown-item>
                        <m-dropdown-item value="f" label="Captain America"></m-dropdown-item>
                    </m-dropdown>
                    <p class="m-u--font-weight--semi-bold">Item selected, with label</p>
                    <m-dropdown :readonly="true" label="Avenger" v-model="model8">
                        <m-dropdown-item value="a" label="Iron Man"></m-dropdown-item>
                        <m-dropdown-item value="b" label="Hulk"></m-dropdown-item>
                        <m-dropdown-item value="c" label="Thor"></m-dropdown-item>
                        <m-dropdown-item value="d" label="Widow choy"></m-dropdown-item>
                        <m-dropdown-item value="e" label="Vision"></m-dropdown-item>
                        <m-dropdown-item value="f" label="Captain America"></m-dropdown-item>
                    </m-dropdown>
                </div>`
    }))
    .add('disabled', () => ({
        data: () => ({
            model9: '',
            model10: '',
            model11: 'f'
        }),
        template: `<div>
                    <p class="m-u--font-weight--semi-bold m-u--padding-bottom--s">No item selected, no label</p>
                    <m-dropdown :disabled="true" v-model="model9">
                        <m-dropdown-item value="a" label="Iron Man"></m-dropdown-item>
                        <m-dropdown-item value="b" slectec label="Hulk"></m-dropdown-item>
                        <m-dropdown-item value="c" label="Thor"></m-dropdown-item>
                        <m-dropdown-item value="d" label="Widow choy"></m-dropdown-item>
                        <m-dropdown-item value="e" label="Vision"></m-dropdown-item>
                        <m-dropdown-item value="f" label="Captain America"></m-dropdown-item>
                    </m-dropdown>
                    <p class="m-u--font-weight--semi-bold">No item selected, with label</p>
                    <m-dropdown :disabled="true" label="Avenger" v-model="model10">
                        <m-dropdown-item value="a" label="Iron Man"></m-dropdown-item>
                        <m-dropdown-item value="b" slectec label="Hulk"></m-dropdown-item>
                        <m-dropdown-item value="c" label="Thor"></m-dropdown-item>
                        <m-dropdown-item value="d" label="Widow choy"></m-dropdown-item>
                        <m-dropdown-item value="e" label="Vision"></m-dropdown-item>
                        <m-dropdown-item value="f" label="Captain America"></m-dropdown-item>
                    </m-dropdown>
                    <p class="m-u--font-weight--semi-bold">Item selected, with label</p>
                    <m-dropdown :disabled="true" label="Avenger" v-model="model11">
                        <m-dropdown-item value="a" label="Iron Man"></m-dropdown-item>
                        <m-dropdown-item value="b" slectec label="Hulk"></m-dropdown-item>
                        <m-dropdown-item value="c" label="Thor"></m-dropdown-item>
                        <m-dropdown-item value="d" label="Widow choy"></m-dropdown-item>
                        <m-dropdown-item value="e" label="Vision"></m-dropdown-item>
                        <m-dropdown-item value="f" label="Captain America"></m-dropdown-item>
                    </m-dropdown>
                <div>`
    }));

