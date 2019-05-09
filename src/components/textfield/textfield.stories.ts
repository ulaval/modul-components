import { withA11y } from '@storybook/addon-a11y';
import { boolean, select, text, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/vue';
import Vue from 'vue';
import { componentsHierarchyRootSeparator } from '../../../conf/storybook/utils';
import { TEXTFIELD_NAME } from '../component-names';
import TextfieldPlugin from './textfield';

Vue.use(TextfieldPlugin);

declare module '@storybook/addon-knobs' {
    export function withKnobs(): any;
}

const TEXTFIELD_TYPES: {} = {
    'text': 'text',
    'password': 'password',
    'email': 'email',
    'url': 'url',
    'tel': 'tel',
    'search': 'search',
    'number': 'number'
};

const TEXTFIELD_WIDTHS: {} = {
    'X-Small': 'x-small',
    'Small': 'small',
    'Regular': 'regular',
    'Medium': 'medium',
    'Large': 'large'
};

const TEXTFIELD_STYLES: {} = {
    'h1': 'h1',
    'h2': 'h2',
    'h3': 'h3',
    'h4': 'h4',
    'h5': 'h5',
    'h6': 'h6',
    'h7': 'h7'
};

storiesOf(`${componentsHierarchyRootSeparator}${TEXTFIELD_NAME}`, module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .add('default', () => ({
        data: () => ({
            model: ''
        }),
        methods: {
            onInputChange(value: string): string {
                // tslint:disable-next-line: no-console
                console.log('MtextField.onInputChange=' + value);
                return value;
            },
            onFocus(value: Event): void {
                // tslint:disable-next-line: no-console
                console.log('MtextField.onFocus');

            },
            onBlur(event: Event): void {
                // tslint:disable-next-line: no-console
                console.log('MtextField.onBlur');

            }
        },
        template: '<div><m-textfield v-model="model" @input="model = onInputChange($event)" @focus="onFocus" @blur="onBlur"></m-textfield><br/>model value = {{model}}</div>'
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
        template: '<m-textfield label="Label" :required-marker="true"></m-textfield>'
    }))
    .add('waiting', () => ({
        template: '<m-textfield :waiting="true"></m-textfield>'
    }))
    .add('disabled', () => ({
        template: '<m-textfield :disabled="true" value="Lorem Ipsum"></m-textfield>'
    }))
    .add('readonly', () => ({
        template: '<m-textfield :readonly="true" value="Lorem Ipsum"></m-textfield>'
    }))
    .add('error', () => ({
        template: '<m-textfield :error="true" type="tel" value="12345"></m-textfield>'
    }))
    .add('valid', () => ({
        template: '<m-textfield :valid="true" type="tel" value="12345"></m-textfield>'
    }))
    .add('error-message', () => ({
        template: '<m-textfield error-message="This is an Error" type="tel" value="12345"></m-textfield>'
    }))
    .add('valid-message', () => ({
        template: '<m-textfield valid-message="This is not an Error" type="tel" value="12345"></m-textfield>'
    }))
    .add('helper-message', () => ({
        template: '<m-textfield helper-message="This message is here to help you" type="tel" value="12345"></m-textfield>'
    }))
    .add('word-wrap', () => ({
        template: '<m-textfield value="abcdefghijklmnopqrstuvwxyz-123456789123456789123456789" word-wrap="true"></m-textfield>'
    }))
    .add('placeholder-icon', () => ({
        template: '<m-textfield label="Label" placeholder="Placeholder" placeholder-icon-name="m-svg__search" word-wrap="true"></m-textfield>'
    }))
    .add('focus', () => ({
        template: '<m-textfield label="label" focus="true" placeholder="placeholder"></m-textfield>'
    }))
    .add('label-up', () => ({
        template: '<m-textfield label="label" label-up="true" placeholder="placeholder"></m-textfield>'
    }));

storiesOf(`${componentsHierarchyRootSeparator}${TEXTFIELD_NAME}/type`, module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .add('all types', () => ({
        props: {
            type: {
                default: select('input type', TEXTFIELD_TYPES, 'text')
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

storiesOf(`${componentsHierarchyRootSeparator}${TEXTFIELD_NAME}/Counter`, module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .add('all props', () => ({
        props: {
            maxLength: {
                default: text('max-length', '20')
            },
            characterCount: {
                default: boolean('character-count', true)
            },
            characterCountThreshold: {
                default: text('character-count-threshold', '10')
            },
            lengthOverflow: {
                default: boolean('length-overflow', false)
            }
        },
        template: `<m-textfield :character-count="characterCount" :character-count-threshold="characterCountThreshold"
                label="Enter a value" :length-overflow="lengthOverflow" :max-length="maxLength"
                placeholder="change knobs to further test"></m-textfield>`
    }))
    .add('max-length="20"', () => ({
        template: `<m-textfield :length-overflow="false" placeholder="max-length='20' length-overflow='false'"
                    max-length="20"></m-textfield>`
    }))
    .add('character-count', () => ({
        template: `<m-textfield :character-count="true" placeholder=":character-count='true' max-length='20'"
                    max-length="20"></m-textfield>`
    }))
    .add('length-overflow="true"', () => ({
        template: `<m-textfield :length-overflow="true" placeholder=":length-overflow='true' max-length='20'"
                    max-length="20"></m-textfield>`
    }))
    .add('character-count-threshold="10"', () => ({
        template: `<m-textfield :character-count="true" :character-count-threshold="10" max-length="20"
                    placeholder=":character-count='true' :character-count-threshold='10' max-length='20'"></m-textfield>`
    }));

storiesOf(`${componentsHierarchyRootSeparator}${TEXTFIELD_NAME}/max-width`, module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .add('all max-width presets', () => ({
        props: {
            maxWidth: {
                default: select('textfield width', TEXTFIELD_WIDTHS, 'text')
            }
        },
        template: '<m-textfield :label="maxWidth" :max-width="maxWidth" :placeholder="type" :type="type"></m-textfield>'
    }))
    .add('x-small', () => ({
        template: `<m-textfield label="x-small" max-width="x-small"></m-textfield>`
    }))
    .add('small', () => ({
        template: `<m-textfield label="small" max-width="small"></m-textfield>`
    }))
    .add('regular', () => ({
        template: `<m-textfield label="regular" max-width="regular"></m-textfield>`
    }))
    .add('medium', () => ({
        template: `<m-textfield label="medium" max-width="medium"></m-textfield>`
    }))
    .add('large', () => ({
        template: `<m-textfield label="large" max-width="large"></m-textfield>`
    }))
    .add('custom width', () => ({
        template: `<m-textfield label="width='333px' / max-width='none'" max-width="none" width="333px"></m-textfield>`
    }));

storiesOf(`${componentsHierarchyRootSeparator}${TEXTFIELD_NAME}/tag-style`, module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .add('all tag styles', () => ({
        props: {
            maxWidth: {
                default: select('textfield tag style', TEXTFIELD_STYLES, 'text')
            }
        },
        template: '<m-textfield :label="TEXTFIELD_STYLES" :tag-style="TEXTFIELD_STYLES"></m-textfield>'
    }));
