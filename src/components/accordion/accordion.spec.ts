import '../../utils/polyfills';

import { mount, Wrapper } from '@vue/test-utils';
import Vue from 'vue';

import { addMessages } from '../../../tests/helpers/lang';
import { renderComponent } from '../../../tests/helpers/render';
import uuid from '../../utils/uuid/uuid';
import AccordionPlugin, { MAccordion, MAccordionIconPosition, MAccordionIconSize, MAccordionSkin } from './accordion';

jest.mock('../../utils/uuid/uuid');
(uuid.generate as jest.Mock).mockReturnValue('uuid');

describe('MAcordion', () => {
    beforeEach(() => {
        Vue.use(AccordionPlugin);
        addMessages(Vue, ['components/accordion/accordion.lang.en.json']);
    });

    it('should render correctly', () => {
        const acn: Wrapper<MAccordion> = mount(MAccordion);
        return expect(renderComponent(acn.vm)).resolves.toMatchSnapshot();
    });

    it('should render correctly when it is opened', () => {
        const acn: Wrapper<MAccordion> = mount(MAccordion, {
            propsData: {
                open: true
            },
            slots: {
                default: 'Content'
            }
        });

        return expect(renderComponent(acn.vm)).resolves.toMatchSnapshot();
    });

    it('should render correctly when disabled', async () => {
        const acn: Wrapper<MAccordion> = mount(MAccordion, {
            propsData: {
                disabled: true
            },
            slots: {
                default: 'Content'
            }
        });

        return expect(renderComponent(acn.vm)).resolves.toMatchSnapshot();
    });

    it('should render skins correctly', async () => {
        const acn: Wrapper<MAccordion> = mount(MAccordion);

        for (const skin in MAccordionSkin) {
            acn.setProps({ skin: MAccordionSkin[skin] });
            expect(await renderComponent(acn.vm)).toMatchSnapshot(skin);
        }
    });

    it('should render icon positions correctly', async () => {
        const acn: Wrapper<MAccordion> = mount(MAccordion);

        for (const skin in MAccordionIconPosition) {
            acn.setProps({ skin: MAccordionIconPosition[skin] });
            expect(await renderComponent(acn.vm)).toMatchSnapshot(skin);
        }
    });

    it('should render icon sizes correctly', async () => {
        const acn: Wrapper<MAccordion> = mount(MAccordion);

        for (const skin in MAccordionIconSize) {
            acn.setProps({ skin: MAccordionIconSize[skin] });
            expect(await renderComponent(acn.vm)).toMatchSnapshot(skin);
        }
    });

    it('should render correctly when there is an icon border', async () => {
        const acn: Wrapper<MAccordion> = mount(MAccordion, {
            propsData: {
                iconBorder: true
            }
        });

        return expect(renderComponent(acn.vm)).resolves.toMatchSnapshot();
    });

    it('should emit click event when it is opened or closed', () => {
        const acn: Wrapper<MAccordion> = mount(MAccordion);

        acn.find('.m-accordion__header').trigger('click');
        expect(acn.emitted('click')[0][0]).toBeTruthy();

        acn.find('.m-accordion__header').trigger('click');
        expect(acn.emitted('click')[1][0]).toBeFalsy();
    });

    it('should react to open prop changes', () => {
        const acn: Wrapper<MAccordion> = mount(MAccordion);

        acn.setProps({ open: false });
        expect(acn.find('.m-accordion__body').exists()).toBeFalsy();

        acn.setProps({ open: true });
        expect(acn.find('.m-accordion__body').exists()).toBeTruthy();
    });

    it('should sync open prop', () => {
        const acn: Wrapper<MAccordion> = mount(MAccordion);

        acn.find('.m-accordion__header').trigger('click');

        expect(acn.emitted('update:open')[0][0]).toBeTruthy();
    });
});
