import { boolean, number, select, text } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/vue';
import Vue from 'vue';
import { componentsHierarchyRootSeparator } from '../../../conf/storybook/utils';
import { INPUT_STYLE_NAME } from '../component-names';
import RichTextEditorPlugin from '../rich-text-editor/rich-text-editor';
import InputStylePlugin from './input-style';
Vue.use(InputStylePlugin);
Vue.use(RichTextEditorPlugin);





storiesOf(`${componentsHierarchyRootSeparator}${INPUT_STYLE_NAME}`, module)


    .add('default', () => ({
        props: {
            defaultSlot: {
                default: text('Default slot', '')
            }
        },
        template: '<m-input-style>{{defaultSlot}}</m-input-style>'
    }))
    .add('testAllProps', () => ({
        props: {
            defaultSlot: {
                default: text('Default slot', '')
            },
            label: {
                default: text('label', 'label')
            },
            tagStyle: {
                default: select('tagStyle', {
                    'default': 'default',
                    'h1': 'h1',
                    'h2': 'h2',
                    'h3': 'h3',
                    'h4': 'h4',
                    'h5': 'h5',
                    'h6': 'h6',
                    'p': 'p'
                }, 'default')
            },
            width: {
                default: number('width', 150)
            },
            empty: {
                default: boolean('empty', true)
            },
            focus: {
                default: boolean('focus', false)
            },
            readonly: {
                default: boolean('Readonly', false)
            },
            cursorPointer: {
                default: boolean('Cursor pointer', false)
            },
            requiredMarker: {
                default: boolean('Required marker', false)
            },
            disabled: {
                default: boolean('Disabled', false)
            },
            waiting: {
                default: boolean('Waiting', false)
            },
            error: {
                default: boolean('error', false)
            },
            valid: {
                default: boolean('valid', false)
            }
        },
        template: '<m-input-style :label="label" :tagStyle="tagStyle" :empty="empty" :focus="focus" :error="error" :valid="valid" :width="width+\'px\'" :disabled="disabled" :waiting="waiting" :cursor-pointer="cursorPointer" :readonly="readonly" :required-marker="requiredMarker">{{defaultSlot}}</m-input-style>'
    }))
    .add('label', () => ({
        props: {
            label: {
                default: text('Label', 'label')
            }
        },
        template: '<m-input-style :label="label"></m-input-style>'
    }))
    .add('labelFor', () => ({
        props: {
            labelFor: {
                default: text('Change labelFor', 'Label for')
            }
        },
        template: '<div style="margin: 0;"><m-input-style label="Label" :label-for="labelFor"></m-input-style><p>Open <em>Page Inspector</em> to see <strong>for</strong> attribute on label tag.</p></div>'
    }))
    .add('empty', () => ({
        props: {
            empty: {
                default: boolean('Empty', false)
            }
        },
        template: '<m-input-style label="Label" :empty="empty">Empty ({{empty}})</m-input-style>'
    }))
    .add('focus', () => ({
        props: {
            focus: {
                default: boolean('Focus', true)
            }
        },
        template: '<m-input-style label="Label" :focus="focus" :empty="false">Focus ({{focus}})</m-input-style>'
    }))
    .add('width', () => ({
        props: {
            width: {
                default: number('Width', 150)
            }
        },
        template: '<m-input-style label="Label" :width="width+\'px\'" :focus="true" :empty="false">Width ({{width}}px)</m-input-style>'
    }))
    .add('requiredMarker', () => ({
        props: {
            requiredMarker: {
                default: boolean('Required marker', true)
            }
        },
        template: '<m-input-style label="Label" :required-marker="requiredMarker" :empty="false">Required marker ({{requiredMarker}})</m-input-style>'
    }))
    .add('readonly', () => ({
        props: {
            readonly: {
                default: boolean('Readonly', true)
            }
        },
        template: '<m-input-style label="Label" :readonly="readonly" :empty="false">Readonly ({{readonly}})</m-input-style>'
    }))
    .add('cursorPointer', () => ({
        props: {
            cursorPointer: {
                default: boolean('Cursor pointer', true)
            }
        },
        template: '<m-input-style label="Label" :cursor-pointer="cursorPointer" :empty="false">Cursor pointer ({{ cursorPointer }})</m-input-style>'
    }))
    .add('disabled', () => ({
        props: {
            disabled: {
                default: boolean('Disabled', true)
            }
        },
        template: '<m-input-style label="Label" :disabled="disabled" :empty="false">Disabled ({{disabled}})</m-input-style>'
    }))
    .add('waiting', () => ({
        props: {
            waiting: {
                default: boolean('Waiting', true)
            }
        },
        template: '<m-input-style label="Label tres long et bla bla bla" :waiting="waiting" :empty="false">Waiting ({{waiting}})</m-input-style>'
    }))
    .add('error', () => ({
        props: {
            error: {
                default: boolean('Error', true)
            }
        },
        template: '<div><m-input-style label="Label" :error="error" :empty="false">Error ({{error}})</m-input-style><p>Visual when the prop <strong>error = true</strong> and prop <strong>valide = true</strong></p><m-input-style label="Label" :error="true" valid="true" :empty="false">Hello</m-input-style></div>'
    }))
    .add('valid', () => ({
        props: {
            valid: {
                default: boolean('Valid', true)
            }
        },
        template: '<div><m-input-style label="Label" :valid="valid" :empty="false">Valid ({{valid}})</m-input-style><p>Visual when the prop <strong>error = true</strong> and prop <strong>valide = true</strong></p><m-input-style label="Label" :error="true" valid="true" :empty="false">Hello</m-input-style></div>'
    }))
    .add('tagStyle', () => ({
        props: {
            tagStyle: {
                default: select('tagStyle', {
                    'default': 'default',
                    'h1': 'h1',
                    'h2': 'h2',
                    'h3': 'h3',
                    'h4': 'h4',
                    'h5': 'h5',
                    'h6': 'h6',
                    'p': 'p'
                }, 'h1')
            }
        },
        template: '<m-input-style label="label" :empty="false" :tag-style="tagStyle">Title ({{tagStyle}})</m-input-style>'
    }))
    .add('rich text editor', () => ({
        template: '<m-rich-text-editor max-width="large" label="RTE - test for regressions"></m-rich-text-editor>'
    }));
