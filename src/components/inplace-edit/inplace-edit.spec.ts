import { mount, Wrapper } from '@vue/test-utils';
import Vue from 'vue';

import { addMessages } from '../../../tests/helpers/lang';
import { renderComponent } from '../../../tests/helpers/render';

import I18nPlugin from '../../components/i18n/i18n';
import { ModulVue } from '../../utils/vue/vue';
import MediaQueriesPlugin from '../../utils/media-queries/media-queries';

import InplaceEditPlugin, { MInplaceEdit } from './inplace-edit';

let propsData: { propsData: { editMode: boolean, saveFn: () => Promise<void> } };

let inplaceEdit: MInplaceEdit;
let wrapper: Wrapper<ModulVue>;

const CANCEL_EVENT: string = 'cancel';
const CONFIRM_EVENT: string = 'ok';

const READ_SLOT_CLASS: string = 'readSlot';
const READ_SLOT: string = '<div class="' + READ_SLOT_CLASS + '">readSlot</div>';
const EDIT_SLOT_CLASS: string = 'editSlot';
const EDIT_SLOT: string = '<input class="' + EDIT_SLOT_CLASS + '" type="text" name="inputEditMode" value="myInput">';

const AN_EVENT: Event = new Event('An event');

describe('Component inplace-edit - Element wrapper edition inline with default values', () => {

    beforeEach(() => {
        Vue.use(MediaQueriesPlugin);
        Vue.use(InplaceEditPlugin);
        inplaceEdit = new MInplaceEdit();
    });

    it(`must be in read mode by default`, () => {

        expect(inplaceEdit.editMode).toBeFalsy();
    });

    it('must use default value for dialog title',() => {

        expect(inplaceEdit.dialogTitle).toEqual(inplaceEdit.$i18n.translate('m-inplace-edit:modify'));
    });

    describe('when defining title prop', () => {
        it('must use props value for dialog title',() => {
            let titleProp = 'myTitle';
            inplaceEdit.title = titleProp;

            expect(inplaceEdit.dialogTitle).toEqual(titleProp);
        });
    });
});

describe('Component inplace-edit - Element wrapper edition inline set to read mode', () => {

    beforeEach(() => {
        Vue.use(MediaQueriesPlugin);
        propsData = { propsData: { editMode: false, saveFn: () => { return Promise.resolve(); } } };
        inplaceEdit = new MInplaceEdit(propsData);
    });

    describe('when confirming', () => {
        test(`must not send events to parent`, () => {
            let spy = jest.spyOn(inplaceEdit, '$emit');

            inplaceEdit.confirm(AN_EVENT);

            expect(spy).not.toBeCalled();
        });
    });

    describe('when cancelling', () => {
        it(`must not send event to parent`, () => {
            let spy = jest.spyOn(inplaceEdit, '$emit');

            inplaceEdit.cancel(AN_EVENT);

            expect(spy).not.toBeCalled();
        });
    });
});

describe('Component inplace-edit - Element wrapper edition inline set to edit mode', () => {
    describe('and valide input',() => {

        beforeEach(() => {
            Vue.use(MediaQueriesPlugin);
            propsData = { propsData: {  editMode: true, saveFn: () => { return Promise.resolve(); } } };
            inplaceEdit = new MInplaceEdit(propsData);
        });

        describe('when confirming', () => {
            it(`must emit confirmation event to parent`, () => {
                let spy = jest.spyOn(inplaceEdit, '$emit');

                inplaceEdit.confirm(AN_EVENT);

                expect(spy).toHaveBeenCalledWith(CONFIRM_EVENT);
            });

            it(`must go back to readMode`, async () => {
                let spy = jest.spyOn(inplaceEdit, '$emit');

                await inplaceEdit.confirm(AN_EVENT);

                expect(spy).toHaveBeenCalledWith('update:editMode', false);
            });
        });

        describe('when cancelling', () => {
            it(`must emit cancellation event to parent`, () => {
                let spy = jest.spyOn(inplaceEdit, '$emit');

                inplaceEdit.cancel(AN_EVENT);

                expect(spy).toBeCalledWith(CANCEL_EVENT);
            });
            it(`must go back to readMode`, async () => {
                let spy = jest.spyOn(inplaceEdit, '$emit');

                await inplaceEdit.confirm(AN_EVENT);

                expect(spy).toHaveBeenCalledWith('update:editMode', false);
            });
        });
    });

    describe('and invalide input',() => {

        beforeEach(() => {
            Vue.use(MediaQueriesPlugin);
            propsData = { propsData: {  editMode: true, saveFn: () => { return Promise.reject('some reason'); } } };
            inplaceEdit = new MInplaceEdit(propsData);
        });

        describe('when confirming', () => {
            it(`must emit confirmation event to parent`, () => {
                let spy = jest.spyOn(inplaceEdit, '$emit');

                inplaceEdit.confirm(AN_EVENT);

                expect(spy).toBeCalledWith(CONFIRM_EVENT);
            });

            it(`must not go back to readMode`, async () => {
                let spy = jest.spyOn(inplaceEdit, '$emit');

                await inplaceEdit.confirm(AN_EVENT);

                expect(spy).not.toHaveBeenCalledWith('update:editMode', false);
            });

            it('must be in error', async () => {

                await inplaceEdit.confirm(AN_EVENT);

                expect(inplaceEdit.isError).toBeTruthy();
            });
        });

        describe('when cancelling after a failed confirmation', () => {
            it('must not be in error', async () => {
                await inplaceEdit.confirm(AN_EVENT);

                inplaceEdit.cancel(AN_EVENT);

                expect(inplaceEdit.isError).toBeFalsy();
            });
        });
    });
});

describe('Component inplace-edit - Complete component by default', () => {

    beforeEach(() => {
        Vue.use(MediaQueriesPlugin);
        Vue.use(InplaceEditPlugin);

        addMessages(Vue, ['components/inplace-edit/inplace-edit.lang.en.json']);

        wrapper = mount(MInplaceEdit, {
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
            it('should emit confirm event', () => {

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

describe('Component inplace-edit - Complete component mobile', () => {
    let wrapper: Wrapper<ModulVue>;

    beforeEach(() => {
        Vue.use(MediaQueriesPlugin);
        Vue.use(InplaceEditPlugin);

        addMessages(Vue, ['components/inplace-edit/inplace-edit.lang.en.json']);

        wrapper = mount(MInplaceEdit, {
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
