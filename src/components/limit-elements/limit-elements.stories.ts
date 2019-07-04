import { storiesOf } from '@storybook/vue';
import Vue from 'vue';
import { componentsHierarchyRootSeparator } from '../../../conf/storybook/utils';
import { LIMIT_ELEMENTS } from '../component-names';
import LimitElementsPlugin from './limit-elements';

Vue.use(LimitElementsPlugin);

storiesOf(`${componentsHierarchyRootSeparator}${LIMIT_ELEMENTS}`, module)

    .add('1 element, limit of 2', () => ({
        props: {
            elements: {
                default: ['Element 1']
            }
        },
        template: '<m-limit-elements :elements="elements"></m-limit-elements>'
    }))
    .add('2 elements, limit of 2', () => ({
        props: {
            elements: {
                default: ['Element 1', 'Element 2']
            }
        },
        template: '<m-limit-elements :elements="elements"></m-limit-elements>'
    }))
    .add('3 elements, limit of 3', () => ({
        props: {
            elements: {
                default: ['Element 1', 'Element 2', 'Element 3']
            }
        },
        template: '<m-limit-elements :elements="elements"></m-limit-elements>'
    }))
    .add('4 elements, limit of 2', () => ({
        props: {
            elements: {
                default: ['Element 1', 'Element 2', 'Element 3', 'Element 4']
            }
        },
        template: '<m-limit-elements :elements="elements"></m-limit-elements>'
    }));
storiesOf(`${componentsHierarchyRootSeparator}${LIMIT_ELEMENTS}/open="false"`, module)
    .add('default', () => ({
        props: {
            elements: {
                default: ['Element 1', 'Element 2', 'Element 3', 'Element 4']
            }
        },
        template: '<m-limit-elements :elements="elements" :open="false"></m-limit-elements>'
    }))
    .add('true', () => ({
        props: {
            elements: {
                default: ['Element 1', 'Element 2', 'Element 3', 'Element 4']
            }
        },
        template: '<m-limit-elements :elements="elements" :open="true"></m-limit-elements>'
    }));

storiesOf(`${componentsHierarchyRootSeparator}${LIMIT_ELEMENTS}/limit="2"`, module)
    .add('default', () => ({
        props: {
            elements: {
                default: ['Element 1', 'Element 2', 'Element 3', 'Element 4', 'Element 5']
            }
        },
        template: '<m-limit-elements :elements="elements" :limit="2"></m-limit-elements>'
    }))
    .add('3', () => ({
        props: {
            elements: {
                default: ['Element 1', 'Element 2', 'Element 3', 'Element 4', 'Element 5']
            }
        },
        template: '<m-limit-elements :elements="elements" :limit="3"></m-limit-elements>'
    }))
    .add('4', () => ({
        props: {
            elements: {
                default: ['Element 1', 'Element 2', 'Element 3', 'Element 4', 'Element 5']
            }
        },
        template: '<m-limit-elements :elements="elements" :limit="4"></m-limit-elements>'
    }));
