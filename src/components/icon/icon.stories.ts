import { object, select, text } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/vue';
import Vue from 'vue';
import { componentsHierarchyRootSeparator } from '../../../conf/storybook/utils';
import { ICON_NAME } from '../component-names';
import IconPlugin from './icon';

Vue.use(IconPlugin);



const ICONLIST_SHORTHAND: {} = {
    'profile': 'profile',
    'information': 'information',
    'confirmation': 'confirmation',
    'warning': 'warning',
    'error': 'error',
    'calendar': 'calendar',
    'hint': 'hint',
    'clock': 'clock'
};

const ICONLIST_LONGHAND: {} = {
    'm-svg__profile': 'm-svg__profile',
    'm-svg__information': 'm-svg__information',
    'm-svg__confirmation': 'm-svg__confirmation',
    'm-svg__warning': 'm-svg__warning',
    'm-svg__error': 'm-svg__error',
    'm-svg__calendar': 'm-svg__calendar',
    'm-svg__hint': 'm-svg__hint',
    'm-svg__clock': 'm-svg__clock'
};

storiesOf(`${componentsHierarchyRootSeparator}${ICON_NAME}`, module)


    .add('name (short)', () => ({
        props: {
            name: {
                default: select('name', ICONLIST_SHORTHAND, 'profile')
            }
        },
        template: `<div>
                       <m-icon :name="name"></m-icon>
                       <span style="margin-left: 15px">Current name: <span style="color:red">{{ name }}</span></span>
                   </div>`
    }))
    .add('name (long)', () => ({
        props: {
            name: {
                default: select('name', ICONLIST_LONGHAND, 'm-svg__profile')
            }
        },
        template: `<div>
                       <m-icon :name="name"></m-icon>
                       <span style="margin-left: 15px">Current name: <span style="color:red">{{ name }}</span></span>
                   </div>`
    }))
    .add('svgTitle', () => ({
        props: {
            svgTitle: {
                default: text('svgTitle', 'Title1')
            }
        },
        template: `<div>
                       <m-icon :svgTitle="svgTitle" name="profile"></m-icon>
                       <span style="margin-left: 15px">Current svgTitle: <span style="color:red">{{ svgTitle }}</span></span>
                   </div>`
    }))
    .add('size', () => ({
        props: {
            size: {
                default: text('size (px)', '30')
            }
        },
        template: `<div>
                       <m-icon :size="size" name="profile"></m-icon>
                       <span style="margin-left: 15px">Current icon size: <span style="color:red">{{ size }}</span></span>
                   </div>`
    }))
    .add('showNameAsClass', () => ({
        props: {
            name: {
                default: select('icon name as class', ICONLIST_SHORTHAND, 'profile')
            }
        },
        template: `<div>
                       <m-icon :name="name" :showNameAsClass="true"></m-icon>
                       <span style="margin-left: 15px">Current className on svg Icon: <span style="color:red">{{ name }}</span></span>
                   </div>`
    }));

storiesOf(`${componentsHierarchyRootSeparator}${ICON_NAME}/badge`, module)


    .add('state', () => ({
        props: {
            badge: {
                default: object("{ state: 'completed|error|warning' }", { state: 'completed' })
            },
            size: {
                default: text('size (px)', '30')
            }
        },
        template: '<m-icon :size="size" v-m-badge="badge" name="profile"></m-icon>'
    }))
    .add('offsetX', () => ({
        props: {
            badge: {
                default: object("{ state: 'completed|error|warning', offsetX: 'valueX' }", {
                    state: 'completed',
                    offsetX: '9px'
                })
            }
        },
        template: '<m-icon size="30px" v-m-badge="badge" name="profile"></m-icon>'
    }))
    .add('offsetY', () => ({
        props: {
            badge: {
                default: object("{ state: 'completed|error|warning', offsetY: 'valueY' }", {
                    state: 'completed',
                    offsetY: '7px'
                })
            }
        },
        template: '<m-icon size="30px" v-m-badge="badge" name="profile"></m-icon>'
    }))
    .add('state, offsetY, offsetX', () => ({
        props: {
            badge: {
                default: object("{ state: 'completed|error|warning', offsetX: 'valueX', offsetY: 'valueY' }",
                    { state: 'completed', offsetX: '-5px', offsetY: '-8px' })
            },
            size: {
                default: text('size (px)', '30')
            }
        },
        template: '<m-icon :size="size" v-m-badge="badge" name="profile"></m-icon>'
    }));
