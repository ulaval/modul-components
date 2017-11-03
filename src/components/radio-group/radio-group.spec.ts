import Vue from 'vue';
import '../../utils/polyfills';
import { MRadioPosition } from '../radio/radio';
import RadioGroupPlugin, { MRadioGroup } from './radio-group';

const DISABLED_CSS: string = 'm--is-disabled';
const POSITION_RIGHT_CSS: string = 'm--is-input-right';
const INLINE_CSS: string = 'm--is-inline';
const CHECKED_CSS: string = 'm--is-checked';

describe('radio-group', () => {
    beforeEach(() => {
        Vue.use(RadioGroupPlugin);
    });

    it('name is applied on each radio item', () => {
        let vm = new Vue({
            template: `
            <div>
                <m-radio-group ref="g">
                    <m-radio ref="a" value="radio1"></m-radio>
                    <m-radio ref="b" value="radio2"></m-radio>
                </m-radio-group>
            </div>`
        }).$mount();

        let inputA: HTMLInputElement | null = (vm.$refs.a as Vue).$el.querySelector('input');
        let inputB: HTMLInputElement | null = (vm.$refs.b as Vue).$el.querySelector('input');

        expect(inputA).toBeTruthy();
        expect(inputB).toBeTruthy();
        if (inputA) {
            expect(inputA.name).toEqual((vm.$refs.g as MRadioGroup).name);
        }
        if (inputB) {
            expect(inputB.name).toEqual((vm.$refs.g as MRadioGroup).name);
        }
    });

    it('iconname prop is ignored', () => {
        let vm = new Vue({
            template: `
            <div>
                <m-radio-group ref="g">
                    <m-radio ref="a" :icon-name="iconName" value="radio1"></m-radio>
                    <m-radio ref="b" value="radio2"></m-radio>
                </m-radio-group>
            </div>`,
            data: {
                iconName: undefined
            }
        }).$mount();

        let svg: SVGSVGElement | null = (vm.$refs.a as Vue).$el.querySelector('svg');
        expect(svg).toBeFalsy();

        (vm as any).iconName = 'chip-error';
        Vue.nextTick(() => {
            svg = (vm.$refs.a as Vue).$el.querySelector('svg');
            expect(svg).toBeFalsy();
        });
    });

    describe('position prop overrides radio items', () => {
        let vm: Vue;

        beforeEach(() => {
            vm = new Vue({
                template: `
                <div>
                    <m-radio-group ref="g" :position="position" >
                        <m-radio ref="a" position="left" value="radio1"></m-radio>
                        <m-radio ref="b" position="right" value="radio2"></m-radio>
                        <m-radio ref="c" value="radio3"></m-radio>
                    </m-radio-group>
                </div>`,
                data: {
                    position: undefined
                }
            }).$mount();
        });

        it('position prop left', () => {
            expect((vm.$refs.a as Vue).$el.classList.contains(POSITION_RIGHT_CSS)).toBeFalsy();
            expect((vm.$refs.b as Vue).$el.classList.contains(POSITION_RIGHT_CSS)).toBeFalsy();
            expect((vm.$refs.c as Vue).$el.classList.contains(POSITION_RIGHT_CSS)).toBeFalsy();

            (vm as any).position = MRadioPosition.Left;
            Vue.nextTick(() => {
                expect((vm.$refs.a as Vue).$el.classList.contains(POSITION_RIGHT_CSS)).toBeFalsy();
                expect((vm.$refs.b as Vue).$el.classList.contains(POSITION_RIGHT_CSS)).toBeFalsy();
                expect((vm.$refs.c as Vue).$el.classList.contains(POSITION_RIGHT_CSS)).toBeFalsy();
            });
        });

        it('position prop right', () => {
            expect((vm.$refs.a as Vue).$el.classList.contains(POSITION_RIGHT_CSS)).toBeFalsy();
            expect((vm.$refs.b as Vue).$el.classList.contains(POSITION_RIGHT_CSS)).toBeFalsy();
            expect((vm.$refs.c as Vue).$el.classList.contains(POSITION_RIGHT_CSS)).toBeFalsy();

            (vm as any).position = MRadioPosition.Right;
            Vue.nextTick(() => {
                expect((vm.$refs.a as Vue).$el.classList.contains(POSITION_RIGHT_CSS)).toBeTruthy();
                expect((vm.$refs.b as Vue).$el.classList.contains(POSITION_RIGHT_CSS)).toBeTruthy();
                expect((vm.$refs.c as Vue).$el.classList.contains(POSITION_RIGHT_CSS)).toBeTruthy();
            });
        });
    });

    it('inline prop', () => {
        let vm = new Vue({
            template: `
            <div>
                <m-radio-group ref="g" :inline="inline" >
                    <m-radio ref="a" value="radio1"></m-radio>
                    <m-radio ref="b" value="radio2"></m-radio>
                </m-radio-group>
            </div>`,
            data: {
                inline: undefined
            }
        }).$mount();

        expect((vm.$refs.g as Vue).$el.classList.contains(INLINE_CSS)).toBeFalsy();
        expect((vm.$refs.a as Vue).$el.classList.contains(INLINE_CSS)).toBeFalsy();
        expect((vm.$refs.b as Vue).$el.classList.contains(INLINE_CSS)).toBeFalsy();

        (vm as any).inline = true;
        Vue.nextTick(() => {
            expect((vm.$refs.g as Vue).$el.classList.contains(INLINE_CSS)).toBeTruthy();
            expect((vm.$refs.a as Vue).$el.classList.contains(INLINE_CSS)).toBeTruthy();
            expect((vm.$refs.b as Vue).$el.classList.contains(INLINE_CSS)).toBeTruthy();

            (vm as any).inline = false;
            Vue.nextTick(() => {
                expect((vm.$refs.g as Vue).$el.classList.contains(INLINE_CSS)).toBeFalsy();
                expect((vm.$refs.a as Vue).$el.classList.contains(INLINE_CSS)).toBeFalsy();
                expect((vm.$refs.b as Vue).$el.classList.contains(INLINE_CSS)).toBeFalsy();
            });
        });
    });

    it('disabled prop', () => {
        let vm = new Vue({
            template: `
            <div>
                <m-radio-group ref="g" :disabled="disabled" >
                    <m-radio ref="a" value="radio1"></m-radio>
                    <m-radio ref="b" :disabled="true" value="radio2"></m-radio>
                </m-radio-group>
            </div>`,
            data: {
                disabled: undefined
            }
        }).$mount();

        expect((vm.$refs.a as Vue).$el.classList.contains(DISABLED_CSS)).toBeFalsy();
        // override by item
        expect((vm.$refs.b as Vue).$el.classList.contains(DISABLED_CSS)).toBeTruthy();

        (vm as any).disabled = true;
        Vue.nextTick(() => {
            expect((vm.$refs.a as Vue).$el.classList.contains(DISABLED_CSS)).toBeTruthy();
            expect((vm.$refs.b as Vue).$el.classList.contains(DISABLED_CSS)).toBeTruthy();

            (vm as any).disabled = false;
            Vue.nextTick(() => {
                expect((vm.$refs.a as Vue).$el.classList.contains(DISABLED_CSS)).toBeFalsy();
                // override
                expect((vm.$refs.b as Vue).$el.classList.contains(DISABLED_CSS)).toBeTruthy();
            });
        });
    });

    it('v-model', () => {
        let vm = new Vue({
            template: `
            <div>
                <m-radio-group ref="g" v-model="model" >
                    <m-radio ref="a" value="radio1"></m-radio>
                    <m-radio ref="b" value="radio2"></m-radio>
                </m-radio-group>
            </div>`,
            data: {
                model: 'radio2'
            }
        }).$mount();

        let li1: HTMLLIElement = (vm.$refs.a as Vue).$el as HTMLLIElement;
        let li2: HTMLLIElement = (vm.$refs.b as Vue).$el as HTMLLIElement;

        expect(li1.classList.contains(CHECKED_CSS)).toBeFalsy();
        expect(li2.classList.contains(CHECKED_CSS)).toBeTruthy();
        (vm as any).model = 'radio1';
        Vue.nextTick(() => {
            expect(li1.classList.contains(CHECKED_CSS)).toBeTruthy();
            expect(li2.classList.contains(CHECKED_CSS)).toBeFalsy();
        });
    });

    it('change event', () => {
        let changeSpy = jasmine.createSpy('changeSpy');
        let vm = new Vue({
            data: {
                model: 'radio2'
            },
            template: `
            <div>
                <m-radio-group ref="g" v-model="model" @change="onChange">
                    <m-radio ref="a" value="radio1"></m-radio>
                    <m-radio ref="b" value="radio2"></m-radio>
                </m-radio-group>
            </div>`,
            methods: {
                onChange: changeSpy
            }
        }).$mount();

        let input: HTMLInputElement | null = (vm.$refs.a as Vue).$el.querySelector('input');

        let e: any = document.createEvent('HTMLEvents');
        e.initEvent('change', true, true);

        if (input) {
            input.dispatchEvent(e);
        }
        Vue.nextTick(() => {
            expect(changeSpy).toHaveBeenCalledWith('radio1');
        });
    });
});
