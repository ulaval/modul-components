import { createLocalVue, mount, Wrapper } from '@vue/test-utils';
import Vue, { VueConstructor } from 'vue';
import VueRouter from 'vue-router';
import { addMessages } from '../../../tests/helpers/lang';
import { renderComponent } from '../../../tests/helpers/render';
import LinkPlugin, { MLink, MLinkIconPosition } from './link';


describe('MLink', () => {
    let localVue: VueConstructor<Vue>;

    const router: VueRouter = new VueRouter({
        mode: 'history',
        routes: [
            {
                path: '/named/:paramId',
                name: 'named'
            }
        ]
    });

    beforeEach(() => {
        Vue.use(VueRouter);
        localVue = createLocalVue();
        localVue.use(LinkPlugin);
        addMessages(localVue, ['components/link/link.lang.en.json']);
    });

    describe('Link using RouterLink', () => {
        it('should render correctly', () => {
            const link: Wrapper<MLink> = mount(MLink, {
                router: router,
                localVue: localVue,
                propsData: {
                    url: '/'
                }
            });

            return expect(renderComponent(link.vm)).resolves.toMatchSnapshot();
        });

        it('should render content correctly', () => {
            const link: Wrapper<MLink> = mount(MLink, {
                router: router,
                localVue: localVue,
                propsData: {
                    url: '/'
                },
                slots: {
                    default: 'Link'
                }
            });

            return expect(renderComponent(link.vm)).resolves.toMatchSnapshot();
        });

        it('should render link target when prop is set', () => {
            const link: Wrapper<MLink> = mount(MLink, {
                router: router,
                localVue: localVue,
                propsData: {
                    target: '_self',
                    url: '/'
                }
            });

            return expect(renderComponent(link.vm)).resolves.toMatchSnapshot();
        });

        it('should render open in new tab hidden text when target is _blank', () => {
            const link: Wrapper<MLink> = mount(MLink, {
                router: router,
                localVue: localVue,
                propsData: {
                    target: '_blank',
                    url: '/'
                }
            });

            return expect(renderComponent(link.vm)).resolves.toMatchSnapshot();
        });

        it('should render correctly when url prop is a string', () => {
            const link: Wrapper<MLink> = mount(MLink, {
                router: router,
                localVue: localVue,
                propsData: {
                    url: '/test'
                }
            });

            return expect(renderComponent(link.vm)).resolves.toMatchSnapshot();
        });

        it('should pass route values to router-link using url prop', () => {
            const link: Wrapper<MLink> = mount(MLink, {
                router: router,
                localVue: localVue,
                propsData: {
                    url: { name: 'named', params: { paramId: 123 } }
                }
            });

            return expect(renderComponent(link.vm)).resolves.toMatchSnapshot();
        });

        it('should render correctly all link status', async () => {
            const link: Wrapper<MLink> = mount(MLink, {
                router: router,
                localVue: localVue
            });

            await renderAllLinkStyles(link);
        });

        it('should render correctly all icon style', async () => {
            const link: Wrapper<MLink> = mount(MLink, {
                router: router,
                localVue: localVue,
                propsData: {
                    url: '/',
                    icon: true
                }
            });

            await renderAllIconStyle(link);
        });
    });

    describe('Link with extern prop', () => {
        it('should render correctly', () => {
            const link: Wrapper<MLink> = mount(MLink, {
                router: router,
                localVue: localVue,
                propsData: {
                    extern: true,
                    url: '/'
                }
            });

            return expect(renderComponent(link.vm)).resolves.toMatchSnapshot();
        });

        it('should render link target when prop is set', () => {
            const link: Wrapper<MLink> = mount(MLink, {
                router: router,
                localVue: localVue,
                propsData: {
                    extern: true,
                    url: '/',
                    target: '_self'
                }
            });

            return expect(renderComponent(link.vm)).resolves.toMatchSnapshot();
        });

        it('should render open in new tab hidden text when target is _blank', () => {
            const link: Wrapper<MLink> = mount(MLink, {
                router: router,
                localVue: localVue,
                propsData: {
                    extern: true,
                    url: '/',
                    target: '_blank'
                }
            });

            return expect(renderComponent(link.vm)).resolves.toMatchSnapshot();
        });

        it('should render content correctly', () => {
            const link: Wrapper<MLink> = mount(MLink, {
                router: router,
                localVue: localVue,
                propsData: {
                    extern: true,
                    url: '/'
                },
                slots: {
                    default: 'Link'
                }
            });

            return expect(renderComponent(link.vm)).resolves.toMatchSnapshot();
        });

        it('should render correctly all link status', async () => {
            const link: Wrapper<MLink> = mount(MLink, {
                router: router,
                localVue: localVue,
                propsData: {
                    extern: true,
                    url: '/'
                }
            });

            await renderAllLinkStyles(link);
        });

        it('should render correctly all icon style', async () => {
            const link: Wrapper<MLink> = mount(MLink, {
                router: router,
                localVue: localVue,
                propsData: {
                    extern: true,
                    url: '/',
                    icon: true
                }
            });

            await renderAllIconStyle(link);
        });
    });

    describe('Link use as button', () => {
        it('should render correctly', () => {
            const link: Wrapper<MLink> = mount(MLink, {
                router: router,
                localVue: localVue
            });

            return expect(renderComponent(link.vm)).resolves.toMatchSnapshot();
        });
    });

    const renderAllLinkStyles: (link: Wrapper<MLink>) => Promise<void> = async (link: Wrapper<MLink>) => {
        link.setProps({ disabled: true });
        expect(await renderComponent(link.vm)).toMatchSnapshot('disabled');
        link.setProps({ unvisited: true, disabled: false });
        expect(await renderComponent(link.vm)).toMatchSnapshot('unvisited');
        link.setProps({ underline: false, unvisited: false });
        expect(await renderComponent(link.vm)).toMatchSnapshot('underline');
    };

    const renderAllIconStyle: (link: Wrapper<MLink>) => Promise<void> = async (link: Wrapper<MLink>) => {
        link.setProps({ iconName: 'clock' });
        expect(await renderComponent(link.vm)).toMatchSnapshot('name');
        link.setProps({ iconSize: '24px', iconName: undefined });
        expect(await renderComponent(link.vm)).toMatchSnapshot('size');
        link.setProps({
            iconPosition: MLinkIconPosition.Left,
            iconSize: '12px'
        });
        expect(await renderComponent(link.vm)).toMatchSnapshot('left');
        link.setProps({ iconPosition: MLinkIconPosition.Right });
        expect(await renderComponent(link.vm)).toMatchSnapshot('right');
    };
});
