import { RefSelector, shallowMount, Wrapper } from '@vue/test-utils';
import Vue from 'vue';
import { addMessages } from '../../../tests/helpers/lang';
import { BUTTON_NAME, LINK_NAME } from './../component-names';
import RepeaterPlugin, { MRepeater, MRepeaterItem } from './repeater';

const REF_ADD_BTN: RefSelector = { ref: 'addBtn' };
const REF_DELETE_BTN: RefSelector = { ref: 'deleteBtn' };

let wrapper: Wrapper<MRepeater>;

let listProp: MRepeaterItem[] = [];

const initializeWrapper: () => Wrapper<MRepeater> = () => {
    wrapper = shallowMount(MRepeater, {
        propsData: {
            list: listProp
        },
        scopedSlots: {
            item: `<div slot-scope="{}"></div>`
        },
        stubs: {
            [BUTTON_NAME]: true,
            [LINK_NAME]: true
        }
    });
    return wrapper;
};

beforeEach(() => {
    Vue.use(RepeaterPlugin);
    wrapper = undefined!;
    listProp = [];
    addMessages(Vue, [
        'components/repeater/repeater.lang.en.json'
    ]);
});

it(`should emit add when clicking the add button`, () => {
    initializeWrapper();

    wrapper.find(REF_ADD_BTN).vm.$emit('click');

    expect(wrapper.emitted('add')[0]).toBeDefined();
});

describe('given a list of 1 item', () => {
    beforeEach(() => {
        listProp = ['a'];
    });

    it(`should emit delete when clicking the delete button`, () => {
        initializeWrapper();

        wrapper.find({ ref: REF_DELETE_BTN.ref + '0' }).vm.$emit('click');

        expect(wrapper.emitted('delete')[0]).toBeDefined();
        expect(wrapper.emitted('delete')[0][0]).toBe(0);
    });
});

describe('given a list of several items', () => {
    beforeEach(() => {
        listProp = ['a', 'b', 'c', 'd'];
    });

    it(`should emit delete when clicking the delete button`, () => {
        initializeWrapper();

        wrapper.find({ ref: REF_DELETE_BTN.ref + (listProp.length - 1).toString() }).vm.$emit('click');
        expect(wrapper.emitted('delete')[0][0]).toBe(listProp.length - 1);
    });
});
