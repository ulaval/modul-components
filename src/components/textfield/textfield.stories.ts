import { withA11y } from '@storybook/addon-a11y';
import { text, select, boolean, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/vue';
import Vue from 'vue';
import { componentsHierarchyRootSeparator } from '../../../conf/storybook/utils';
import { TEXTFIELD_NAME } from '../component-names';
import TextfieldPlugin from './textfield';
Vue.use(TextfieldPlugin);


declare module '@storybook/addon-knobs' {
    export function withKnobs(): any;
}


storiesOf(`${componentsHierarchyRootSeparator}${TEXTFIELD_NAME}`, module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .add('default', () => ({
        props: {
            text: {
                default: text('Text', 'A Textfield')
            }
        },
        template: '<m-textfield>{{ text }}</m-textfield>'
    }))
    .add('placeholder', () => ({
        props: {
            placeholder: {
                default: text('Placeholder', 'A placeholder')
            }
        },
        template: '<m-textfield :placeholder="placeholder"></m-textfield>'
    }))
    .add('label', () => ({
        props: {
            label: {
                default: text('Label', 'A Label')
            }
        },
        template: '<m-textfield :label="label"></m-textfield>'
    }))
    .add('placeholder', () => ({
        props: {
            placeholder: {
                default: text('Text', 'A placeholder')
            }
        },
        template: '<m-textfield :placeholder="placeholder"></m-textfield>'
    }))
    .add('value', () => ({
        props: {
            value: {
                default: text('Text', 'A value')
            }
        },
        template: '<m-textfield :value="value"></m-textfield>'
    }))
    .add('required-marker', () => ({
        template: '<m-textfield :required-marker="true"></m-textfield>'
    }))
    .add('required', () => ({
        template: '<m-textfield :required="true"></m-textfield>'
    }))
    .add('waiting', () => ({
        template: '<m-textfield :waiting="true"></m-textfield>'
    }))
    .add('disabled', () => ({
        template: '<m-textfield :disabled="true"></m-textfield>'
    }))
    .add('readonly', () => ({
        template: '<m-textfield :readonly="true"></m-textfield>'
    }));

storiesOf(`${componentsHierarchyRootSeparator}${TEXTFIELD_NAME}/type`, module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .add('all types', () => ({
        props: {
            type: {
                default: select('input type', {
                    'text': 'text',
                    'password': 'password',
                    'email': 'email',
                    'url': 'url',
                    'tel': 'tel',
                    'search': 'search',
                    'number': 'number',
                }, 'text')
            }
        },
        template: '<m-textfield :label="type" :placeholder="type" :type="type"></m-textfield>'
    }))
    .add('type="text"', () => ({
        template: '<m-textfield type="text" value="Text"></m-textfield>'
    }))
    .add('type="password"', () => ({
        template: '<m-textfield type="password" value="password"></m-textfield>'
    }))
    .add('type="email"', () => ({
        template: '<m-textfield type="email" value="john.doe@gmail.com"></m-textfield>'
    }))
    .add('type="url"', () => ({
        template: '<m-textfield type="url" value="http://www.google.ca"></m-textfield>'
    }))
    .add('type="tel"', () => ({
        template: '<m-textfield type="tel" value="123456789"></m-textfield>'
    }))
    .add('type="search"', () => ({
        template: '<m-textfield type="search" value="Search Query"></m-textfield>'
    }))
    .add('type="number"', () => ({
        template: '<m-textfield type="number" value="156168468"></m-textfield>'
    }));

storiesOf(`${componentsHierarchyRootSeparator}${TEXTFIELD_NAME}/character count`, module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .add('all props', () => ({
        props: {
            characterCount: {
                default: boolean('character-count', true)
            },
            maxLength: {
                default: text('max-length', '20')
            },
            lengthOverflow: {
                default: boolean('length-overflow', true)
            },
            characterCountThreshold: {
                default: text('character-count-threshold', '30')
            }
        },
        template: `<m-textfield :character-count="characterCount" character-count-threshold="characterCountThreshold" 
                :length-overflow="lengthOverflow" :max-length="maxLength"></m-textfield>`
    }));
