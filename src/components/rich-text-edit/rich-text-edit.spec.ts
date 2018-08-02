import { shallow, Wrapper } from '../../../node_modules/@vue/test-utils';
import Vue from '../../../node_modules/vue';
import { renderComponent } from '../../../tests/helpers/render';
import uuid from '../../utils/uuid/uuid';
import { MRichTextEdit, MRichTextEditMode } from './rich-text-edit';
import { MRichTextEditorStandardOptions } from './rich-text-edit-options';
import RichTextLicensePlugin from './rich-text-license-plugin';

jest.mock('../../utils/uuid/uuid');
(uuid.generate as jest.Mock).mockReturnValue('uuid');

const froalaLicenseKey: string = 'testKey';
let wrapper: Wrapper<MRichTextEdit>;
let richTextEditor: MRichTextEdit;
let defaultOptions: MRichTextEditorStandardOptions;

describe('MRichTextEdit', () => {
    beforeEach(() => {
        Vue.use(RichTextLicensePlugin, { key: froalaLicenseKey });
        wrapper = shallow(MRichTextEdit);
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
                mode: MRichTextEditMode.STANDARD
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
        it('internal options are customed defaultOptions', () => {
            const customOptions: any = { placeholderText: undefined, scrollableContainer: 'container', toolbarStickyOffset: 1 };

            wrapper.setProps({ scrollableContainer: 'container', toolbarStickyOffset: 1 });
            expect(richTextEditor.internalOptions).toEqual({ ...defaultOptions, ...customOptions });
        });
    });
});
