import { createLocalVue, mount, RefSelector, Wrapper } from '@vue/test-utils';
import Vue, { VueConstructor } from 'vue';
import { resetModulPlugins } from '../../../tests/helpers/component';
import { addMessages } from '../../../tests/helpers/lang';
import { renderComponent } from '../../../tests/helpers/render';
import I18nPlugin from '../../components/i18n/i18n';
import IconButtonPlugin from '../../components/icon-button/icon-button';
import LinkPlugin from '../../components/link/link';
import MediaQueriesPlugin from '../../utils/media-queries/media-queries';
import ModulPlugin from '../../utils/modul/modul';
import PagingPlugin, { MPaging } from './paging';

let wrapper: Wrapper<MPaging>;
let localVue: VueConstructor<Vue>;

let value: number = 1;
let nbOfItems: number;
let nbOfItemsPerPage: number;

const NB_OF_ITEMS_1PAGE: number = 10;
const NB_OF_ITEMS_PAGES: number = 50;
const NB_OF_ITEMS_PAGES_ELLIPSIS: number = 255;
const NB_OF_ITEMS_PER_PAGE: number = 5;

const PREVIOUS_REF: RefSelector = { ref: 'previous' };
const NEXT_REF: RefSelector = { ref: 'next' };


const initializeWrapper: () => any = () => {
    wrapper = mount(MPaging, {
        localVue: localVue,
        propsData: {
            value,
            nbOfItems,
            nbOfItemsPerPage
        }
    });
};

beforeEach(() => {
    wrapper = undefined as any;
});

describe('MPaging', () => {
    beforeEach(() => {
        resetModulPlugins();
        localVue = createLocalVue();
        localVue.use(ModulPlugin);
        Vue.use(PagingPlugin);
        Vue.use(I18nPlugin);
        Vue.use(IconButtonPlugin);
        Vue.use(LinkPlugin);
        Vue.use(MediaQueriesPlugin);

        addMessages(Vue, ['components/paging/paging.lang.fr.json']);
    });

    describe(`Given only 1 page of results`, () => {

        beforeEach(() => {
            nbOfItems = NB_OF_ITEMS_1PAGE;
            initializeWrapper();
        });

        it(`Then status should be display`, () => {
            expect(wrapper.vm.$refs.status).toBeTruthy();
            expect(wrapper.vm.$props.value).toEqual(1);
        });

        it(`Then should render correctly`, () => {
            expect(renderComponent(wrapper.vm)).resolves.toMatchSnapshot();
        });
    });

    describe(`Given enough items to have more than 1 page`, () => {

        beforeEach(() => {
            nbOfItems = NB_OF_ITEMS_PAGES;
            initializeWrapper();
        });

        it(`Then status should be display`, () => {
            expect(wrapper.vm.$refs.status).toBeTruthy();
            expect(wrapper.vm.$props.value).toEqual(1);
        });

        it(`Then navigation should be display`, () => {
            expect(wrapper.vm.$refs.navigation).toBeTruthy();
        });

        it(`Then 'previous' should be disabled and 'next' should be enable`, () => {
            const previousElement: Wrapper<Vue> = wrapper.find(PREVIOUS_REF);
            const nextElement: Wrapper<Vue> = wrapper.find(NEXT_REF);

            expect(previousElement.props().disabled).toBeTruthy();
            expect(nextElement.props().disabled).toBeFalsy();
        });

        it(`Then the pagination should have 3 pages`, () => {
            expect(wrapper.findAll('.m-paging__item').length).toEqual(3);
        });

        describe('click on next button', () => {
            it(`Should emit "add" event when clicked`, () => {
                const previousElement: Wrapper<Vue> = wrapper.find(PREVIOUS_REF);
                const nextElement: Wrapper<Vue> = wrapper.find(NEXT_REF);

                wrapper.find(NEXT_REF).trigger('click');
                expect(wrapper.emitted('change')).toBeTruthy();
            });
        });

        it(`Then should render correctly`, () => {
            expect(renderComponent(wrapper.vm)).resolves.toMatchSnapshot();
        });
    });

    describe(`Given showing less item per page`, () => {

        beforeEach(() => {
            nbOfItems = NB_OF_ITEMS_PAGES;
            nbOfItemsPerPage = NB_OF_ITEMS_PER_PAGE;
            initializeWrapper();
        });

        it(`Then the pagination should have more than 3 pages`, () => {
            expect(wrapper.findAll('.m-paging__item').length).toBeGreaterThan(3);
        });

        it(`Then should render correctly`, () => {
            expect(renderComponent(wrapper.vm)).resolves.toMatchSnapshot();
        });
    });

    describe(`Given a lot of pages`, () => {

        beforeEach(() => {
            nbOfItems = NB_OF_ITEMS_PAGES_ELLIPSIS;
            value = 5;
            initializeWrapper();
        });

        it(`Then the ellipsis should be displayed on both side`, () => {
            expect(wrapper.findAll('.m-paging__item--text').length).toEqual(3);
        });

        it(`Then should render correctly`, () => {
            expect(renderComponent(wrapper.vm)).resolves.toMatchSnapshot();
        });
    });
});
