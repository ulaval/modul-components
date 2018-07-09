import { mount, shallow, Wrapper, WrapperArray } from '@vue/test-utils';
import Vue from 'vue';

import { renderComponent } from '../../../tests/helpers/render';
import ErrorTemplatePlugin, { Link, MErrorTemplate, MErrorTemplateSkin } from './error-template';

let wrapper: Wrapper<MErrorTemplate>;

const A_VALID_SKIN: string = MErrorTemplateSkin.Error;
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
let skin: string;

const getStubs: any = () => {
    return {
        ['m-link']: '<a @click="$emit(\'click\')"><slot /></a>',
        ['m-icon']: '<span>Icone : {{ $attrs["name"] }}</span>'
    };
};

const initializeShallowWrapper: any = () => {
    wrapper = shallow(MErrorTemplate, {
        stubs: getStubs(),
        propsData: {
            skin: skin,
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
    skin = A_VALID_SKIN;
});

describe(`Error-template fonctionnality tests`, () => {

    describe(`Given skin information`, () => {
        it(`Then  class m--is-skin-information present`, () => {
            skin = MErrorTemplateSkin.Information;
            initializeShallowWrapper();

            expect(wrapper.find('.m--is-skin-information').exists()).toBeTruthy();
        });
    });

    describe(`Given skin red`, () => {
        it(`Then  class m--is-skin-error present`, () => {
            skin = MErrorTemplateSkin.Error;
            initializeShallowWrapper();

            expect(wrapper.find('.m--is-skin-error').exists()).toBeTruthy();
        });
    });

    describe(`Given skin yellow`, () => {
        it(`Then class m--is-skin-warning present`, () => {
            skin = MErrorTemplateSkin.Warning;
            initializeShallowWrapper();

            expect(wrapper.find('.m--is-skin-warning').exists()).toBeTruthy();
        });
    });

    describe(`Given on hint`, () => {
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

    describe(`Given on link`, () => {
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

describe(`Error-template integration tests`, () => {
    describe(`Given an error with all props and slots initialized`, () => {
        it(`Then should render properly`, async () => {
            wrapper = mount(MErrorTemplate, {
                stubs: getStubs(),
                propsData: {
                    skin: MErrorTemplateSkin.Warning,
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
