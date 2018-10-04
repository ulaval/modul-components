import { shallow, Wrapper } from '../../../node_modules/@vue/test-utils';
import Vue from '../../../node_modules/vue';
import { renderComponent } from '../../../tests/helpers/render';
import uuid from '../../utils/uuid/uuid';
import { MRichTextEditor, MRichTextEditorMode } from './rich-text-editor';
import { MRichTextEditorStandardOptions } from './rich-text-editor-options';
import RichTextLicensePlugin from './rich-text-license-plugin';

jest.mock('../../utils/uuid/uuid');
(uuid.generate as jest.Mock).mockReturnValue('uuid');

const froalaLicenseKey: string = 'testKey';
let wrapper: Wrapper<MRichTextEditor>;
let richTextEditor: MRichTextEditor;
let defaultOptions: MRichTextEditorStandardOptions;

describe('MRichTextEditor', () => {
    beforeEach(() => {
        Vue.use(RichTextLicensePlugin, { key: froalaLicenseKey });
        wrapper = shallow(MRichTextEditor,
            {
                stubs: {
                    froala : '<froala></froala>'
                }
            });
        richTextEditor = wrapper.vm;
        defaultOptions = new MRichTextEditorStandardOptions(froalaLicenseKey, richTextEditor.$i18n.currentLang());
    });

    it('should have a value for each custom translations key', () => {
        Object.keys(richTextEditor.customTranslations).forEach(key => {
            expect(richTextEditor.customTranslations[key]).not.toBe('');
        });
    });

    it('should render correctly', () => {
        expect(renderComponent(richTextEditor)).resolves.toMatchSnapshot();
    });

    it('the key is stored', () => {
        expect(richTextEditor.froalaLicenseKey).toEqual(froalaLicenseKey);
    });

    describe('custom validation for HTML content', () => {
        ['', '<p></p>', '<p>&nbsp;</p>', ' &nbsp; ', '<p><strong></strong></p>']
        .forEach((value: string) => {
            it(`A RTE with '${value}' is considered to be empty`, () => {
                expect(richTextEditor.customHasValue(value)).toBeFalsy();
            });
        });

        ['a', '<p>abc</p>', '<p>a&nbsp;</p>', ' &nbsp; abc', '<p><strong>abc</strong></p>']
        .forEach((value: string) => {
            it(`A RTE with '${value}' is considered NOT to be empty`, () => {
                expect(richTextEditor.customHasValue(value)).toBeTruthy();
            });
        });
    });

    describe('when refreshing model', () => {
        it('should refresh with real value if it has value', () => {
            const content: string = '<p>abc123</p>';

            const obj: Vue = (richTextEditor.$refs.input as Vue).$emit('input', content);

            expect(wrapper.emitted().input[0]).toEqual([content]);
        });

        it(`should refresh with an empty string if it doesn't have value`, () => {
            const content: string = '<p><strong> &nbsp; </strong></p>';

            const obj: Vue = (richTextEditor.$refs.input as Vue).$emit('input', content);

            expect(wrapper.emitted().input[0]).toEqual(['']);
        });
    });

    describe('In standard Mode', () => {
        beforeEach(() => {
            wrapper.setProps({
                mode: MRichTextEditorMode.STANDARD
            });
        });
        it('default options are standard default options', () => {
            expect(richTextEditor.getDefaultOptions()).toEqual(defaultOptions);
        });

    });

    describe('without props set', () => {
        it('internal options are defaultOptions', () => {
            const customOptions: any = { placeholderText: ' ', scrollableContainer: undefined };
            expect(richTextEditor.internalOptions).toEqual({ ...defaultOptions, ...customOptions });
        });
    });

    describe('with props set', () => {
        describe(`with props in error`, () => {
            it('the component should throw an error', () => {
                expect(() => {
                    wrapper = shallow(MRichTextEditor, {
                        propsData: { scrollableContainer: '#container' }
                    });
                }).toThrow(richTextEditor.getSelectorErrorMsg('scrollable-container'));

                expect(() => {
                    wrapper = shallow(MRichTextEditor, {
                        propsData: { toolbarStickyOffset: '#header' }
                    });
                }).toThrow(richTextEditor.getSelectorErrorMsg('toolbar-sticky-offset'));
            });
        });

        it('internal options are customed defaultOptions', () => {
            const customOptions: any = { toolbarStickyOffset: 1, placeholderText: 'placeholder' };

            wrapper.setProps({ toolbarStickyOffset: 1, placeholder: 'placeholder' });
            expect(richTextEditor.internalOptions).toEqual({ ...defaultOptions, ...customOptions });
        });
    });
});
