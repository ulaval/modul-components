import { RefSelector, shallowMount, Wrapper } from '@vue/test-utils';

import { renderComponent } from '../../../tests/helpers/render';
import { FormatMode } from '../../utils/i18n/i18n';
import { MButtonSkin } from '../button/button';
import { SHOW_MORE_NAME } from '../component-names';
import { MShowMore } from './show-more';

let wrapper: Wrapper<MShowMore>;

const REF_COUNT_TOTAL: RefSelector = { ref: 'countTotal' };
const REF_PROGRESS: RefSelector = { ref: 'progress' };
const REF_BUTTON: RefSelector = { ref: 'button' };

const NB_VISIBLE: number = 10;
const NB_TOTAL: number = 50;

const initializeShallowWrapper: any = () => {
    wrapper = shallowMount(MShowMore);

    wrapper.vm.$i18n.translate = jest.fn((key: string) => key);
};

describe(SHOW_MORE_NAME, () => {
    describe(`Without nbTotal specified`, () => {
        it(`Should not render anything`, () => {
            initializeShallowWrapper();
            expect(renderComponent(wrapper.vm)).resolves.toMatchSnapshot();
        });
    });

    describe(`With nbTotal equals to 0`, () => {

        beforeEach(() => {
            initializeShallowWrapper();
            wrapper.setProps({ nbVisible: 0, nbTotal: -2 });
        });

        it(`Should not render anything`, () => {
            expect(renderComponent(wrapper.vm)).resolves.toMatchSnapshot();
        });

        it(`Should not be visible`, () => {
            expect(wrapper.vm.isVisible).toBeFalsy();
        });
    });

    describe(`With nbTotal inferior to 0`, () => {

        beforeEach(() => {
            initializeShallowWrapper();
            wrapper.setProps({ nbVisible: 0, nbTotal: -2 });
        });

        it(`Should not render anything`, () => {
            expect(renderComponent(wrapper.vm)).resolves.toMatchSnapshot();
        });

        it(`Should not be visible`, () => {
            expect(wrapper.vm.isVisible).toBeFalsy();
        });
    });

    describe(`Given nbVisible and nbTotal`, () => {
        beforeEach(() => {
            initializeShallowWrapper();
            wrapper.setProps({ nbVisible: NB_VISIBLE, nbTotal: NB_TOTAL });
        });

        it(`Should calculate pourcentage of visible elements`, () => {
            expect(wrapper.vm.visiblePourcentage).toBe(20);
        });

        it(`Should render a label with nbVisible and nbTotal`, () => {
            expect(wrapper.find(REF_COUNT_TOTAL).exists()).toBeTruthy();
            expect(wrapper.find(REF_COUNT_TOTAL).text()).toBe('m-show-more:status');
            expect(wrapper.vm.$i18n.translate).toHaveBeenCalledWith('m-show-more:status', { nbVisible: NB_VISIBLE, nbTotal: NB_TOTAL }, undefined, undefined, undefined, FormatMode.Sprintf);
        });

        it(`Should render a progress bar with value and border-radius props`, () => {
            expect(wrapper.find(REF_PROGRESS).exists()).toBeTruthy();
            expect(wrapper.find(REF_PROGRESS).attributes().value).toBe('20');
        });
    });

    describe(`Given nbVisible < nbTotal`, () => {
        beforeEach(() => {
            initializeShallowWrapper();
            wrapper.setProps({ nbVisible: NB_VISIBLE, nbTotal: NB_TOTAL });
        });

        it(`Should render correctly`, () => {
            expect(renderComponent(wrapper.vm)).resolves.toMatchSnapshot();
        });

        it(`Should be visible`, () => {
            expect(wrapper.vm.isVisible).toBeTruthy();
        });

        it(`Progress should be visible`, () => {
            expect(wrapper.vm.isProgressVisible).toBeTruthy();
        });

        it(`Should render a label with nbVisible and nbTotal`, () => {
            expect(wrapper.find(REF_COUNT_TOTAL).exists()).toBeTruthy();
            expect(wrapper.find(REF_COUNT_TOTAL).text()).toBe('m-show-more:status');
            expect(wrapper.vm.$i18n.translate).toHaveBeenCalledWith('m-show-more:status', { nbVisible: NB_VISIBLE, nbTotal: NB_TOTAL }, undefined, undefined, undefined, FormatMode.Sprintf);
        });

        it(`Should render a button`, () => {
            expect(wrapper.find(REF_BUTTON).exists()).toBeTruthy();
            expect(wrapper.find(REF_BUTTON).text()).toBe('m-show-more:button-label');
            expect(wrapper.find(REF_BUTTON).attributes().skin).toBe(MButtonSkin.Secondary);
        });

        describe(`When button is clicked`, () => {
            it(`Should emit a "click" event`, () => {
                wrapper.find(REF_BUTTON).trigger('click');

                expect(wrapper.emitted('click')).toBeTruthy();
            });

            it(`Should emit a "update:loading" event with a value of true`, () => {
                wrapper.find(REF_BUTTON).trigger('click');

                expect(wrapper.emitted('update:loading')[0]).toEqual([true]);
            });
        });

        describe(`When loading`, () => {
            it(`Should put button in waiting mode`, () => {
                wrapper.setProps({ loading: true });

                expect(wrapper.find(REF_BUTTON).attributes().waiting).toBe('true');
            });
        });
    });

    describe(`Given nbVisible == nbTotal`, () => {
        beforeEach(() => {
            initializeShallowWrapper();
            wrapper.setProps({ nbVisible: NB_TOTAL, nbTotal: NB_TOTAL });
        });

        it(`Progress should not be visible`, () => {
            expect(wrapper.vm.isProgressVisible).toBeFalsy();
        });

        it(`Should render correctly`, () => {
            expect(renderComponent(wrapper.vm)).resolves.toMatchSnapshot();
        });

        it(`Should not render a button`, () => {
            expect(wrapper.find(REF_BUTTON).exists()).toBeFalsy();
        });

        it(`Should not render a progress bar`, () => {
            expect(wrapper.find(REF_PROGRESS).exists()).toBeFalsy();
        });
    });
});
