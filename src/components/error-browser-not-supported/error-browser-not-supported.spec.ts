import { shallow, Wrapper } from '@vue/test-utils';

import { renderComponent } from '../../../tests/helpers/render';
import { ERROR_TEMPLATE_NAME } from '../component-names';
import { Link } from '../error-template/error-template';
import { MErrorBrowserNotSupported } from './error-browser-not-supported';

let wrapper: Wrapper<MErrorBrowserNotSupported>;
let isMobileDevice: boolean;
const A_CUSTOM_TITLE: string = 'An error title.';
const A_HINT: string = 'aHint';
const A_LINK: Link = new Link('aLabel', 'anUrl');

const getStubs: any = () => {
    return {
        [ERROR_TEMPLATE_NAME]: '<div><slot /></div>'
    };
};

const getMocks: any = () => {
    return {
        $mq: {
            register: jest.fn()
        }
    };
};
const initializeWrapperDefaultValues: () => void = (): void => {
    wrapper = shallow(MErrorBrowserNotSupported, {
        mocks: getMocks(),
        stubs: getStubs(),
        mixins: [{
            data: function(): any {
                return {
                    isMqMinS: isMobileDevice ? false : true
                };
            }
        }]
    });
};

const initializeWrapperCustomValues: () => void = (): void => {
    wrapper = shallow(MErrorBrowserNotSupported, {
        stubs: getStubs(),
        mocks: getMocks(),
        propsData: {
            title: A_CUSTOM_TITLE,
            hints: [A_HINT],
            links: [A_LINK]
        },
        mixins: [{
            data: function(): any {
                return {
                    isMqMinS: isMobileDevice ? false : true
                };
            }
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
            describe(`When getting hints`, () => {
                it(`Should return desktop hints`, () => {

                    let hints: string[] = wrapper.vm.mqAwareHints;

                    expect(hints).toHaveLength(1);
                    expect(hints[0]).toEqual('m-error-browser-not-supported:hint.primary.desktop');
                });
            });
            describe(`When getting links`, () => {
                it(`Should return desktop links`, () => {
                    let links: Link[] = wrapper.vm.mqAwareLinks;

                    expect(links).toHaveLength(1);
                    expect(links[0].label).toEqual('m-error-browser-not-supported:update-browser.desktop');
                    expect(links[0].url).toEqual('http://outdatedbrowser.com/fr');
                });
            });
            it(`Should render with default values`, async () => {
                await expect(renderComponent(wrapper.vm)).resolves.toMatchSnapshot();
            });
        });
        describe(`Given custom values`, () => {
            beforeEach(() => {
                initializeWrapperCustomValues();
            });
            describe(`When getting hints`, () => {
                it(`Should return specified hints`, () => {
                    let hints: string[] = wrapper.vm.mqAwareHints;

                    expect(hints).toHaveLength(1);
                    expect(hints[0]).toEqual(A_HINT);
                });
            });
            describe(`When getting links`, () => {
                it(`Should return specified links`, () => {
                    let links: Link[] = wrapper.vm.mqAwareLinks;

                    expect(links).toHaveLength(1);
                    expect(links[0]).toEqual(A_LINK);
                });
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
            describe(`When getting hints`, () => {
                it(`Should return mobile hints`, () => {

                    let hints: string[] = wrapper.vm.mqAwareHints;

                    expect(hints).toHaveLength(1);
                    expect(hints[0]).toEqual('m-error-browser-not-supported:hint.primary.mobile');
                });
            });
            describe(`When getting links`, () => {
                it(`Should return no links`, () => {
                    let links: Link[] = wrapper.vm.mqAwareLinks;

                    expect(links).toHaveLength(0);
                });
            });
        });
        describe(`Given custom values`, () => {
            beforeEach(() => {
                initializeWrapperCustomValues();
            });
            describe(`When getting hints`, () => {
                it(`Should return specified hints`, () => {
                    let hints: string[] = wrapper.vm.mqAwareHints;

                    expect(hints).toHaveLength(1);
                    expect(hints[0]).toEqual(A_HINT);
                });
            });
            describe(`When getting links`, () => {
                it(`Should return specified links`, () => {
                    let links: Link[] = wrapper.vm.mqAwareLinks;

                    expect(links).toHaveLength(1);
                    expect(links[0]).toEqual(A_LINK);
                });
            });
        });
    });
});
