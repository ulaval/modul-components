import { RefSelector, shallowMount, Wrapper } from '@vue/test-utils';
import Vue from '../../../node_modules/vue';
import { renderComponent } from '../../../tests/helpers/render';
import InputStylePlugin, { MInputStyle } from './input-style';

const ROOT: RefSelector = { ref: 'root' };
const CSSLABELUP: string = 'm--is-label-up';
const CSSCURSOR: string = 'm--has-cursor-pointer';

let wrapper: Wrapper<MInputStyle>;

describe('MInputStyle', () => {
    beforeEach(() => {
        Vue.use(InputStylePlugin);
        wrapper = shallowMount(MInputStyle, {
            slots: {
                default: '<input ref="input" type="text"/>'
            }
        });
    });

    it('should render correctly', () => {
        expect(renderComponent(wrapper.vm)).resolves.toMatchSnapshot();
    });

    describe('In ready only Mode', () => {
        beforeEach(() => {
            wrapper.setProps({
                readonly: true
            });
        });
        it('label should not move on click', () => {

            wrapper.find(ROOT).trigger('click');

            expect(wrapper.vm.isLabelUp).toBeFalsy();
            expect(wrapper.classes()).not.toContain(CSSLABELUP);
        });
    });

    describe('If isLabelUp', () => {
        beforeEach(() => {
            wrapper.setProps({
                label: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit, laborum labore ipsa iure sapiente tenetur corporis iusto dicta. Autem itaque quaerat porro explicabo illum vero a rem nemo odit distinctio?',
                width: '200px',
                focus: true,
                empty: false,
                readonly: false
            });
        });
        it('true', async () => {

            expect(wrapper.vm.isLabelUp).toBe(true);
            expect(wrapper.vm.focus).toBe(true);
            expect(wrapper.vm.empty).toBe(false);
            expect(wrapper.vm.readonly).toBe(false);
            expect(wrapper.vm.label).toBe('Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit, laborum labore ipsa iure sapiente tenetur corporis iusto dicta. Autem itaque quaerat porro explicabo illum vero a rem nemo odit distinctio?');
            await wrapper.vm.$nextTick();
            let labeloffset: number = wrapper.vm.$refs.label.clientHeight / 2;
            expect(wrapper.attributes().style).toContain('margin-top: ' + labeloffset + 'px');
        });
    });

    describe('show pointer cursor', () => {
        beforeEach(() => {
            wrapper.setProps({
                cursorPointer: true
            });
        });
        it('css cursor class should be present', () => {
            expect(wrapper.classes()).toContain(CSSCURSOR);
        });
    });
});
