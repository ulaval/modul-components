import { shallow, Wrapper } from '@vue/test-utils';

import { renderComponent } from '../../../tests/helpers/render';
import { MESSAGE_PAGE_NAME } from '../component-names';
import { Link } from '../message-page/message-page';
import { MErrorBrowserNotSupported } from './error-browser-not-supported';

let wrapper: Wrapper<MErrorBrowserNotSupported>;
let isMobileDevice: boolean;
const A_CUSTOM_TITLE: string = 'An error title.';
const A_HINT: string = 'aHint';
const A_HINT_MOBILE: string = 'aHint-Mobile';
const A_LINK: Link = new Link('aLabel', 'anUrl');
const A_LINK_MOBILE: Link = new Link('aLabel-Mobile', 'anUrl');

const getStubs: any = () => {
    return {
        [MESSAGE_PAGE_NAME]: '<div><slot /></div>'
    };
};

const initializeWrapperDefaultValues: () => void = (): void => {
    wrapper = shallow(MErrorBrowserNotSupported, {
        mocks: { $mq: { state: { isMqMinS: isMobileDevice ? false : true } } },
        stubs: getStubs()
    });
};

const initializeWrapperCustomValues: () => void = (): void => {
    wrapper = shallow(MErrorBrowserNotSupported, {
        mocks: { $mq: { state: { isMqMinS: isMobileDevice ? false : true } } },
        stubs: getStubs(),
        propsData: {
            title: A_CUSTOM_TITLE,
            hintsDesktop: [A_HINT],
            hintsMobile: [A_HINT_MOBILE],
            linksDesktop: [A_LINK],
            linksMobile: [A_LINK_MOBILE]
        }]
    });
};

beforeEach(() => {
    isMobileDevice = false;
});
describe(`Browser not supported - test`, () => {
    describe('Given desktop mode', () => {
        describe(`Given default values`, () => {
            beforeEach(() => {
                initializeWrapperDefaultValues();
            });
            it(`Should render with default desktop values`, async () => {
                await expect(renderComponent(wrapper.vm)).resolves.toMatchSnapshot();
            });
        });
        describe(`Given custom values`, () => {
            beforeEach(() => {
                initializeWrapperCustomValues();
            });

            it(`Should render with custom values provided`, async () => {
                await expect(renderComponent(wrapper.vm)).resolves.toMatchSnapshot();
            });
        });
    });

    describe(`Given mobile device size`, () => {
        beforeEach(() => {
            isMobileDevice = true;
        });
        describe(`Given default values`, () => {
            beforeEach(() => {
                initializeWrapperDefaultValues();
            });
            it(`Should render with default mobile values provided`, async () => {
                await expect(renderComponent(wrapper.vm)).resolves.toMatchSnapshot();
            });
        });
        describe(`Given custom values`, () => {
            beforeEach(() => {
                initializeWrapperCustomValues();
            });
            it(`Should render with custom mobile values provided`, async () => {
                await expect(renderComponent(wrapper.vm)).resolves.toMatchSnapshot();
            });
        });
    });
});
