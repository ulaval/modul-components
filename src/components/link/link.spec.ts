import { createLocalVue, mount, Wrapper } from '@vue/test-utils';
import Vue, { VueConstructor } from 'vue';
import VueRouter from 'vue-router';
import { addMessages } from '../../../tests/helpers/lang';
import LinkPlugin, { MLink, MLinkMode } from './link';

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
});
