import { mount, shallowMount, Wrapper } from '../../../node_modules/@vue/test-utils';
import Vue from '../../../node_modules/vue';
import { renderComponent } from '../../../tests/helpers/render';
import uuid from '../../utils/uuid/uuid';
import { MRichTextEditor, MRichTextEditorOption } from './rich-text-editor';
import { MRichTextEditorDefaultOptions } from './rich-text-editor-options';
import RichTextLicensePlugin from './rich-text-license-plugin';

jest.mock('../../utils/uuid/uuid');
(uuid.generate as jest.Mock).mockReturnValue('uuid');

const froalaLicenseKey: string = 'testKey';
let wrapper: Wrapper<MRichTextEditor>;
let richTextEditor: MRichTextEditor;
let defaultOptions: MRichTextEditorDefaultOptions;
let headerNormalOption: any = { '': 'm-rich-text-editor:normal-level' };
let i18nTitle: string = 'm-rich-text-editor:title';
let i18nSubtitle: string = 'm-rich-text-editor:subtitle';
let i18nTitleLevel: string = 'm-rich-text-editor:title-level';

describe('MRichTextEditor', () => {
    beforeEach(() => {
        Vue.use(RichTextLicensePlugin, { key: froalaLicenseKey });
        wrapper = mount(MRichTextEditor,
            {
                stubs: {
                    froala: '<div></div>'
                }
            });
        richTextEditor = wrapper.vm;
        defaultOptions = new MRichTextEditorDefaultOptions(froalaLicenseKey, richTextEditor.$i18n.currentLang());
        if (wrapper.vm.titleAvailable) {
            defaultOptions.paragraphStyles = wrapper.vm.manageHeaderLevels();
        }
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

    describe('Without options', () => {
        beforeEach(() => {
            wrapper.setProps({
                options: []
            });
        });
        it('default options are standard default options', () => {
            expect(richTextEditor.getOptions()).toEqual(defaultOptions);
        });

    });

    describe('With image option', () => {
        beforeEach(() => {
            wrapper.setProps({
                options: [MRichTextEditorOption.IMAGE]
            });
        });
        it('default options are standard default options', () => {
            expect(richTextEditor.getOptions().pluginsEnabled).toContain('image');
            expect(richTextEditor.getOptions().toolbarButtons).toContain('insertImage');
        });

    });

    describe(`Given the paragraph style option`, () => {

        describe(`when we want only 1 title`, () => {

            it(`then only 1 title is available`, () => {
                wrapper.setProps({ firstHeaderLevel: 1, lastHeaderLevel: 1 });

                let headersOptions: any = wrapper.vm.manageHeaderLevels();

                expect(headersOptions).toEqual({ ...headerNormalOption, 'rte-h1 rte_h_level1': i18nTitle });
            });

        });

        describe(`when we want only a title and a subtitle`, () => {

            it(`then a title and a subtitle are available`, () => {
                wrapper.setProps({ firstHeaderLevel: 1, lastHeaderLevel: 2 });

                let headersOptions: any = wrapper.vm.manageHeaderLevels();

                expect(headersOptions).toEqual({ ...headerNormalOption, 'rte-h1 rte_h_level1': i18nTitle, 'rte-h2 rte_h_level2': i18nSubtitle });
            });

        });

        describe(`when we want multiple titles`, () => {

            it(`then multiple titles are available`, () => {
                wrapper.setProps({ firstHeaderLevel: 1, lastHeaderLevel: 3 });

                let headersOptions: any = wrapper.vm.manageHeaderLevels();

                expect(headersOptions).toEqual({ ...headerNormalOption, 'rte-h1 rte_h_level1': i18nTitleLevel, 'rte-h2 rte_h_level2': i18nTitleLevel, 'rte-h3 rte_h_level3': i18nTitleLevel });
            });

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
                    wrapper = shallowMount(MRichTextEditor, {
                        propsData: { scrollableContainer: '#container' }
                    });
                }).toThrow(richTextEditor.getSelectorErrorMsg('scrollable-container'));

                expect(() => {
                    wrapper = shallowMount(MRichTextEditor, {
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
