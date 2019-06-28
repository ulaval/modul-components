import { boolean, select, text } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/vue';
import Vue from 'vue';
import { componentsHierarchyRootSeparator } from '../../../conf/storybook/utils';
import { InputStateTagStyle } from '../../mixins/input-state/input-state';
import { InputMaxWidth } from '../../mixins/input-width/input-width';
import { TEXTFIELD_NAME } from '../component-names';
import TextfieldPlugin, { MTextfieldType } from './textfield';


Vue.use(TextfieldPlugin);



storiesOf(`${componentsHierarchyRootSeparator}${TEXTFIELD_NAME}`, module)

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
        template: `<m-textfield value="abcdefghijklmnopqrstuvwxyz-123456789123456789123456789" word-wrap="true" waiting="true">
        </m-textfield>`
    }))
    .add('focus', () => ({
        template: '<m-textfield label="label" focus="true" placeholder="placeholder"></m-textfield>'
    }))
    .add('label-up', () => ({
        template: '<m-textfield label="label" label-up="true" placeholder="placeholder"></m-textfield>'
    }));

storiesOf(`${componentsHierarchyRootSeparator}${TEXTFIELD_NAME}/type`, module)

    .add('all types', () => ({
        props: {
            type: {
                default: select('input type', Object.values(MTextfieldType), MTextfieldType.Text)
            }
        },
        template: '<m-textfield :label="type" :placeholder="type" :type="type"></m-textfield>'
    }))
    .add('type="text"', () => ({
        template: '<m-textfield type="text" value="Text"></m-textfield>'
    }))
    .add('type="password"', () => ({
        template: '<m-textfield type="password" value="password" label="lsdhfasdj khgjkd fhjkghj kadfhgf jkdghdfjk ghdfjkg hdfjk ghd fjkghdj k gh djh"></m-textfield>'
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
    .add('type="number"', () => ({
        template: '<m-textfield type="number" value="156168468"></m-textfield>'
    }));

storiesOf(`${componentsHierarchyRootSeparator}${TEXTFIELD_NAME}/Counter`, module)

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
        template: `<div>
                        <m-textfield :character-count="characterCount" :character-count-threshold="characterCountThreshold"
                        label="Enter a value" :length-overflow="lengthOverflow" :max-length="maxLength"
                        placeholder="change knobs to further test"></m-textfield>
                        <br>
                        <p><span style="color: blue">max-length</span> is equal to <span style="color: red">{{maxLength}}</span></p>
                        <p><span style="color: blue">character-count</span> is equal to <span style="color: red">{{characterCount}}</span></p>
                        <p><span style="color: blue">character-count-threshold</span> is equal to  <span style="color: red">{{characterCountThreshold}}</span></p>
                        <p><span style="color: blue">length-overflow</span> is equal to <span style="color: red">{{lengthOverflow}}</span></p>
                   </div>`
    }))
    .add('max-length="20"', () => ({
        template: `<div>
                        <m-textfield :length-overflow="false" placeholder="Enter a value" max-length="20"
                        value="This is a value"></m-textfield>
                        <br>
                        <p><span style="color: blue">max-length</span> is equal to <span style="color: red">"20"</span></p>
                        <p><span style="color: blue">length-overflow</span> is equal to <span style="color: red">false</span></p>
                   </div>`
    }))
    .add('max-length="200" and :word-wrap="true"', () => ({
        template: `<div>
                        <m-textfield :word-wrap="true" :length-overflow="false" placeholder="Enter a value" max-length="200"
                        value="This is a value"></m-textfield>
                        <br>
                        <p><span style="color: blue">max-length</span> is equal to <span style="color: red">"200"</span></p>
                        <p><span style="color: blue">length-overflow</span> is equal to <span style="color: red">false</span></p>
                        <p><span style="color: blue">word-wrap</span> is equal to <span style="color: red">true</span></p>
                   </div>`
    }))
    .add('character-count', () => ({
        template: `<div>
                        <m-textfield :character-count="true" placeholder="Enter a value" max-length="20"
                        value="This is a value"></m-textfield>
                        <br>
                        <p><span style="color: blue">max-length</span> is equal to <span style="color: red">"20"</span></p>
                        <p><span style="color: blue">character-count</span> is equal to <span style="color: red">true</span></p>
                   </div>`
    }))
    .add('length-overflow="true"', () => ({
        template: `<div>
                        <m-textfield :length-overflow="true" placeholder="Enter a value" max-length="20"
                        value="This is a value"></m-textfield>
                        <br>
                        <p><span style="color: blue">max-length</span> is equal to <span style="color: red">"20"</span></p>
                        <p><span style="color: blue">length-overflow</span> is equal to <span style="color: red">true</span></p>
                   </div>`
    }))
    .add('character-count-threshold="10"', () => ({
        template: `<div>
                        <m-textfield :character-count="true" :character-count-threshold="10" max-length="20"
                        placeholder="Enter a value" value="This is a value"></m-textfield>
                        <br>
                        <p><span style="color: blue">max-length</span> is equal to <span style="color: red">"20"</span></p>
                        <p><span style="color: blue">character-count</span> is equal to <span style="color: red">true</span></p>
                        <p><span style="color: blue">character-count-threshold</span> is equal to  <span style="color: red">"10"</span></p>
                   </div>`
    }));

storiesOf(`${componentsHierarchyRootSeparator}${TEXTFIELD_NAME}/max-width`, module)

    .add('all max-width presets', () => ({
        props: {
            maxWidth: {
                default: select('textfield width', Object.values(InputMaxWidth), InputMaxWidth.Regular)
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
    }))
    .add('pyramid', () => ({
        template: `
        <div>
            <m-textfield label="xs" max-width="x-small" value=""></m-textfield>
            <m-textfield label="xs" max-width="x-small" value=""></m-textfield>
            <m-textfield label="xs" max-width="x-small" value=""></m-textfield>
            <m-textfield label="xs" max-width="x-small" value=""></m-textfield>
            <br />
            <m-textfield label="small" max-width="small" value=""></m-textfield>
            <m-textfield label="small" max-width="small" value=""></m-textfield>
            <br />
            <m-textfield label="regular" max-width="regular" value=""></m-textfield>
            <m-textfield label="regular" max-width="regular" value="" :label-offset="false"></m-textfield>
            <br />
            <m-textfield label="medium" max-width="medium" value=""></m-textfield>
            <br />
            <m-textfield label="large" max-width="large" value=""></m-textfield>
        </div>
        `
    }));

storiesOf(`${componentsHierarchyRootSeparator}${TEXTFIELD_NAME}/tag-style`, module)

    .add('all tag styles', () => ({
        props: {
            tagStyle: {
                default: select('tag style', Object.values(InputStateTagStyle), InputStateTagStyle.H3)
            }
        },
        template: '<m-textfield :label="tagStyle" :tag-style="tagStyle" :value="tagStyle"></m-textfield>'
    }));
