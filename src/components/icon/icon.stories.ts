import { withA11y } from '@storybook/addon-a11y';
import { select, text, object, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/vue';
import Vue from 'vue';
import { componentsHierarchyRootSeparator } from '../../../conf/storybook/utils';
import { ICON_NAME } from '../component-names';
import IconPlugin from './icon';

Vue.use(IconPlugin);


declare module '@storybook/addon-knobs' {
    export function withKnobs(): any;
}


storiesOf(`${componentsHierarchyRootSeparator}${ICON_NAME}`, module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .add('name (short)', () => ({
        props: {
            name: {
                default: select('name', {
                    'profile': 'profile',
                    'information': 'information',
                    'confirmation': 'confirmation',
                    'warning': 'warning',
                    'error': 'error',
                    'calendar': 'calendar',
                    'hint': 'hint',
                    'clock': 'clock'
                }, 'profile')
            },
        },
        template: '<m-icon :name="name"></m-icon>'
    }))
    .add('name (long)', () => ({
        props: {
            name: {
                default: select('name', {
                    'm-svg__profile': 'm-svg__profile',
                    'm-svg__information': 'm-svg__information',
                    'm-svg__confirmation': 'm-svg__confirmation',
                    'm-svg__warning': 'm-svg__warning',
                    'm-svg__error': 'm-svg__error',
                    'm-svg__calendar': 'm-svg__calendar',
                    'm-svg__hint': 'm-svg__hint',
                    'm-svg__clock': 'm-svg__clock'
                }, 'm-svg__profile')
            },
        },
        template: '<m-icon :name="name"></m-icon>'
    }))
    .add('svgTitle', () => ({
        props: {
            svgTitle: {
                default: text('svgTitle', 'Title1')
            },
        },
        template: `<div>
                       <m-icon :svgTitle="svgTitle" name="profile"></m-icon>
                       <span style="margin-left: 15px">Current svgTitle: <span style="color:red">{{ svgTitle }}</span></span>
                   </div>`
    }))
    .add('size', () => ({
        props: {
            size: {
                default: text('size', '30px')
            },
        },
        template: `<div>
                       <m-icon :size="size" name="profile"></m-icon>
                       <span style="margin-left: 15px">Current icon size: <span style="color:red">{{ size }}</span></span>
                   </div>`
    }))
    .add('showNameAsClass', () => ({
        props: {
            name: {
                default: select('icon name as class', {
                        'profile': 'profile',
                        'information': 'information',
                        'confirmation': 'confirmation',
                        'warning': 'warning',
                        'error': 'error',
                        'calendar': 'calendar',
                        'hint': 'hint',
                        'clock': 'clock'
                    }, 'profile')
            },
        },
        template: `<div>
                       <m-icon :name="name" :showNameAsClass="true"></m-icon>
                       <span style="margin-left: 15px">Current className on svg Icon: <span style="color:red">{{ name }}</span></span>
                   </div>`
    }))
    .add('badge', () => ({
        props: {
            badge: {
                default: object('state', 'completed')
            },
        },
        template: '<m-icon :v-m-badge="badge" name="profile"></m-icon>'
    }));
