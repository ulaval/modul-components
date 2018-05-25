import { createLocalVue, mount, Wrapper } from '@vue/test-utils';
import Vue, { VueConstructor } from 'vue';

import { renderComponent } from '../../../tests/helpers/render';
import ProgressPlugin, { MProgress } from './progress';

describe('MProgress', () => {
    let localVue: VueConstructor<Vue>;

    beforeEach(() => {
        localVue = createLocalVue();
        localVue.use(ProgressPlugin);
    });

    describe('bar mode', () => {
        it('should render correctly', () => {
            const pgr: Wrapper<MProgress> = mount(MProgress, {
                localVue: localVue
            });

            return expect(renderComponent(pgr.vm)).resolves.toMatchSnapshot();
        });
    });

    describe('indeterminate mode', () => {
        it('should render correctly', () => {
            const pgr: Wrapper<MProgress> = mount(MProgress, {
                localVue: localVue,
                propsData: {
                    indeterminate: true
                }
            });

            return expect(renderComponent(pgr.vm)).resolves.toMatchSnapshot();
        });

        it('should render correctly when circle', () => {
            const pgr: Wrapper<MProgress> = mount(MProgress, {
                localVue: localVue,
                propsData: {
                    circle: true
                }
            });

            return expect(renderComponent(pgr.vm)).resolves.toMatchSnapshot();
        });
    });
});
