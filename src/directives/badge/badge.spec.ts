import { createLocalVue, mount, Wrapper } from '@vue/test-utils';
import Vue, { VueConstructor } from 'vue';

import { renderComponent } from '../../../tests/helpers/render';
import BadgePlugin, { MBadge, MBadgeState } from './badge';

describe('MBadge', () => {
    let localVue: VueConstructor<Vue>;

    beforeEach(() => {
        localVue = createLocalVue();
        localVue.use(BadgePlugin);
    });

    it('should render correctly', () => {
        const iconFile = mount(MBadge, {
            localVue: localVue
        });

        return expect(renderComponent(iconFile.vm)).resolves.toMatchSnapshot();
    });

    it('should render correctly when state is completed', () => {
        const iconFile = mount(MBadge, {
            localVue: localVue,
            propsData: {
                state: MBadgeState.Completed
            }
        });

        return expect(renderComponent(iconFile.vm)).resolves.toMatchSnapshot();
    });
    it('should render correctly when state is warning', () => {
        const iconFile = mount(MBadge, {
            localVue: localVue,
            propsData: {
                state: MBadgeState.Warning
            }
        });

        return expect(renderComponent(iconFile.vm)).resolves.toMatchSnapshot();
    });

    it('should render correctly when state is error', () => {
        const iconFile = mount(MBadge, {
            localVue: localVue,
            propsData: {
                state: MBadgeState.Error
            }
        });

        return expect(renderComponent(iconFile.vm)).resolves.toMatchSnapshot();
    });

    describe('icon', () => {
        let iconFile: Wrapper<MBadge>;
        beforeEach(() => {
            iconFile = mount(MBadge, {
                localVue: localVue,
                propsData: {
                    name: 'pdf'
                }
            });
        });

        it('should render correctly', () => {
            return expect(renderComponent(iconFile.vm)).resolves.toMatchSnapshot();
        });

        it('should render correctly when size is set', () => {
            iconFile.setProps({ size: '40px' });
            return expect(renderComponent(iconFile.vm)).resolves.toMatchSnapshot();
        });
    });

    describe('chip', () => {
        let iconFile: Wrapper<MBadge>;
        beforeEach(() => {
            iconFile = mount(MBadge, {
                localVue: localVue,
                propsData: {
                    state: MBadgeState.Completed
                }
            });
        });

        it('should render correctly', () => {
            return expect(renderComponent(iconFile.vm)).resolves.toMatchSnapshot();
        });

        it('should render correctly when size is set', () => {
            iconFile.setProps({ chipSize: '40px' });
            return expect(renderComponent(iconFile.vm)).resolves.toMatchSnapshot();
        });
    });
});
