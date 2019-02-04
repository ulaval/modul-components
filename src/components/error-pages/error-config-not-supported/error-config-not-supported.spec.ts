import { shallowMount, Wrapper } from '@vue/test-utils';
import { renderComponent } from '../../../../tests/helpers/render';
import { MESSAGE_PAGE_NAME } from '../../component-names';
import { MErrorConfigNotSupported } from './error-config-not-supported';


let wrapper: Wrapper<MErrorConfigNotSupported>;

const getStubs: any = () => {
    return {
        [MESSAGE_PAGE_NAME]: '<div><slot /></div>'
    };
};

describe(`Configuration not supported- test`, () => {
    describe(`Given default values`, () => {
        it(`Should render with default values`, async () => {
            wrapper = shallowMount(MErrorConfigNotSupported, { stubs: getStubs() });

            await expect(renderComponent(wrapper.vm)).resolves.toMatchSnapshot();
        });
    });
    describe(`Given custom values`, () => {
        it(`Should render with custom values provided`, async () => {
            const A_CUSTOM_TITLE: string = 'An error title.';
            const A_HINT: string = 'aHint';

            wrapper = shallowMount(MErrorConfigNotSupported, {
                stubs: getStubs(),
                propsData: {
                    title: A_CUSTOM_TITLE,
                    hints: [A_HINT]
                }
            });

            await expect(renderComponent(wrapper.vm)).resolves.toMatchSnapshot();
        });
    });
});
