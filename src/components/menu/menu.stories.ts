import { withA11y } from '@storybook/addon-a11y';
import { withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/vue';
import Vue from 'vue';
import { componentsHierarchyRootSeparator } from '../../../conf/storybook/utils';
import { MENU_NAME } from '../component-names';
import MenuPlugin from './menu';

Vue.use(MenuPlugin);


declare module '@storybook/addon-knobs' {
    export function withKnobs(): any;
}


storiesOf(`${componentsHierarchyRootSeparator}${MENU_NAME}`, module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .add('default', () => ({
        data: () => ({
            menuIsOpened: false,
            selectedItem: 'item1'
        }),
        template: `<m-menu :open.sync="menuIsOpened" :selected.sync="selectedItem">
                        <div slot="trigger">Menu</div>
                        <m-menu-item value="item1" label="Item 1" icon-name="m-svg__profile"></m-menu-item>
                        <m-menu-item value="item2" label="Item 2"></m-menu-item>
                        <m-menu-item value="item3" label="Item 3"></m-menu-item>
                        <m-menu-item label="Item group 1">
                            <m-menu-item value="subitem1" label="Subitem 1"></m-menu-item>
                            <m-menu-item value="subitem2" label="Subitem 2"></m-menu-item>
                            <m-menu-item value="subitem3" label="Subitem 3"></m-menu-item>
                        </m-menu-item>
                        <m-menu-item value="item5" label="Item 5"></m-menu-item>
                        <m-menu-item label="Item group 2"><m-menu-item value="subitem4" label="Subitem 4"></m-menu-item>
                            <m-menu-item value="subitem5" label="Subitem 5"></m-menu-item>
                            <m-menu-item value="subitem6" label="Subitem 6"></m-menu-item>
                        </m-menu-item>
                 </m-menu>`
    }))
    .add('open', () => ({
        data: () => ({
            menuIsOpened: true,
            selectedItem: 'item1'
        }),
        template: `<m-menu :open.sync="menuIsOpened" selected.sync="selectedItem" :closeOnSelection="false">
                        <div slot="trigger">Menu</div>
                        <m-menu-item value="item1" label="Item 1" icon-name="m-svg__profile"></m-menu-item>
                        <m-menu-item value="item2" label="Item 2"></m-menu-item>
                        <m-menu-item value="item3" label="Item 3"></m-menu-item>
                        <m-menu-item label="Item group 1">
                            <m-menu-item value="subitem1" label="Subitem 1"></m-menu-item>
                            <m-menu-item value="subitem2" label="Subitem 2"></m-menu-item>
                            <m-menu-item value="subitem3" label="Subitem 3"></m-menu-item>
                        </m-menu-item>
                        <m-menu-item value="item5" label="Item 5"></m-menu-item>
                        <m-menu-item label="Item group 2"><m-menu-item value="subitem4" label="Subitem 4"></m-menu-item>
                            <m-menu-item value="subitem5" label="Subitem 5"></m-menu-item>
                            <m-menu-item value="subitem6" label="Subitem 6"></m-menu-item>
                        </m-menu-item>
                 </m-menu>`
    }))
    .add('closeOnSelection="false"', () => ({
        data: () => ({
            menuIsOpened: true,
            selectedItem: 'item1'
        }),
        template: `<m-menu :open.sync="menuIsOpened" :selected.sync="selectedItem" :closeOnSelection="false">
                        <div slot="trigger">Menu</div>
                        <m-menu-item value="item1" label="Item 1" icon-name="m-svg__profile"></m-menu-item>
                        <m-menu-item value="item2" label="Item 2"></m-menu-item>
                        <m-menu-item value="item3" label="Item 3"></m-menu-item>
                        <m-menu-item label="Item group 1">
                            <m-menu-item value="subitem1" label="Subitem 1"></m-menu-item>
                            <m-menu-item value="subitem2" label="Subitem 2"></m-menu-item>
                            <m-menu-item value="subitem3" label="Subitem 3"></m-menu-item>
                        </m-menu-item>
                        <m-menu-item value="item5" label="Item 5"></m-menu-item>
                        <m-menu-item label="Item group 2"><m-menu-item value="subitem4" label="Subitem 4"></m-menu-item>
                            <m-menu-item value="subitem5" label="Subitem 5"></m-menu-item>
                            <m-menu-item value="subitem6" label="Subitem 6"></m-menu-item>
                        </m-menu-item>
                 </m-menu>`
    }))
    .add('idAriaControls="ariaTest"', () => ({
        data: () => ({
            menuIsOpened: true,
            selectedItem: 'item1'
        }),
        template: `<m-menu :closeOnSelection="false" :open.sync="menuIsOpened" :selected.sync="selectedItem" idAriaControls="ariaTest">
                        <div slot="trigger">Menu</div>
                        <m-menu-item value="item1" label="Item 1" icon-name="m-svg__profile"></m-menu-item>
                        <m-menu-item value="item2" label="Item 2"></m-menu-item>
                        <m-menu-item value="item3" label="Item 3"></m-menu-item>
                        <m-menu-item label="Item group 1">
                            <m-menu-item value="subitem1" label="Subitem 1"></m-menu-item>
                            <m-menu-item value="subitem2" label="Subitem 2"></m-menu-item>
                            <m-menu-item value="subitem3" label="Subitem 3"></m-menu-item>
                        </m-menu-item>
                        <m-menu-item value="item5" label="Item 5"></m-menu-item>
                        <m-menu-item label="Item group 2"><m-menu-item value="subitem4" label="Subitem 4"></m-menu-item>
                            <m-menu-item value="subitem5" label="Subitem 5"></m-menu-item>
                            <m-menu-item value="subitem6" label="Subitem 6"></m-menu-item>
                        </m-menu-item>
                 </m-menu>`
    }));


storiesOf(`${componentsHierarchyRootSeparator}${MENU_NAME}/menuItem`, module)
    .addDecorator(withA11y)
    .add('value', () => ({
        data: () => ({
            menuIsOpened: true,
            selectedItem: 'item1'
        }),
        template: `<m-menu :open.sync="menuIsOpened" :selected.sync="selectedItem" :closeOnSelection="false">
                        <div slot="trigger">Menu</div>
                        <m-menu-item label="Item 1" value="item1" ></m-menu-item>
                   </m-menu>`
    }))
    .add('label', () => ({
        data: () => ({
            menuIsOpened: true,
            selectedItem: 'item1'
        }),
        template: `<m-menu :open.sync="menuIsOpened" :selected.sync="selectedItem" :closeOnSelection="false">
                        <div slot="trigger">Menu</div>
                        <m-menu-item label="Item 1" value="item1" ></m-menu-item>
                   </m-menu>`
    }))
    .add('url', () => ({
        data: () => ({
            menuIsOpened: true,
            selectedItem: 'item1'
        }),
        template: `<m-menu :open.sync="menuIsOpened" :selected.sync="selectedItem" :closeOnSelection="false">
                        <div slot="trigger">Menu</div>
                        <m-menu-item label="Item 1" value="item1" url="http://www.google.ca"></m-menu-item>
                   </m-menu>`
    }))
    .add('icon-name', () => ({
        data: () => ({
            menuIsOpened: true,
            selectedItem: 'item1'
        }),
        template: `<m-menu :open.sync="menuIsOpened" :selected.sync="selectedItem" :closeOnSelection="false">
                        <div slot="trigger">Menu</div>
                        <m-menu-item icon-name="m-svg__calendar" label="Item 1" value="item1"></m-menu-item>
                   </m-menu>`
    }))
    .add('disabled', () => ({
        data: () => ({
            menuIsOpened: true,
            selectedItem: 'item1'
        }),
        template: `<m-menu :open.sync="menuIsOpened" :selected.sync="selectedItem" :closeOnSelection="false">
                        <div slot="trigger">Menu</div>
                        <m-menu-item :disabled="true" label="Item 1" value="item1"></m-menu-item>
                   </m-menu>`
    }))
    .add('open', () => ({
        data: () => ({
            menuIsOpened: true,
            selectedItem: 'item1'
        }),
        template: `<m-menu :open.sync="menuIsOpened" :selected.sync="selectedItem" :closeOnSelection="false">
                        <div slot="trigger">Menu</div>
                        <m-menu-item :open="true" label="Item group 1">
                            <m-menu-item value="subitem1" label="Subitem 1"></m-menu-item>
                            <m-menu-item value="subitem2" label="Subitem 2"></m-menu-item>
                            <m-menu-item value="subitem3" label="Subitem 3"></m-menu-item>
                        </m-menu-item>
                   </m-menu>`
    }));

