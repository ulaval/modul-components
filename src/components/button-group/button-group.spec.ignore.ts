import '../../utils/polyfills';

import Vue from 'vue';

import { MRadioPosition } from '../radio/radio';
import ButtonGroupPlugin, { MButtonGroup } from './button-group';

const DISABLED_CSS: string = 'm--is-disabled';
const POSITION_RIGHT_CSS: string = 'm--is-input-right';
const INLINE_CSS: string = 'm--is-inline';
const FULL_SIZE_CSS: string = 'm--is-full-size';
const CHECKED_CSS: string = 'm--is-checked';
const ICON_LEFT_CSS: string = 'm--is-left';
const ICON_RIGHT_CSS: string = 'm--is-right';

describe('button-group', () => {
    beforeEach(() => {
        Vue.use(ButtonGroupPlugin);
    });

    it('name is applied on each radio item', () => {
        let vm: Vue = new Vue({
            template: `
            <div>
                <m-button-group ref="g">
                    <m-radio ref="a" value="radio1"></m-radio>
                    <m-radio ref="b" value="radio2"></m-radio>
                </m-button-group>
            </div>`
        }).$mount();

        let inputA: HTMLInputElement | null = (vm.$refs.a as Vue).$el.querySelector('input');
        let inputB: HTMLInputElement | null = (vm.$refs.b as Vue).$el.querySelector('input');

        expect(inputA).toBeTruthy();
        expect(inputB).toBeTruthy();
        if (inputA) {
            expect(inputA.name).toEqual((vm.$refs.g as MButtonGroup).name);
        }
        if (inputB) {
            expect(inputB.name).toEqual((vm.$refs.g as MButtonGroup).name);
        }
    });

    it('disabled prop', () => {
        let vm: Vue = new Vue({
            template: `
            <div>
                <m-button-group ref="g" :disabled="disabled" >
                    <m-radio ref="a" value="radio1"></m-radio>
                    <m-radio ref="b" :disabled="false" value="radio2"></m-radio>
                </m-button-group>
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

    it('fullSize prop', () => {
        let vm: Vue = new Vue({
            template: `
            <div>
                <m-button-group ref="g" :full-size="fullSize" >
                    <m-radio ref="a" value="radio1"></m-radio>
                    <m-radio ref="b" value="radio2"></m-radio>
                </m-button-group>
            </div>`,
            data: {
                fullSize: undefined
            }
        }).$mount();

        expect((vm.$refs.g as Vue).$el.classList.contains(FULL_SIZE_CSS)).toBeFalsy();
        expect((vm.$refs.a as Vue).$el.classList.contains(FULL_SIZE_CSS)).toBeFalsy();
        expect((vm.$refs.b as Vue).$el.classList.contains(FULL_SIZE_CSS)).toBeFalsy();

        (vm as any).fullsize = true;
        Vue.nextTick(() => {
            expect((vm.$refs.g as Vue).$el.classList.contains(FULL_SIZE_CSS)).toBeTruthy();
            expect((vm.$refs.a as Vue).$el.classList.contains(FULL_SIZE_CSS)).toBeTruthy();
            expect((vm.$refs.b as Vue).$el.classList.contains(FULL_SIZE_CSS)).toBeTruthy();

            (vm as any).fullsize = false;
            Vue.nextTick(() => {
                expect((vm.$refs.g as Vue).$el.classList.contains(FULL_SIZE_CSS)).toBeFalsy();
                expect((vm.$refs.a as Vue).$el.classList.contains(FULL_SIZE_CSS)).toBeFalsy();
                expect((vm.$refs.b as Vue).$el.classList.contains(FULL_SIZE_CSS)).toBeFalsy();
            });
        });
    });

    it('inline prop', () => {
        let vm: Vue = new Vue({
            template: `
            <div>
                <m-button-group ref="g" :inline="inline" >
                    <m-radio ref="a" value="radio1"></m-radio>
                    <m-radio ref="b" value="radio2"></m-radio>
                </m-button-group>
            </div>`,
            data: {
                inline: undefined
            }
        }).$mount();

        expect((vm.$refs.g as Vue).$el.classList.contains(INLINE_CSS)).toBeTruthy();
        expect((vm.$refs.a as Vue).$el.classList.contains(INLINE_CSS)).toBeTruthy();
        expect((vm.$refs.b as Vue).$el.classList.contains(INLINE_CSS)).toBeTruthy();

        (vm as any).inline = false;
        Vue.nextTick(() => {
            expect((vm.$refs.g as Vue).$el.classList.contains(INLINE_CSS)).toBeFalsy();
            expect((vm.$refs.a as Vue).$el.classList.contains(INLINE_CSS)).toBeFalsy();
            expect((vm.$refs.b as Vue).$el.classList.contains(INLINE_CSS)).toBeFalsy();

            (vm as any).inline = true;
            Vue.nextTick(() => {
                expect((vm.$refs.g as Vue).$el.classList.contains(INLINE_CSS)).toBeTruthy();
                expect((vm.$refs.a as Vue).$el.classList.contains(INLINE_CSS)).toBeTruthy();
                expect((vm.$refs.b as Vue).$el.classList.contains(INLINE_CSS)).toBeTruthy();
            });
        });
    });

    describe('radiosPosition prop overrides radio items', () => {
        let vm: Vue;

        beforeEach(() => {
            vm = new Vue({
                template: `
                <div>
                    <m-button-group ref="g" :radiosPosition="position" >
                        <m-radio ref="a" radioPosition="left" value="radio1"></m-radio>
                        <m-radio ref="b" radioPosition="right" value="radio2"></m-radio>
                        <m-radio ref="c" value="radio3"></m-radio>
                    </m-button-group>
                </div>`,
                data: {
                    position: undefined
                }
            }).$mount();
        });

        it('radiosPosition prop left', () => {
            expect((vm.$refs.a as Vue).$el.classList.contains(POSITION_RIGHT_CSS)).toBeFalsy();
            expect((vm.$refs.b as Vue).$el.classList.contains(POSITION_RIGHT_CSS)).toBeFalsy();
            expect((vm.$refs.c as Vue).$el.classList.contains(POSITION_RIGHT_CSS)).toBeFalsy();

            (vm as any).radiosPosition = MRadioPosition.Left;
            Vue.nextTick(() => {
                expect((vm.$refs.a as Vue).$el.classList.contains(POSITION_RIGHT_CSS)).toBeFalsy();
                expect((vm.$refs.b as Vue).$el.classList.contains(POSITION_RIGHT_CSS)).toBeFalsy();
                expect((vm.$refs.c as Vue).$el.classList.contains(POSITION_RIGHT_CSS)).toBeFalsy();
            });
        });

        it('radiosPosition prop right', () => {
            expect((vm.$refs.a as Vue).$el.classList.contains(POSITION_RIGHT_CSS)).toBeFalsy();
            expect((vm.$refs.b as Vue).$el.classList.contains(POSITION_RIGHT_CSS)).toBeFalsy();
            expect((vm.$refs.c as Vue).$el.classList.contains(POSITION_RIGHT_CSS)).toBeFalsy();

            (vm as any).radiosPosition = MRadioPosition.Right;
            Vue.nextTick(() => {
                expect((vm.$refs.a as Vue).$el.classList.contains(POSITION_RIGHT_CSS)).toBeTruthy();
                expect((vm.$refs.b as Vue).$el.classList.contains(POSITION_RIGHT_CSS)).toBeTruthy();
                expect((vm.$refs.c as Vue).$el.classList.contains(POSITION_RIGHT_CSS)).toBeTruthy();
            });
        });
    });

    it('icon position left', () => {
        let vm: Vue = new Vue({
            template: `
            <div>
                <m-button-group ref="g">
                    <m-radio ref="a" :icon-name="iconName" value="radio1"></m-radio>
                    <m-radio ref="b" value="radio2"></m-radio>
                </m-button-group>
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
            expect(svg).toBeTruthy();
            if (svg) {
                expect(svg.classList.contains(ICON_LEFT_CSS)).toBeTruthy();
            }
        });
    });

    it('icon position right', () => {
        let vm: Vue = new Vue({
            template: `
            <div>
                <m-button-group ref="g">
                    <m-radio ref="a" :icon-name="iconName" :icon-position="iconPosition" value="radio1"></m-radio>
                    <m-radio ref="b" value="radio2"></m-radio>
                </m-button-group>
            </div>`,
            data: {
                iconName: undefined,
                iconPosition: undefined
            }
        }).$mount();

        let svg: SVGSVGElement | null = (vm.$refs.a as Vue).$el.querySelector('svg');
        expect(svg).toBeFalsy();

        (vm as any).iconName = 'chip-error';
        (vm as any).iconPosition = MRadioPosition.Right;
        Vue.nextTick(() => {
            svg = (vm.$refs.a as Vue).$el.querySelector('svg');
            expect(svg).toBeTruthy();
            if (svg) {
                expect(svg.classList.contains(ICON_RIGHT_CSS)).toBeTruthy();
            }
        });
    });

    it('v-model', () => {
        let vm: Vue = new Vue({
            template: `
            <div>
                <m-button-group ref="g" v-model="model" >
                    <m-radio ref="a" value="radio1"></m-radio>
                    <m-radio ref="b" value="radio2"></m-radio>
                </m-button-group>
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
        let changeSpy: jasmine.Spy = jasmine.createSpy('changeSpy');
        let vm: Vue = new Vue({
            data: {
                model: 'radio2'
            },
            template: `
            <div>
                <m-button-group ref="g" v-model="model" @change="onChange">
                    <m-radio ref="a" value="radio1"></m-radio>
                    <m-radio ref="b" value="radio2"></m-radio>
                </m-button-group>
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
