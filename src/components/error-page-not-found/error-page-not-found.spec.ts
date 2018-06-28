import { shallow, Wrapper } from '@vue/test-utils';

import { renderComponent } from '../../../tests/helpers/render';
import { Link } from '../error-template/error-template';
import { MErrorPageNotFound } from './error-page-not-found';

let wrapper: Wrapper<MErrorPageNotFound>;

const getStubs: any = () => {
    return {
        ['m-error-template']: '<div><slot /></div>',
    };
};

const initializeShallowWrapper: any = () => {
    wrapper = shallow(MErrorPageNotFound, {
        stubs: getStubs(),
        propsData: {
        }
    });
};

describe(`Page not found - test`, () => {
    describe(`Given default values`, () => {
        it(`Should render with default values`, async () => {
            wrapper = shallow(MErrorPageNotFound, { stubs: getStubs() });

            await expect(renderComponent(wrapper.vm)).resolves.toMatchSnapshot();
        });
    });
    describe(`Given custom values`, () => {
        it(`Should render with custom values provided`, async () => {
            const A_CUSTOM_TITLE: string = 'An error title.';
            const A_HINT: string = 'aHint';
            const A_LINK: Link = new Link('aLabel', 'anUrl');

            wrapper = shallow(MErrorPageNotFound, {
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
