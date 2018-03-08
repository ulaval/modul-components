import WrapperInlineEditionPlugin, { MWrapperInlineEdition } from './wrapper-inline-edition';
import Vue from 'vue';
import { Wrapper, mount } from '@vue/test-utils';
import I18nPlugin from '../../components/i18n/i18n';
import { ModulVue } from '../../utils/vue/vue';
import MediaQueriesPlugin from '../../utils/media-queries/media-queries';
import { addMessages } from '../../../tests/helpers/lang';

let propsData: { propsData: { editMode: boolean } };

let wrapperEditionInline: MWrapperInlineEdition;
let wrapper: Wrapper<ModulVue>;

const CANCEL_EVENT: string = 'cancel';
const CONFIRM_EVENT: string = 'confirm';

const READ_SLOT_CLASS: string = 'readSlot';
const READ_SLOT: string = '<div class="' + READ_SLOT_CLASS + '">readSlot</div>';
const EDIT_SLOT_CLASS: string = 'editSlot';
const EDIT_SLOT: string = '<input class="' + EDIT_SLOT_CLASS + '" type="text" name="inputEditMode" value="myInput">';

describe('Component wrapper-inline-edition - Element wrapper edition inline with default values', () => {

    beforeEach(() => {
        wrapperEditionInline = new MWrapperInlineEdition();
    });

    it(`must be in read mode by default`, () => {

        expect(wrapperEditionInline.editMode).toBeFalsy();
    });

    it('must use default value for dialog title',() => {

        expect(wrapperEditionInline.dialogTitle).toEqual(wrapperEditionInline.$i18n.translate('m-wrapper-inline-edition:newValue'));
    });

    describe('when defining title prop', () => {
        it('must use props value for dialog title',() => {
            let titleProp = 'myTitle';
            wrapperEditionInline.title = titleProp;

            expect(wrapperEditionInline.dialogTitle).toEqual(titleProp);
        });
    });
});

describe('Component wrapper-inline-edition - Element wrapper edition inline set to read mode', () => {

    beforeEach(() => {
        propsData = { propsData: { editMode: false } };
        wrapperEditionInline = new MWrapperInlineEdition(propsData);
        console.log('beforeTestComplete');
    });

    describe('when confirming', () => {
        test(`must not send events to parent`, () => {
            let spy = jest.spyOn(wrapperEditionInline, '$emit');

            wrapperEditionInline.confirm();

            expect(spy).not.toBeCalled();
        });
    });

    describe('when cancelling', () => {
        it(`must not send event to parent`, () => {
            let spy = jest.spyOn(wrapperEditionInline, '$emit');

            wrapperEditionInline.cancel();

            expect(spy).not.toBeCalled();
        });
    });
});

describe('Component wrapper-inline-edition - Element wrapper edition inline set to edit mode', () => {

    beforeEach(() => {
        propsData = { propsData: {  editMode: true } };
        wrapperEditionInline = new MWrapperInlineEdition(propsData);
    });

    describe('when confirming', () => {
        it(`must emit confirmation event to parent`, () => {
            let spy = jest.spyOn(wrapperEditionInline, '$emit');

            wrapperEditionInline.confirm();

            expect(spy).toBeCalledWith(CONFIRM_EVENT);
        });
    });

    describe('when cancelling', () => {
        it(`must not emit cancellation event to parent`, () => {
            let spy = jest.spyOn(wrapperEditionInline, '$emit');

            wrapperEditionInline.cancel();

            expect(spy).toBeCalledWith(CANCEL_EVENT);
        });
    });
});

describe('Component wrapper-edition-inline - Complete component by default', () => {

    beforeEach(() => {
        Vue.use(WrapperInlineEditionPlugin);

        addMessages(Vue, ['components/wrapper-inline-edition/wrapper-inline-edition.lang.en.json']);

        wrapper = mount(MWrapperInlineEdition, {
            localVue: Vue,
            slots: {
                default: 'default',
                editMode: EDIT_SLOT,
                readMode: READ_SLOT
            },
            mixins: [{
                data: function() {
                    return {
                        isMqMinS: true,
                        isMqMinM: false
                    };
                }
            }]
        });
    });

    describe('at creation', () => {
        it('must show readMode content', () => {
            let slotFound: Wrapper<Vue> = wrapper.find('.' + READ_SLOT_CLASS);
            expect(slotFound.is('div')).toBe(true);
        });
    });

    describe('when in editMode', () => {
        beforeEach(() => {
            wrapper.setProps({ editMode: 'true' });
        });

        it('must show editMode content', () => {
            let slotFound: Wrapper<Vue> = wrapper.find('.' + EDIT_SLOT_CLASS);
            expect(slotFound.is('input')).toBe(true);
        });
        describe('when clicking on the confirm button',() => {
            it('should emit cancel event', () => {

                wrapper.find({ ref : 'confirm-control' }).trigger('click');

                expect(wrapper.emitted(CONFIRM_EVENT)).toBeTruthy();
            });
        });

        describe('when clicking on the cancel button',() => {
            it('should emit cancel event', () => {

                wrapper.find({ ref : 'cancel-control' }).trigger('click');

                expect(wrapper.emitted(CANCEL_EVENT)).toBeTruthy();
            });
        });
    });
});

describe('Component wrapper-edition-inline - Complete component mobile', () => {
    let wrapper: Wrapper<ModulVue>;

    beforeEach(() => {
        Vue.use(WrapperInlineEditionPlugin);

        addMessages(Vue, ['components/wrapper-inline-edition/wrapper-inline-edition.lang.en.json']);

        wrapper = mount(MWrapperInlineEdition, {
            localVue: Vue,
            slots: {
                default: 'default',
                editMode: EDIT_SLOT,
                readMode: READ_SLOT
            },
            mixins: [{
                data: function() {
                    return {
                        isMqMinS: false
                    };
                }
            }]
        });
    });
    describe('at creation', () => {
        it('must show readMode content', () => {
            let slotFound: Wrapper<Vue> = wrapper.find('.' + READ_SLOT_CLASS);
            expect(slotFound.is('div')).toBe(true);
        });
    });

    describe('when in editMode', () => {
        beforeEach(() => {
            wrapper.setProps({ editMode: 'true' });
        });
        it('must show mobile confirm controls', () => {
            let controlFound: Wrapper<Vue> = wrapper.find({ ref : 'confirm-control-mobile' });
            expect(controlFound.is('button')).toBe(true);
        });
        it('must show mobile cancel controls', () => {
            let controlFound: Wrapper<Vue> = wrapper.find({ ref : 'cancel-control-mobile' });
            expect(controlFound.is('button')).toBe(true);
        });
    });
});
