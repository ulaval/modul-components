import { boolean, select, text } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/vue';
import Vue from 'vue';
import { componentsHierarchyRootSeparator } from '../../../conf/storybook/utils';
import { ICON_BUTTON_NAME } from '../component-names';
import IconButtonPlugin from './icon-button';

Vue.use(IconButtonPlugin);



const ICON_BUTTON_SKINS: {} = {
    'light': 'light',
    'dark': 'dark',
    'primary': 'primary',
    'secondary': 'secondary',
    'link': 'link',
    'bold': 'bold'
};

const ICON_BUTTON_ICONNAMES: {} = {
    'm-svg__close-clear': 'm-svg__close-clear',
    'm-svg__profile': 'm-svg__profile',
    'm-svg__information': 'm-svg__information',
    'm-svg__confirmation': 'm-svg__confirmation',
    'm-svg__warning': 'm-svg__warning',
    'm-svg__error': 'm-svg__error',
    'm-svg__calendar': 'm-svg__calendar',
    'm-svg__hint': 'm-svg__hint',
    'm-svg__clock': 'm-svg__clock'
};

storiesOf(`${componentsHierarchyRootSeparator}${ICON_BUTTON_NAME}`, module)


    .add('name (short)', () => ({
        template: '<m-icon-button></m-icon-button>'
    }))
    .add('title', () => ({
        props: {
            title: {
                default: text('title', 'This is a custom title')
            }
        },
        template: `<div>
                    <m-icon-button :title="title"></m-icon-button>
                    <br>
                    <span>Current title: <span style="color: red">{{ title }}</span></span>
                   </div>`
    }))
    .add('disabled', () => ({
        props: {
            disabled: {
                default: boolean('disabled', true)
            }
        },
        template: '<m-icon-button :disabled="disabled"></m-icon-button>'
    }))
    .add('buttonSize', () => ({
        props: {
            buttonSize: {
                default: text('size (px)', '44')
            }
        },
        template: '<m-icon-button :buttonSize="`${buttonSize}px`"></m-icon-button>'
    }))
    .add('iconSize', () => ({
        props: {
            iconSize: {
                default: text('size (px)', '20')
            }
        },
        template: '<m-icon-button :iconSize="`${iconSize}px`"></m-icon-button>'
    }))
    .add('iconName', () => ({
        props: {
            iconName: {
                default: select('icon name', ICON_BUTTON_ICONNAMES, 'm-svg__close-clear')
            }
        },
        template: '<m-icon-button :iconName="iconName"></m-icon-button>'
    }))
    .add('ripple', () => ({
        props: {
            ripple: {
                default: boolean('ripple', true)
            }
        },
        template: `<div>
                    <p>Ripple effect on click when :ripple=true</p>
                    <br>
                    <m-icon-button :title="title"></m-icon-button>
                   </div>`

    }));

storiesOf(`${componentsHierarchyRootSeparator}${ICON_BUTTON_NAME}/skin`, module)


    .add('all skins (use knob)', () => ({
        props: {
            skin: {
                default: select('skin', ICON_BUTTON_SKINS, 'light')
            }
        },
        template: '<m-icon-button :skin="skin"></m-icon-button>'
    }))
    .add('skin="light"', () => ({
        template: '<m-icon-button skin="light"></m-icon-button>'
    }))
    .add('skin="dark"', () => ({
        template: '<m-icon-button skin="dark" style="background: black"></m-icon-button>'
    }))
    .add('skin="primary"', () => ({
        template: '<m-icon-button skin="primary"></m-icon-button>'
    }))
    .add('skin="secondary"', () => ({
        template: '<m-icon-button skin="secondary"></m-icon-button>'
    }))
    .add('skin="link"', () => ({
        template: '<m-icon-button skin="link"></m-icon-button>'
    }))
    .add('skin="bold"', () => ({
        template: '<m-icon-button skin="bold"></m-icon-button>'
    }));

storiesOf(`${componentsHierarchyRootSeparator}${ICON_BUTTON_NAME}/all props`, module)


    .add('make your own', () => ({
        props: {
            skin: {
                default: select('skin', ICON_BUTTON_SKINS, 'light')
            },
            title: {
                default: text('title', 'This is some text')
            },
            disabled: {
                default: boolean('disabled', false)
            },
            buttonSize: {
                default: text('button size (px)', '44')
            },
            iconSize: {
                default: text('icon size (px)', '20')
            },
            iconName: {
                default: select('icon name', ICON_BUTTON_ICONNAMES, 'm-svg__close-clear')
            },
            ripple: {
                default: boolean('ripple', true)
            }
        },
        template: `<div>
                        <p><span style="color: blue">skin</span> is set to <span style="color: red">{{ skin }}</span></p>
                        <p><span style="color: blue">disabled</span> is set to <span style="color: red">{{ disabled }}</span></p>
                        <p><span style="color: blue">buttonSize</span> is set to <span style="color: red">{{ buttonSize }}</span></p>
                        <p><span style="color: blue">iconSize</span> is set to <span style="color: red">{{ iconSize }}</span></p>
                        <p><span style="color: blue">iconName</span> is set to <span style="color: red">{{ iconName }}</span></p>
                        <p><span style="color: blue">ripple</span> is set to <span style="color: red">{{ ripple }}</span></p>
                        <br>
                        <div style="width: 250px; border-bottom: 1px solid black"></div>
                        <br>
                        <m-icon-button :buttonSize="buttonSize" :disabled="disabled" :iconName="iconName" :iconSize="iconSize"
                        :title="title" :ripple="ripple" :skin="skin"></m-icon-button>
                  </div>`
    }));
