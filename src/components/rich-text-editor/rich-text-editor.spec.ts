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
        wrapper = shallow(MRichTextEditor);
        richTextEditor = wrapper.vm;
        defaultOptions = new MRichTextEditorStandardOptions(froalaLicenseKey, richTextEditor.$i18n.currentLang());
    });

    it('should render correctly', () => {
        expect(renderComponent(richTextEditor)).resolves.toMatchSnapshot();
    });

    it('the key is stored', () => {
        expect(richTextEditor.froalaLicenseKey).toEqual(froalaLicenseKey);
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
            const customOptions: any = { placeholderText: undefined, scrollableContainer: undefined };
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
            const customOptions: any = { toolbarStickyOffset: 1 };

            wrapper.setProps({ toolbarStickyOffset: 1 });
            expect(richTextEditor.internalOptions).toEqual({ ...defaultOptions, ...customOptions });
        });
    });
});
