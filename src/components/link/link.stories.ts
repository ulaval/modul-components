import { withA11y } from '@storybook/addon-a11y';
import { withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/vue';
import Vue from 'vue';
import { componentsHierarchyRootSeparator } from '../../../conf/storybook/utils';
import { LINK_NAME } from '../component-names';
import LinkPlugin from './link';
Vue.use(LinkPlugin);


declare module '@storybook/addon-knobs' {
    export function withKnobs(): any;
}


storiesOf(`${componentsHierarchyRootSeparator}${LINK_NAME}`, module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .add('default', () => ({
            template: '<m-link mode="link" url="#">A link</m-link>'
    }))
    .add('url', () => ({
        template: '<m-link mode="link" url="http://www.google.ca">A link</m-link>'
    }))
    .add('disabled', () => ({
        template: '<m-link mode="link" url="#" :disabled="true">A link</m-link>'
    }))
    .add('unvisited', () => ({
        template: '<m-link mode="link" url="#" :unvisited="true">A link</m-link>'
    }))
    .add('underline', () => ({
        template: '<m-link mode="link" url="#" :underline="false">A link</m-link>'
    }))
    .add('icon', () => ({
        template: '<m-link mode="link" url="#" :icon="true">A link</m-link>'
    }))
    .add('icon-size="20px"', () => ({
        template: '<m-link :icon="true" mode="link" url="#" icon-size="20px">A link</m-link>'
    }))
    .add('icon-name="m-svg__clock"', () => ({
        template: '<m-link mode="link" url="#" icon-name="m-svg__clock">A link</m-link>'
    }))
    .add('icon-position="right"', () => ({
        template: '<m-link mode="link" url="#" :icon="true" icon-position="right">A link</m-link>'
    }))
    .add('tabindex="1"', () => ({
        template: '<m-link mode="link" url="#" tabindex="1">A link</m-link>'
    }))
    .add('skin="default"', () => ({
        template: '<m-link mode="link" url="#">A link</m-link>'
    }));

storiesOf(`${componentsHierarchyRootSeparator}${LINK_NAME}/skin="text"`, module)
    .addDecorator(withA11y)
    .add('default', () => ({
        template: '<m-link mode="link" url="#" skin="text">A link</m-link>'
    }));

storiesOf(`${componentsHierarchyRootSeparator}${LINK_NAME}/skin="light"`, module)
    .addDecorator(withA11y)
    .add('default', () => ({
        template: `<div style="background: grey;">
                        <m-link mode="link" url="#" skin="light">A link</m-link>
                   </div>`
    }));

storiesOf(`${componentsHierarchyRootSeparator}${LINK_NAME}/mode`, module)
    .addDecorator(withA11y)
    // .add('default (router-link)', () => ({
    //     data: () => ({
    //         routerLink: { name: 'router-test', path: 'components/m-link' }
    //     }),
    //     template: `<m-link :url="routerLink">A link</m-link>`
    // }))
    .add('mode="link', () => ({
        template: '<m-link mode="link" url="#">A link</m-link>'
    }))
    .add('mode="button"', () => ({
        template: '<m-link mode="button" url="#">A link</m-link>'
    }));

