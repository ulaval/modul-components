import { mount, shallowMount, Wrapper, WrapperArray } from '@vue/test-utils';
import Vue from 'vue';
import { renderComponent } from '../../../tests/helpers/render';
import { ICON_NAME, LINK_NAME } from '../component-names';
import { MMessageState } from '../message/message';
import { Link, MMessagePage } from './message-page';


let wrapper: Wrapper<MMessagePage>;

const A_VALID_STATE: string = MMessageState.Error;
const A_VALID_ICON_NAME: string = 'iconName';
const A_VALID_TITLE: string = 'An error title.';
const FIRST_HINT_CONTENT: string = 'a hint';
const SECOND_HINT_CONTENT: string = 'another hint';
const ONE_HINT_LIST: string[] = [FIRST_HINT_CONTENT];
const MANY_HINTS_LIST: string[] = [FIRST_HINT_CONTENT, SECOND_HINT_CONTENT];
const DEFAULT_SLOT_ID: string = 'theSlotId';

const FIRST_LINK_CONTENT: Link = new Link('a link', 'an Url');
const SECOND_LINK_CONTENT: Link = new Link('another link', 'another Url');
const ONE_LINK_LIST: Link[] = [FIRST_LINK_CONTENT];
const MANY_LINKS_LIST: Link[] = [FIRST_LINK_CONTENT, SECOND_LINK_CONTENT];

let hints: string[];
let links: Link[];
let slots: {};
let state: string;

const getStubs: any = () => {
    return {
        [LINK_NAME]: '<a @click="$emit(\'click\')"><slot /></a>',
        [ICON_NAME]: '<span>Icone : {{ $attrs["name"] }}</span>'
    };
};

const initializeShallowWrapper: any = () => {
    wrapper = shallowMount(MMessagePage, {
        stubs: getStubs(),
        propsData: {
            state: state,
            iconName: A_VALID_ICON_NAME,
            title: A_VALID_TITLE,
            hints: hints,
            links: links
        },
        slots: slots
    });
};

beforeEach(() => {
    hints = [];
    links = [];
    state = A_VALID_STATE;
});

describe(`message-page fonctionnality tests`, () => {

    describe(`Given state information`, () => {
        it(`Then  class m--is-state-information present`, () => {
            state = MMessageState.Information;
            initializeShallowWrapper();

            expect(wrapper.find('.m--is-state-information').exists()).toBeTruthy();
        });
    });

    describe(`Given state error`, () => {
        it(`Then  class m--is-state-error present`, () => {
            state = MMessageState.Error;
            initializeShallowWrapper();

            expect(wrapper.find('.m--is-state-error').exists()).toBeTruthy();
        });
    });

    describe(`Given state warning`, () => {
        it(`Then class m--is-state-warning present`, () => {
            state = MMessageState.Warning;
            initializeShallowWrapper();

            expect(wrapper.find('.m--is-state-warning').exists()).toBeTruthy();
        });
    });

    describe(`Given an hint`, () => {
        describe(`When rendering`, () => {
            it(`Then should display one hint with proper content`, () => {
                hints = ONE_HINT_LIST;
                initializeShallowWrapper();

                let hintWrapper: Wrapper<Vue> = wrapper.find({ ref: 'hint' });

                expect(hintWrapper.element.innerHTML).toEqual(FIRST_HINT_CONTENT);
            });
        });
    });

    describe(`Given many hints`, () => {
        describe(`When rendering`, () => {
            it(`Then should display each hint content`, () => {
                hints = MANY_HINTS_LIST;
                initializeShallowWrapper();

                let hintsWrapper: WrapperArray<Vue> = wrapper.findAll({ ref: 'hint' });

                expect(hintsWrapper.wrappers[0].element.innerHTML).toEqual(FIRST_HINT_CONTENT);
                expect(hintsWrapper.wrappers[1].element.innerHTML).toEqual(SECOND_HINT_CONTENT);
            });
        });
    });

    describe(`Given a link`, () => {
        describe(`When rendering`, () => {
            it(`Then should display one link with proper content`, () => {
                links = ONE_LINK_LIST;
                initializeShallowWrapper();

                let linkWrapper: Wrapper<Vue> = wrapper.find({ ref: 'link' });

                expect(linkWrapper.element.innerHTML).toContain(FIRST_LINK_CONTENT.label);
                expect(linkWrapper.element.innerHTML).toContain(FIRST_LINK_CONTENT.url);
            });
        });
    });

    describe(`Given many links`, () => {
        describe(`When rendering`, () => {
            it(`Then should display each link content`, () => {
                links = MANY_LINKS_LIST;
                initializeShallowWrapper();

                let linksHTML: WrapperArray<Vue> = wrapper.findAll({ ref: 'link' });

                expect(linksHTML.wrappers[0].element.innerHTML).toContain(FIRST_LINK_CONTENT.label);
                expect(linksHTML.wrappers[0].element.innerHTML).toContain(FIRST_LINK_CONTENT.url);
                expect(linksHTML.wrappers[1].element.innerHTML).toContain(SECOND_LINK_CONTENT.label);
                expect(linksHTML.wrappers[1].element.innerHTML).toContain(SECOND_LINK_CONTENT.url);
            });
        });
    });

    describe(`Given content for the default slot`, () => {
        describe(`When rendering`, () => {
            it(`Then should display the slot content`, () => {
                slots = {
                    default: '<div id="' + DEFAULT_SLOT_ID + '">The slot content</div>'
                };
                initializeShallowWrapper();

                expect(wrapper.find('#' + DEFAULT_SLOT_ID).exists()).toBeTruthy();
            });
        });
    });
});

describe(`message-page integration tests`, () => {
    describe(`Given an error with all props and slots initialized`, () => {
        it(`Then should render properly`, async () => {
            wrapper = mount(MMessagePage, {
                stubs: getStubs(),
                propsData: {
                    state: MMessageState.Warning,
                    iconName: A_VALID_ICON_NAME,
                    title: A_VALID_TITLE,
                    hints: MANY_HINTS_LIST,
                    links: MANY_LINKS_LIST
                },
                slots: {
                    default: '<div id="' + DEFAULT_SLOT_ID + '">The slot content</div>'
                }
            });

            await expect(renderComponent(wrapper.vm)).resolves.toMatchSnapshot();
        });
    });
});
