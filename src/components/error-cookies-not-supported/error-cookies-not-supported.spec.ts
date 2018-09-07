import { shallow, Wrapper } from '@vue/test-utils';

import { renderComponent } from '../../../tests/helpers/render';
import { PAGE_MESSAGE_NAME } from '../component-names';
import { Link } from '../page-message/page-message';
import { MErrorCookiesNotSupported } from './error-cookies-not-supported';

let wrapper: Wrapper<MErrorCookiesNotSupported>;

const getStubs: any = () => {
    return {
        [PAGE_MESSAGE_NAME]: '<div><slot /></div>'
    };
};

describe(`Cookies not supported - test`, () => {
    describe(`Given default values`, () => {
        it(`Should render with default values`, async () => {
            wrapper = shallow(MErrorCookiesNotSupported, { stubs: getStubs() });

            await expect(renderComponent(wrapper.vm)).resolves.toMatchSnapshot();
        });
    });
    describe(`Given custom values`, () => {
        it(`Should render with custom values provided`, async () => {
            const A_CUSTOM_TITLE: string = 'An error title.';
            const A_HINT: string = 'aHint';
            const A_LINK: Link = new Link('aLabel', 'anUrl');

            wrapper = shallow(MErrorCookiesNotSupported, {
                stubs: getStubs(),
                propsData: {
                    title: A_CUSTOM_TITLE,
                    hints: [A_HINT],
                    links: [A_LINK]
                }
            });

            await expect(renderComponent(wrapper.vm)).resolves.toMatchSnapshot();
        });
    });
});
