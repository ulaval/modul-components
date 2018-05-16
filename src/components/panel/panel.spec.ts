import { createLocalVue, mount, Wrapper } from '@vue/test-utils';
import Vue, { VueConstructor } from 'vue';

import { renderComponent } from '../../../tests/helpers/render';
import { MPanel, MPanelSkin } from './panel';

describe('MPanel', () => {
    let localVue: VueConstructor<Vue>;
    beforeEach(() => {
        localVue = createLocalVue();
    });

    it('should render correctly', () => {
        const pnl: Wrapper<MPanel> = mount(MPanel, {
            localVue: localVue,
            slots: {
                default: 'body'
            }
        });

        return expect(renderComponent(pnl.vm)).resolves.toMatchSnapshot();
    });

    it('should render correctly when an header is provided', () => {
        const pnl: Wrapper<MPanel> = mount(MPanel, {
            localVue: localVue,
            slots: {
                default: 'body',
                header: 'header'
            }
        });

        return expect(renderComponent(pnl.vm)).resolves.toMatchSnapshot();
    });

    it('should render correctly when a footer is provided', () => {
        const pnl: Wrapper<MPanel> = mount(MPanel, {
            localVue: localVue,
            slots: {
                default: 'body',
                footer: 'footer'
            }
        });

        return expect(renderComponent(pnl.vm)).resolves.toMatchSnapshot();
    });

    it('should render skink correctly', async () => {
        const pnl: Wrapper<MPanel> = mount(MPanel, {
            localVue: localVue,
            slots: {
                default: 'body'
            }
        });

        for (const skin in MPanelSkin) {
            pnl.setProps({ skin: MPanelSkin[skin] });
            expect(renderComponent(pnl.vm)).resolves.toMatchSnapshot(skin);
        }
    });

    it('should render correctly with border', () => {
        const pnl: Wrapper<MPanel> = mount(MPanel, {
            localVue: localVue,
            propsData: {
                border: true
            }
        });

        return expect(renderComponent(pnl.vm)).resolves.toMatchSnapshot();
    });

    it('should render correctly with shadow', () => {
        const pnl: Wrapper<MPanel> = mount(MPanel, {
            localVue: localVue,
            propsData: {
                shadow: true
            }
        });

        return expect(renderComponent(pnl.vm)).resolves.toMatchSnapshot();
    });

    it('should render correctly with no padding', () => {
        const pnl: Wrapper<MPanel> = mount(MPanel, {
            localVue: localVue,
            propsData: {
                padding: false
            }
        });

        return expect(renderComponent(pnl.vm)).resolves.toMatchSnapshot();
    });

    it('should render correctly with no body padding', () => {
        const pnl: Wrapper<MPanel> = mount(MPanel, {
            localVue: localVue,
            propsData: {
                paddingBody: false
            },
            slots: {
                default: 'body'
            }
        });

        return expect(renderComponent(pnl.vm)).resolves.toMatchSnapshot();
    });

    it('should render correctly with no header padding', () => {
        const pnl: Wrapper<MPanel> = mount(MPanel, {
            localVue: localVue,
            propsData: {
                paddingHeader: false
            },
            slots: {
                header: 'header'
            }
        });

        return expect(renderComponent(pnl.vm)).resolves.toMatchSnapshot();
    });

    it('should render correctly with no footer padding', () => {
        const pnl: Wrapper<MPanel> = mount(MPanel, {
            localVue: localVue,
            propsData: {
                paddingFooter: false
            },
            slots: {
                footer: 'footer'
            }
        });

        return expect(renderComponent(pnl.vm)).resolves.toMatchSnapshot();
    });

    it('should emit click event when panel is clicked on', () => {
        const pnl: Wrapper<MPanel> = mount(MPanel, {
            localVue: localVue,
            slots: {
                default: 'body'
            }
        });

        pnl.find('article').trigger('click');

        expect(pnl.emitted('click'));
    });
});
