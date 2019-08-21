import { text } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/vue';
import Vue from 'vue';
import { componentsHierarchyRootSeparator } from '../../../conf/storybook/utils';
import { BREADCRUMBS_NAME } from '../component-names';
import BreadcrumbsPlugin, { BreadcrumbItem } from './breadcrumbs';

Vue.use(BreadcrumbsPlugin);

const itemWithDivider: BreadcrumbItem = {
    divider: '<',
    iconName: '',
    disabled: false,
    text: 'itemWithDivider',
    url: 'www.itemWithDivider.ca'
};

const itemWithIcon: BreadcrumbItem = {
    divider: '',
    iconName: 'm-svg__add-circle-filled',
    disabled: false,
    text: 'itemWithIcon',
    url: 'www.itemWithIcon.ca'
};

const itemDisabled: BreadcrumbItem = {
    divider: '',
    iconName: '',
    disabled: true,
    text: 'itemDisabled',
    url: 'www.itemDisabled.ca'
};

const itemWithoutUrl: BreadcrumbItem = {
    divider: '',
    iconName: '',
    disabled: false,
    text: 'itemWithoutUrl',
    url: ''
};

const itemWithoutText: BreadcrumbItem = {
    divider: '',
    iconName: '',
    disabled: false,
    text: '',
    url: ''
};

const items: BreadcrumbItem[] = [itemWithDivider, itemWithIcon, itemDisabled, itemWithoutUrl, itemWithoutText];

storiesOf(`${componentsHierarchyRootSeparator}${BREADCRUMBS_NAME}`, module)
    .add('Default', () => ({
        data: () => ({
            items
        }),
        props: {
            divider: {
                default: text('Divider', '/')
            }
        },
        template: `<m-breadcrumbs :items="items" :divider="divider"></m-breadcrumbs>`
    }));
