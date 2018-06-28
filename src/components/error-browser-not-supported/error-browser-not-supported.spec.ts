import { shallow, Wrapper } from '@vue/test-utils';

import { renderComponent } from '../../../tests/helpers/render';
import { ERROR_TEMPLATE_NAME } from '../component-names';
import { MErrorBrowserNotSupported } from './error-browser-not-supported';

let wrapper: Wrapper<MErrorBrowserNotSupported>;

const getStubs: any = () => {
    return {
        [ERROR_TEMPLATE_NAME]: '<div><slot /></div>'
    };
};

describe(`Page not found - test`, () => {
    describe(`Given default values`, () => {
        it(`Should render with default values`, async () => {
            wrapper = shallow(MErrorBrowserNotSupported, { stubs: getStubs() });

            await expect(renderComponent(wrapper.vm)).resolves.toMatchSnapshot();
        });
    });
    describe(`Given custom values`, () => {
        it(`Should render with custom values provided`, async () => {
            const A_CUSTOM_TITLE: string = 'An error title.';
            const A_HINT: string = 'aHint';

            wrapper = shallow(MErrorBrowserNotSupported, {
                stubs: getStubs(),
                propsData: {
                    title: A_CUSTOM_TITLE,
                    hints: [A_HINT]
                }
            });

            await expect(renderComponent(wrapper.vm)).resolves.toMatchSnapshot();
        });
    });
    describe(`Mode mobile`, () => {
        xit(``, async () => {

            // ajouter tests
        });
    });
});
