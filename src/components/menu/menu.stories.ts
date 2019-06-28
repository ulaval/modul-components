import { select, text } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/vue';
import Vue from 'vue';
import VueRouter from 'vue-router';
import { componentsHierarchyRootSeparator } from '../../../conf/storybook/utils';
import { MENU_NAME } from '../component-names';
import MenuPlugin from './menu';

Vue.use(MenuPlugin);
Vue.use(VueRouter);

const storyRouterDecorator: any = (links = {}, routerProps = {}): any => {
    return story => {
        const router: VueRouter = new VueRouter(routerProps);
        const WrappedComponent: any = story();
        return Vue.extend({
            router,
            components: { WrappedComponent },
            template: '<wrapped-component/>'
        });
    };
};

const DEFAULT_MENU_ITEMS: string = `<m-menu-item value="item1" label="Item 1" icon-name="m-svg__profile"></m-menu-item>
                                  <m-menu-item value="item2" label="Item 2"></m-menu-item>
                                  <m-menu-item value="item3" label="Item 3"></m-menu-item>
                                  <m-menu-item label="Item group 1">
                                      <m-menu-item value="subitem1" label="Subitem 1"></m-menu-item>
                                      <m-menu-item value="subitem2" label="Subitem 2"></m-menu-item>
                                      <m-menu-item value="subitem3" label="Subitem 3"></m-menu-item>
                                  </m-menu-item>
                                  <m-menu-item label="Item group 2">
                                      <m-menu-item value="subitem4" label="Subitem 4"></m-menu-item>
                                      <m-menu-item value="subitem5" label="Subitem 5"></m-menu-item>
                                  </m-menu-item>`;




storiesOf(`${componentsHierarchyRootSeparator}${MENU_NAME}`, module)


    .add('default', () => ({
        data: () => ({
            menuIsOpened: false
        }),
        template: `<m-menu :open.sync="menuIsOpened">
                        <div slot="trigger">Menu</div>
                        ${DEFAULT_MENU_ITEMS}
                 </m-menu>`
    }))
    .add('trigger (slot)', () => ({
        data: () => ({
            menuIsOpened: false,
            selectedItem: ''
        }),
        props: {
            triggerText: {
                default: text('triggerText', 'Menu')
            }
        },
        template: `<m-menu :closeOnSelection="false" :open.sync="menuIsOpened" :selected.sync="selectedItem">
                        <div slot="trigger">{{ triggerText}}</div>
                        ${DEFAULT_MENU_ITEMS}
                 </m-menu>`
    }))
    .add('open', () => ({
        data: () => ({
            menuIsOpened: true
        }),
        template: `<m-menu :open.sync="menuIsOpened" :closeOnSelection="false">
                        <div slot="trigger">Menu</div>
                        ${DEFAULT_MENU_ITEMS}
                 </m-menu>`
    }))
    .add('closeOnSelection="false"', () => ({
        data: () => ({
            menuIsOpened: true,
            selectedItem: 'item1'
        }),
        template: `<m-menu :open.sync="menuIsOpened" :selected.sync="selectedItem" :closeOnSelection="false">
                        <div slot="trigger">Menu</div>
                        ${DEFAULT_MENU_ITEMS}
                 </m-menu>`
    }))
    .add('skin=light"', () => ({
        data: () => ({
            menuIsOpened: true,
            selectedItem: 'item1'
        }),
        template: `<m-menu :closeOnSelection="false" :open.sync="menuIsOpened" :selected.sync="selectedItem" skin="light">
                        <div slot="trigger">Menu</div>
                        ${DEFAULT_MENU_ITEMS}
                 </m-menu>`
    }))
    .add('disabled', () => ({
        data: () => ({
            menuIsOpened: true,
            selectedItem: 'item1'
        }),
        template: `<m-menu :closeOnSelection="false" :disabled="true" :open.sync="menuIsOpened" :selected.sync="selectedItem" >
                        <div slot="trigger">Menu</div>
                        ${DEFAULT_MENU_ITEMS}
                 </m-menu>`
    }))
    .add('idAriaControls="ariaTest"', () => ({
        data: () => ({
            menuIsOpened: true,
            selectedItem: 'item1'
        }),
        template: `<m-menu :closeOnSelection="false" :open.sync="menuIsOpened" :selected.sync="selectedItem" idAriaControls="ariaTest">
                        <div slot="trigger">Menu</div>
                        ${DEFAULT_MENU_ITEMS}
                 </m-menu>`
    }));


