import { mount, shallow, Wrapper } from '@vue/test-utils';
import Vue from 'vue';

import { addMessages } from '../../../tests/helpers/lang';
import { renderComponent } from '../../../tests/helpers/render';
import MediaQueriesPlugin from '../../utils/media-queries/media-queries';
import { ModulVue } from '../../utils/vue/vue';
import InplaceEditPlugin, { MInplaceEdit } from './inplace-edit';

let propsData: { propsData: { editMode: boolean } };

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

    it('must use default value for modal title',() => {

        expect(inplaceEdit.title).toEqual(inplaceEdit.$i18n.translate('m-inplace-edit:modify'));
    });

    describe('when defining title prop', () => {
        it('must use props value for modal title',() => {
            let titleProp: string = 'myTitle';
            inplaceEdit.title = titleProp;

            expect(inplaceEdit.title).toEqual(titleProp);
        });
    });
});

describe('Component inplace-edit - Element wrapper edition inline set to read mode', () => {

    beforeEach(() => {
        Vue.use(MediaQueriesPlugin);
        propsData = { propsData: { editMode: false } };
        inplaceEdit = new MInplaceEdit(propsData);
    });

    describe('when confirming', () => {
        test(`must not send events to parent`, () => {
            let spy: jest.SpyInstance = jest.spyOn(inplaceEdit, '$emit');

            inplaceEdit.confirm(AN_EVENT);

            expect(spy).not.toBeCalled();
        });
    });

    describe('when cancelling', () => {
        it(`must not send event to parent`, () => {
            let spy: jest.SpyInstance = jest.spyOn(inplaceEdit, '$emit');

            inplaceEdit.cancel(AN_EVENT);

            expect(spy).not.toBeCalled();
        });
    });
});

describe('Component inplace-edit - Element wrapper edition inline set to edit mode', () => {
    describe('and valide input',() => {

        beforeEach(() => {
            Vue.use(MediaQueriesPlugin);
            propsData = { propsData: {  editMode: true } };
            inplaceEdit = new MInplaceEdit(propsData);
        });

        describe('when confirming', () => {
            it(`must emit confirmation event to parent`, () => {
                let spy: jest.SpyInstance = jest.spyOn(inplaceEdit, '$emit');

                inplaceEdit.confirm(AN_EVENT);

                expect(spy).toHaveBeenCalledWith(CONFIRM_EVENT);
            });
        });

        describe('when cancelling', () => {
            it(`must emit cancellation event to parent`, () => {
                let spy: jest.SpyInstance = jest.spyOn(inplaceEdit, '$emit');

                inplaceEdit.cancel(AN_EVENT);

                expect(spy).toBeCalledWith(CANCEL_EVENT);
            });
        });
    });

    describe('and invalide input',() => {

        beforeEach(() => {
            Vue.use(MediaQueriesPlugin);
            propsData = { propsData: {  editMode: true } };
            inplaceEdit = new MInplaceEdit(propsData);
        });

        describe('when confirming', () => {
            it(`must emit confirmation event to parent`, () => {
                let spy: jest.SpyInstance = jest.spyOn(inplaceEdit, '$emit');

                inplaceEdit.confirm(AN_EVENT);

                expect(spy).toBeCalledWith(CONFIRM_EVENT);
            });
        });

        describe('when cancelling after a failed confirmation', () => {
            it('must not be in error', async () => {
                await inplaceEdit.confirm(AN_EVENT);

                inplaceEdit.cancel(AN_EVENT);

                expect(inplaceEdit.error).toBeFalsy();
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
            mocks: { $mq: { state: { isMqMinS: true, isMqMinM: false } } },
            slots: {
                default: 'default',
                editMode: EDIT_SLOT,
                readMode: READ_SLOT
            }
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

        wrapper = shallow(MInplaceEdit, {
            localVue: Vue,
            mocks: { $mq: { state: { isMqMinS: false } } },
            slots: {
                default: 'default',
                editMode: EDIT_SLOT,
                readMode: READ_SLOT
            },
            stubs: {
                'm-modal': '<div><slot></slot></div>'
            }
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
        it('should render correctly', () => {
            return expect(renderComponent(wrapper.vm)).resolves.toMatchSnapshot();
        });
        it('should render correctly in waiting mode', () => {
            wrapper.setProps({ waiting: 'true' });
            return expect(renderComponent(wrapper.vm)).resolves.toMatchSnapshot();
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
