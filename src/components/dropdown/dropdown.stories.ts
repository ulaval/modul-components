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

    .add('label-up', () => ({
        data: () => ({
            model5: ''
        }),
        template: `<m-dropdown :label-up="true" label="Name" v-model="model5" placeholder="placeholder">
                        <m-dropdown-item value="james" label="James"></m-dropdown-item>
                        <m-dropdown-item value="yvan" label="Yvan"></m-dropdown-item>
                    </m-dropdown>`
    }));

storiesOf(`${componentsHierarchyRootSeparator}${DROPDOWN_NAME}/filterable`, module)

    .add('No placeholder', () => ({
        data: () => ({
            model3: ''
        }),
        template: `<m-dropdown label="Animals" v-model="model3" filterable="true">
                        <m-dropdown-item value="1a" label="Steer"></m-dropdown-item>
                        <m-dropdown-item value="1b" label="Chameleon"></m-dropdown-item>
                        <m-dropdown-item value="1c" label="Alpaca"></m-dropdown-item>
                        <m-dropdown-item value="1d" label="Monkey"></m-dropdown-item>
                        <m-dropdown-item value="1e" label="Cow"></m-dropdown-item>
                        <m-dropdown-item value="1f" label="Pig"></m-dropdown-item>
                    </m-dropdown>`
    }))

    .add('With placeholder', () => ({
        data: () => ({
            model4: ''
        }),
        template: `<m-dropdown label="Animals" v-model="model4" placeholder="Type to filter" placeholder-icon-name="m-svg__search" filterable="true">
                        <m-dropdown-item value="1a" label="Steer"></m-dropdown-item>
                        <m-dropdown-item value="1b" label="Chameleon"></m-dropdown-item>
                        <m-dropdown-item value="1c" label="Alpaca"></m-dropdown-item>
                        <m-dropdown-item value="1d" label="Monkey"></m-dropdown-item>
                        <m-dropdown-item value="1e" label="Cow"></m-dropdown-item>
                        <m-dropdown-item value="1f" label="Pig"></m-dropdown-item>
                    </m-dropdown>`
    }));

storiesOf(`${componentsHierarchyRootSeparator}${DROPDOWN_NAME}/readonly`, module)

    .add('No selection, no label', () => ({
        data: () => ({
            model6: ''
        }),
        template: `<div>
                    <p class="m-u--font-weight--semi-bold m-u--padding-bottom--s">No selection, no label</p>
                    <m-dropdown :readonly="true" v-model="model6">
                        <m-dropdown-item value="a" label="Iron Man"></m-dropdown-item>
                        <m-dropdown-item value="b" label="Hulk"></m-dropdown-item>
                        <m-dropdown-item value="c" label="Thor"></m-dropdown-item>
                        <m-dropdown-item value="d" label="Widow choy"></m-dropdown-item>
                        <m-dropdown-item value="e" label="Vision"></m-dropdown-item>
                        <m-dropdown-item value="f" label="Captain America"></m-dropdown-item>
                    </m-dropdown>
                </div>`
    }))
    .add('No selection, with label', () => ({
        data: () => ({
            model7: ''
        }),
        template: `<div>
                        <p class="m-u--font-weight--semi-bold m-u--padding-bottom--s">No selection, with label</p>
                        <m-dropdown :readonly="true" label="Avenger" v-model="model7">
                        <m-dropdown-item value="a" label="Iron Man"></m-dropdown-item>
                        <m-dropdown-item value="b" label="Hulk"></m-dropdown-item>
                        <m-dropdown-item value="c" label="Thor"></m-dropdown-item>
                        <m-dropdown-item value="d" label="Widow choy"></m-dropdown-item>
                        <m-dropdown-item value="e" label="Vision"></m-dropdown-item>
                        <m-dropdown-item value="f" label="Captain America"></m-dropdown-item>
                    </m-dropdown>
                </div>`
    }))
    .add('No selection, with label, with placeholder', () => ({
        data: () => ({
            model71: ''
        }),
        template: `<div>
                        <p class="m-u--font-weight--semi-bold m-u--padding-bottom--s">No selection, with label, with placeholder</p>
                        <m-dropdown :readonly="true" label="Avenger" placeholder="Select your avenger" v-model="model71">
                        <m-dropdown-item value="a" label="Iron Man"></m-dropdown-item>
                        <m-dropdown-item value="b" label="Hulk"></m-dropdown-item>
                        <m-dropdown-item value="c" label="Thor"></m-dropdown-item>
                        <m-dropdown-item value="d" label="Widow choy"></m-dropdown-item>
                        <m-dropdown-item value="e" label="Vision"></m-dropdown-item>
                        <m-dropdown-item value="f" label="Captain America"></m-dropdown-item>
                    </m-dropdown>
                </div>`
    }))
    .add('No selection, no label, with placeholder', () => ({
        data: () => ({
            model72: ''
        }),
        template: `<div>
                        <p class="m-u--font-weight--semi-bold m-u--padding-bottom--s">No selection, no label, with placeholder</p>
                        <m-dropdown :readonly="true" placeholder="Select your avenger" v-model="model72">
                        <m-dropdown-item value="a" label="Iron Man"></m-dropdown-item>
                        <m-dropdown-item value="b" label="Hulk"></m-dropdown-item>
                        <m-dropdown-item value="c" label="Thor"></m-dropdown-item>
                        <m-dropdown-item value="d" label="Widow choy"></m-dropdown-item>
                        <m-dropdown-item value="e" label="Vision"></m-dropdown-item>
                        <m-dropdown-item value="f" label="Captain America"></m-dropdown-item>
                    </m-dropdown>
                </div>`
    }))

    .add('Item selected, with label', () => ({
        data: () => ({
            model8: 'f'
        }),
        template: `<div>
                        <p class="m-u--font-weight--semi-bold m-u--padding-bottom--s">Item selected, with label</p>
                        <m-dropdown :readonly="true" label="Avenger" v-model="model8">
                        <m-dropdown-item value="a" label="Iron Man"></m-dropdown-item>
                        <m-dropdown-item value="b" label="Hulk"></m-dropdown-item>
                        <m-dropdown-item value="c" label="Thor"></m-dropdown-item>
                        <m-dropdown-item value="d" label="Widow choy"></m-dropdown-item>
                        <m-dropdown-item value="e" label="Vision"></m-dropdown-item>
                        <m-dropdown-item value="f" label="Captain America"></m-dropdown-item>
                    </m-dropdown>
                </div>`
    }));