storiesOf(`${componentsHierarchyRootSeparator}${MENU_NAME}/menuItem`, module)

    .addDecorator(storyRouterDecorator())
    .add('label', () => ({
        data: () => ({
            menuIsOpened: true,
            selectedItem: 'item1'
        }),
        props: {
            label: {
                default: text('label', 'label1')
            }
        },
        template: `<m-menu :open.sync="menuIsOpened" :selected.sync="selectedItem" :closeOnSelection="false">
                        <div slot="trigger">Menu</div>
                        <m-menu-item :label="label"></m-menu-item>
                   </m-menu>`
    }))
    .add('value', () => ({
        data: () => ({
            menuIsOpened: true,
            selectedItem: ''
        }),
        template: `<m-menu :open.sync="menuIsOpened" :selected.sync="selectedItem" :closeOnSelection="false">
                        <div slot="trigger">Menu</div>
                        <m-menu-item label="Item 1" value="item1" ></m-menu-item>
                   </m-menu>`
    }))
    .add('url (router-link)', () => ({
        data: () => ({
            routerLink: { name: 'router-storybook', path: '/components-m-menu--default' },
            menuIsOpened: true,
            selectedItem: ''
        }),
        template: `<m-menu :open.sync="menuIsOpened" :selected.sync="selectedItem" :closeOnSelection="false">
                        <div slot="trigger">Menu</div>
                        <m-menu-item label="Item 1" value="item1" :url="routerLink"></m-menu-item>
                   </m-menu>`
    }))
    .add('default', () => ({
        data: () => ({
            menuIsOpened: true,
            selectedItem: 'item1'
        }),
        template: `<m-menu :open="menuIsOpened" :selected.sync="selectedItem" :closeOnSelection="false">
                        <div slot="trigger">Menu</div>
                        <m-menu-item icon-name="m-svg__profile" label="Item 1" value="item1"></m-menu-item>
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
    .add('readonly', () => ({
        data: () => ({
            menuIsOpened: true,
            selectedItem: 'item1'
        }),
        template: `<m-menu :open.sync="menuIsOpened" :selected.sync="selectedItem" :closeOnSelection="false">
                        <div slot="trigger">Menu</div>
                        <m-menu-item :readonly="true" label="Item 1" value="item1"></m-menu-item>
                   </m-menu>`
    }))
    .add('iconName', () => ({
        data: () => ({
            menuIsOpened: true,
            selectedItem: 'item1'
        }),
        props: {
            iconName: {
                default: select('iconName', {
                    'profile': 'm-svg__profile',
                    'information': 'm-svg__information',
                    'confirmation': 'm-svg__confirmation',
                    'warning': 'm-svg__warning',
                    'error': 'm-svg__error',
                    'calendar': 'm-svg__calendar',
                    'hint': 'm-svg__hint',
                    'clock': 'm-svg__clock'
                }, 'profile')
            }
        },
        template: `<m-menu :open.sync="menuIsOpened" :selected.sync="selectedItem" :closeOnSelection="false">
                        <div slot="trigger">Menu</div>
                        <m-menu-item :iconName="iconName" label="Item 1" value="item1"></m-menu-item>
                   </m-menu>`
    }))
    .add('open', () => ({
        data: () => ({
            menuIsOpened: true,
            selectedItem: ''
        }),
        template: `<m-menu :open.sync="menuIsOpened" :selected.sync="selectedItem" :closeOnSelection="false">
                        <div slot="trigger">Menu</div>
                        <m-menu-item value="item1" label="Item 1" icon-name="m-svg__profile"></m-menu-item>
                        <m-menu-item value="item2" label="Item 2"></m-menu-item>
                        <m-menu-item value="item3" label="Item 3"></m-menu-item>
                        <m-menu-item :open="true" label="Item group 1 - :open='true'">
                            <m-menu-item value="subitem1" label="Subitem 1"></m-menu-item>
                            <m-menu-item value="subitem2" label="Subitem 2"></m-menu-item>
                            <m-menu-item value="subitem3" label="Subitem 3"></m-menu-item>
                        </m-menu-item>
                   </m-menu>`
    }));

