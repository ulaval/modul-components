import '../../utils/polyfills';

import { mount, Slots } from '@vue/test-utils';
import Vue from 'vue';
import uuid from '../../utils/uuid/uuid';

import { addMessages } from '../../../tests/helpers/lang';
import { renderComponent } from '../../../tests/helpers/render';
import { MAccordion, MAccordionSkin } from '../accordion/accordion';
import AccordionGroupPlugin, { MAccordionGroup } from './accordion-group';

jest.mock('../../utils/uuid/uuid');
(uuid.generate as jest.Mock).mockReturnValue('uuid');

describe('MAcordionGroup', () => {
    beforeEach(() => {
        Vue.use(AccordionGroupPlugin);
        addMessages(Vue, [
            'components/accordion/accordion.lang.en.json',
            'components/accordion-group/accordion-group.lang.en.json'
        ]);
    });

    it('should render correctly', () => {
        const acn = mountGroup();

        return expect(renderComponent(acn.vm)).resolves.toMatchSnapshot();
    });

    it('should render correctly with title', () => {
        const acn = mountGroup(
            {},
            {
                title: 'title'
            }
        );

        return expect(renderComponent(acn.vm)).resolves.toMatchSnapshot();
    });

    it('should not render toggle links when concurrent', () => {
        const acn = mountGroup({
            concurrent: true
        });

        return expect(renderComponent(acn.vm)).resolves.toMatchSnapshot();
    });

    it('should not render open all link when all accordions are closed', () => {
        const acn = mountGroup();

        return expect(renderComponent(acn.vm)).resolves.toMatchSnapshot();
    });

    it('should not render close all link when all accordions are opened', () => {
        const acn = mount(MAccordionGroup, {
            slots: {
                default: `<m-accordion :open="true">
                                <span slot="header">A</span>
                            </m-accordion>
                            <m-accordion :open="true">
                                <span slot="header">B</span>
                            </m-accordion>'`
            }
        });

        return expect(renderComponent(acn.vm)).resolves.toMatchSnapshot();
    });

    it('should not render both close all and open all link when state is mixed', () => {
        const acn = mount(MAccordionGroup, {
            slots: {
                default: `<m-accordion :open="true">
                                <span slot="header">A</span>
                            </m-accordion>
                            <m-accordion>
                                <span slot="header">B</span>
                            </m-accordion>'`
            }
        });

        return expect(renderComponent(acn.vm)).resolves.toMatchSnapshot();
    });

    it('should open all accordions when open all is clicked', () => {
        const acn = mountGroup();
        acn.update();

        acn.find('.m-accordion-group__header a').trigger('click');

        const acrds = acn.findAll<MAccordion>({ name: 'MAccordion' });
        expect(acrds.length).toBeGreaterThan(0);
        for (let i = 0; i < acrds.length; ++i) {
            expect(acrds.at(i).vm.propOpen).toBeTruthy();
        }
    });

    it('should close all accordions when close all is clicked', () => {
        const acn = mount(MAccordionGroup, {
            slots: {
                default: `<m-accordion id="a" :open="true">
                                <span slot="header">A</span>
                            </m-accordion>
                            <m-accordion id="b" :open="true">
                                <span slot="header">B</span>
                            </m-accordion>'`
            }
        });
        acn.update();

        acn.find('.m-accordion-group__header a').trigger('click');

        const acrds = acn.findAll<MAccordion>({ name: 'MAccordion' });
        expect(acrds.length).toBeGreaterThan(0);

        for (let i = 0; i < acrds.length; ++i) {
            expect(acrds.at(i).vm.propOpen).toBeFalsy();
        }
    });

    it('should should keep only one opened accordion when concurrent', () => {
        const acn = mountGroup({
            concurrent: true
        });
        const acrds = acn.findAll<MAccordion>({ name: 'MAccordion' });

        acrds
            .at(0)
            .find('.m-accordion__header')
            .trigger('click');
        expect(acrds.at(0).vm.propOpen).toBeTruthy();
        expect(acrds.at(1).vm.propOpen).toBeFalsy();

        acrds
            .at(1)
            .find('.m-accordion__header')
            .trigger('click');
        expect(acrds.at(0).vm.propOpen).toBeFalsy();
        expect(acrds.at(1).vm.propOpen).toBeTruthy();
    });

    it('should cascade down skin to accordions', () => {
        const acn = mountGroup({
            skin: MAccordionSkin.Light
        });

        const acrds = acn.findAll<MAccordion>({ name: 'MAccordion' });
        expect(acrds.length).toBeGreaterThan(0);
        for (let i = 0; i < acrds.length; ++i) {
            expect(acrds.at(i).vm['propSkin']).toEqual(MAccordionSkin.Light);
        }
    });

    it('should cascade down disabled prop to accordions', () => {
        const acn = mountGroup({
            disabled: true
        });

        const acrds = acn.findAll<MAccordion>({ name: 'MAccordion' });
        expect(acrds.length).toBeGreaterThan(0);
        for (let i = 0; i < acrds.length; ++i) {
            expect(acrds.at(i).vm.propDisabled).toEqual(true);
        }
    });

    it('should use accordion disabled prop if group has none defined', () => {
        const acn = mount(MAccordionGroup, {
            slots: {
                default: `<m-accordion :disabled="true">
                                <span slot="header">A</span>
                            </m-accordion>
                            <m-accordion>
                                <span slot="header">B</span>
                            </m-accordion>'`
            }
        });

        const acrds = acn.findAll<MAccordion>({ name: 'MAccordion' });
        expect(acrds.at(0).vm.propDisabled).toEqual(true);
    });

    it('should open all accordions specified by id in openedIds prop', () => {
        const acn = mountGroup({
            openedIds: ['b']
        });

        const acrds = acn.findAll<MAccordion>({ name: 'MAccordion' });
        expect(acrds.at(0).vm.propOpen).toBeFalsy();
        expect(acrds.at(1).vm.propOpen).toBeTruthy();
    });

    it('should should sync openedIds prop when a accordion is closed or opened', () => {
        const acn = mountGroup({
            openedIds: []
        });

        const acrds = acn.findAll<MAccordion>({ name: 'MAccordion' });
        acrds
            .at(0)
            .find('.m-accordion__header')
            .trigger('click');

        expect(acn.emitted('update:openedIds')[0][0]).toEqual(['a']);
    });

    const mountGroup = (propsData?: object, slots?: Slots) => {
        return mount(MAccordionGroup, {
            propsData: propsData,
            slots: {
                default: `<m-accordion id="a">
                                <span slot="header">A</span>
                            </m-accordion>
                            <m-accordion id="b">
                                <span slot="header">B</span>
                            </m-accordion>'`,
                ...slots
            }
        });
    };
});