storiesOf(`${componentsHierarchyRootSeparator}${DROPDOWN_NAME}/disabled`, module)

    .add('No selection, no label', () => ({
        data: () => ({
            model9: ''
        }),
        template: `<div>
                        <p class="m-u--font-weight--semi-bold m-u--padding-bottom--s">No selection, no label</p>
                        <m-dropdown :disabled="true" v-model="model9">
                        <m-dropdown-item value="a" label="Iron Man"></m-dropdown-item>
                        <m-dropdown-item value="b" slectec label="Hulk"></m-dropdown-item>
                        <m-dropdown-item value="c" label="Thor"></m-dropdown-item>
                        <m-dropdown-item value="d" label="Widow choy"></m-dropdown-item>
                        <m-dropdown-item value="e" label="Vision"></m-dropdown-item>
                        <m-dropdown-item value="f" label="Captain America"></m-dropdown-item>
                    </m-dropdown>
                <div>`
    }))

    .add('No selection, no label, with placeholder', () => ({
        data: () => ({
            model91: ''
        }),
        template: `<div>
                        <p class="m-u--font-weight--semi-bold m-u--padding-bottom--s">No selection, no label, with placeholder</p>
                        <m-dropdown :disabled="true" placeholder="Select your avenger" v-model="model91">
                        <m-dropdown-item value="a" label="Iron Man"></m-dropdown-item>
                        <m-dropdown-item value="b" label="Hulk"></m-dropdown-item>
                        <m-dropdown-item value="c" label="Thor"></m-dropdown-item>
                        <m-dropdown-item value="d" label="Widow choy"></m-dropdown-item>
                        <m-dropdown-item value="e" label="Vision"></m-dropdown-item>
                        <m-dropdown-item value="f" label="Captain America"></m-dropdown-item>
                    </m-dropdown>
                </div>`
    }))

    .add('No selection, with label', () => ({
        data: () => ({
            model10: ''
        }),
        template: `<div>
                        <p class="m-u--font-weight--semi-bold m-u--padding-bottom--s">No selection, with label</p>
                        <m-dropdown :disabled="true" label="Avenger" v-model="model10">
                        <m-dropdown-item value="a" label="Iron Man"></m-dropdown-item>
                        <m-dropdown-item value="b" slectec label="Hulk"></m-dropdown-item>
                        <m-dropdown-item value="c" label="Thor"></m-dropdown-item>
                        <m-dropdown-item value="d" label="Widow choy"></m-dropdown-item>
                        <m-dropdown-item value="e" label="Vision"></m-dropdown-item>
                        <m-dropdown-item value="f" label="Captain America"></m-dropdown-item>
                    </m-dropdown>
                <div>`
    }))

    .add('Item selected, with label', () => ({
        data: () => ({
            model11: 'f'
        }),
        template: `<div>
                        <p class="m-u--font-weight--semi-bold m-u--padding-bottom--s">Item selected, with label</p>
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

