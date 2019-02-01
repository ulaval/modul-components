import { shallowMount, Wrapper } from '@vue/test-utils';
import Vue, { VueConstructor } from 'vue';
import { resetModulPlugins } from '../../../tests/helpers/component';
import { renderComponent } from '../../../tests/helpers/render';
import uuid from '../../utils/uuid/uuid';
import TooltipPlugin, { MTooltip, MTooltipMode } from './tooltip';


jest.mock('../../utils/uuid/uuid');
(uuid.generate as jest.Mock).mockReturnValue('uuid');

describe('tooltip', () => {
    let localVue: VueConstructor<Vue>;

    beforeEach(() => {
        resetModulPlugins();
        Vue.use(TooltipPlugin);
    });

    it('should render correctly', () => {
        const tooltip: Wrapper<MTooltip> = shallowMount(MTooltip, {
            localVue: Vue
        });

        return expect(
            renderComponent(tooltip.vm)
        ).resolves.toMatchSnapshot();
    });

    it('should render correctly when is open', () => {
        const tooltip: Wrapper<MTooltip> = shallowMount(MTooltip, {
            localVue: Vue,
            propsData: {
                open: true
            }
        });

        return expect(
            renderComponent(tooltip.vm)
        ).resolves.toMatchSnapshot();
    });

    it('should render correctly with default slot', () => {
        const tooltip: Wrapper<MTooltip> = shallowMount(MTooltip, {
            localVue: localVue,
            slots: {
                default: 'Tooltip text'
            }
        });

        return expect(renderComponent(tooltip.vm)).resolves.toMatchSnapshot();
    });

    it('should render correctly when mode is link', () => {
        const tooltip: Wrapper<MTooltip> = shallowMount(MTooltip, {
            localVue: localVue,
            propsData: {
                mode: MTooltipMode.Link
            },
            slots: {
                default: 'Tooltip text',
                link: 'Link'
            }
        });

        return expect(renderComponent(tooltip.vm)).resolves.toMatchSnapshot();
    });

    it('should render correctly when disabled', () => {
        const tooltip: Wrapper<MTooltip> = shallowMount(MTooltip, {
            localVue: localVue,
            propsData: {
                disabled: true
            }
        });

        return expect(renderComponent(tooltip.vm)).resolves.toMatchSnapshot();
    });

    it('should render correctly when close-button is false', () => {
        const tooltip: Wrapper<MTooltip> = shallowMount(MTooltip, {
            localVue: localVue,
            propsData: {
                closeButton: false
            }
        });

        return expect(renderComponent(tooltip.vm)).resolves.toMatchSnapshot();
    });

    it('should render correctly when open title is set', () => {
        const tooltip: Wrapper<MTooltip> = shallowMount(MTooltip, {
            localVue: localVue,
            propsData: {
                openTitle: 'test_open'
            }
        });

        return expect(renderComponent(tooltip.vm)).resolves.toMatchSnapshot();
    });

    it('should render correctly when close title is set', () => {
        const tooltip: Wrapper<MTooltip> = shallowMount(MTooltip, {
            localVue: localVue,
            propsData: {
                open: true,
                closeTitle: 'test_close'

            }
        });

        return expect(renderComponent(tooltip.vm)).resolves.toMatchSnapshot();
    });

});
