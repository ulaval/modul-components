import { createLocalVue, mount, Wrapper } from '@vue/test-utils';
import Vue, { VueConstructor } from 'vue';
import VueRouter from 'vue-router';
import { addMessages } from '../../../tests/helpers/lang';
import { renderComponent } from '../../../tests/helpers/render';
import LinkPlugin, { MLink, MLinkIconPosition, MLinkMode } from './link';

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

    describe('RouterLink mode', () => {
        it('should render correctly', () => {
            const link: Wrapper<MLink> = mount(MLink, {
                router: router,
                localVue: localVue,
                propsData: {
                    mode: MLinkMode.RouterLink
                }
            });

            return expect(renderComponent(link.vm)).resolves.toMatchSnapshot();
        });

        it('should render content correctly', () => {
            const link: Wrapper<MLink> = mount(MLink, {
                router: router,
                localVue: localVue,
                propsData: {
                    mode: MLinkMode.RouterLink
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
                    mode: MLinkMode.RouterLink,
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
                    mode: MLinkMode.RouterLink,
                    target: '_blank'
                }
            });

            return expect(renderComponent(link.vm)).resolves.toMatchSnapshot();
        });

        it('should render correctly when url prop is a string', () => {
            const link: Wrapper<MLink> = mount(MLink, {
                router: router,
                localVue: localVue,
                propsData: {
                    mode: MLinkMode.RouterLink,
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
                    mode: MLinkMode.RouterLink,
                    url: { name: 'named', params: { paramId: 123 } }
                }
            });

            return expect(renderComponent(link.vm)).resolves.toMatchSnapshot();
        });

        it('should render correctly all link status', async () => {
            const link: Wrapper<MLink> = mount(MLink, {
                router: router,
                localVue: localVue,
                propsData: {
                    mode: MLinkMode.RouterLink
                }
            });

            await renderAllLinkStyles(link);
        });

        it('should render correctly all icon style', async () => {
            const link: Wrapper<MLink> = mount(MLink, {
                router: router,
                localVue: localVue,
                propsData: {
                    mode: MLinkMode.Link,
                    icon: true
                }
            });

            await renderAllIconStyle(link);
        });

        it(`should assign router-link event correctly when disabled`, () => {
            const link: Wrapper<MLink> = mount(MLink, {
                router: router,
                localVue: localVue,
                propsData: {
                    mode: MLinkMode.RouterLink,
                    disabled: true
                }
            });

            const refRouter: Wrapper<Vue> = link.find({ ref: 'router' });

            expect(refRouter.exists()).toBe(true);
            expect(refRouter.props().event).toBe('');
        });

        it(`should assign router-link event correctly when enabled`, () => {
            const link: Wrapper<MLink> = mount(MLink, {
                router: router,
                localVue: localVue,
                propsData: {
                    mode: MLinkMode.RouterLink,
                    disabled: false
                }
            });

            const refRouter: Wrapper<Vue> = link.find({ ref: 'router' });

            expect(refRouter.exists()).toBe(true);
            expect(refRouter.props().event).toBe('click');
        });
    });

    describe('Link mode', () => {
        it('should render correctly', () => {
            const link: Wrapper<MLink> = mount(MLink, {
                router: router,
                localVue: localVue,
                propsData: {
                    mode: MLinkMode.Link
                }
            });

            return expect(renderComponent(link.vm)).resolves.toMatchSnapshot();
        });

        it('should render link target when prop is set', () => {
            const link: Wrapper<MLink> = mount(MLink, {
                router: router,
                localVue: localVue,
                propsData: {
                    mode: MLinkMode.Link,
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
                    mode: MLinkMode.Link,
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
                    mode: MLinkMode.Link
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
                    mode: MLinkMode.Link
                }
            });

            await renderAllLinkStyles(link);
        });

        it('should render correctly all icon style', async () => {
            const link: Wrapper<MLink> = mount(MLink, {
                router: router,
                localVue: localVue,
                propsData: {
                    mode: MLinkMode.Link,
                    icon: true
                }
            });

            await renderAllIconStyle(link);
        });
    });

    describe('Button mode', () => {
        it('should render correctly', () => {
            const link: Wrapper<MLink> = mount(MLink, {
                router: router,
                localVue: localVue,
                propsData: {
                    mode: MLinkMode.Button
                }
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
