import { mount, Wrapper } from '@vue/test-utils';
import Vue from 'vue';
import { addMessages } from '../../../tests/helpers/lang';
import '../../utils/polyfills';
import uuid from '../../utils/uuid/uuid';
import AccordionPlugin, { MAccordion } from './accordion';



jest.mock('../../utils/uuid/uuid');
(uuid.generate as jest.Mock).mockReturnValue('uuid');

describe('MAcordion', () => {
    beforeEach(() => {
        Vue.use(AccordionPlugin);
        addMessages(Vue, ['components/accordion/accordion.lang.en.json']);
    });


    it('should emit click event when it is opened or closed', () => {
        const acn: Wrapper<MAccordion> = mount(MAccordion, {
            slots: {
                default: `<p>body</p>`
            }
        });

        acn.find('.m-accordion__header').trigger('click');
        expect(acn.emitted('click')).toBeTruthy();
        expect(acn.find('.m--is-open').exists()).toBeTruthy();

        acn.find('.m-accordion__header').trigger('click');
        expect(acn.emitted('click')).toBeTruthy();
        expect(acn.find('.m--is-open').exists()).toBeFalsy();

        acn.find('.m-accordion__header').trigger('click');
        expect(acn.emitted('click')).toBeTruthy();
        expect(acn.find('.m--is-open').exists()).toBeTruthy();
    });

    it('should react to open prop changes', () => {
        const acn: Wrapper<MAccordion> = mount(MAccordion, {
            slots: {
                default: `<p>body</p>`
            }
        });

        acn.setProps({ open: false });
        expect(acn.find('.m-accordion__body').exists()).toBeFalsy();

        acn.setProps({ open: true });
        expect(acn.find('.m-accordion__body').exists()).toBeTruthy();
    });

    it('should sync open prop', () => {
        const acn: Wrapper<MAccordion> = mount(MAccordion, {
            slots: {
                default: `<p>body</p>`
            }
        });

        acn.find('.m-accordion__header').trigger('click');

        expect(acn.emitted('update:open')[0][0]).toBeTruthy();
    });
});
