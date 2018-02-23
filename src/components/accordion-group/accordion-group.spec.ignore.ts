import Vue from 'vue';
import '../../utils/polyfills';
import AccordionGroupPlugin, { MAccordionGroup } from './accordion-group';
import { MAccordionSkin } from '../accordion/accordion';

const NO_TITLE_CSS: string = 'm--no-title';
const SKIN_LIGHT_CSS: string = 'm--is-light';
const SKIN_REGULAR_CSS: string = 'm--is-regular';
const SKIN_PLAIN_CSS: string = 'm--is-plain';

let accordionGroup: MAccordionGroup;

describe('accordion-group', () => {
    beforeEach(() => {
        Vue.use(AccordionGroupPlugin);
    });

    it('css classes are present', () => {
        accordionGroup = new MAccordionGroup().$mount();
        expect(accordionGroup.$el.querySelector('.' + NO_TITLE_CSS)).not.toBeNull();
    });

    it('skin prop', () => {
        new Vue({
            template: `
            <m-accordion-group>
                <m-accordion></m-accordion>
                <m-accordion></m-accordion>
                <m-accordion></m-accordion>
            </m-accordion-group>`,
            mounted(): void {
                expect(this.$el.querySelector('.' + SKIN_LIGHT_CSS)).toBeNull();
                expect(this.$el.querySelector('.' + SKIN_REGULAR_CSS)).not.toBeNull();
                expect(this.$el.querySelector('.' + SKIN_PLAIN_CSS)).toBeNull();
            }
        }).$mount();

        new Vue({
            template: `
            <m-accordion-group :skin="skin">
                <m-accordion></m-accordion>
                <m-accordion></m-accordion>
                <m-accordion></m-accordion>
            </m-accordion-group>`,
            data: {
                skin: MAccordionSkin.Light
            },
            mounted(): void {
                expect(this.$el.querySelector('.' + SKIN_LIGHT_CSS)).not.toBeNull();
                expect(this.$el.querySelector('.' + SKIN_REGULAR_CSS)).toBeNull();
                expect(this.$el.querySelector('.' + SKIN_PLAIN_CSS)).toBeNull();

                (this as any).skin = MAccordionSkin.Regular;
                Vue.nextTick(() => {
                    expect(this.$el.querySelector('.' + SKIN_LIGHT_CSS)).toBeNull();
                    expect(this.$el.querySelector('.' + SKIN_REGULAR_CSS)).not.toBeNull();
                    expect(this.$el.querySelector('.' + SKIN_PLAIN_CSS)).toBeNull();

                    (this as any).skin = MAccordionSkin.Plain;
                    Vue.nextTick(() => {
                        expect(this.$el.querySelector('.' + SKIN_LIGHT_CSS)).toBeNull();
                        expect(this.$el.querySelector('.' + SKIN_REGULAR_CSS)).toBeNull();
                        expect(this.$el.querySelector('.' + SKIN_PLAIN_CSS)).not.toBeNull();
                    });
                });
            }
        }).$mount();
    });

    it('concurrent prop', () => {
        new Vue({
            template: `
            <m-accordion-group>
                <m-accordion></m-accordion>
                <m-accordion></m-accordion>
                <m-accordion></m-accordion>
            </m-accordion-group>`,
            mounted(): void {
                Vue.nextTick(() => {
                    expect(this.$el.querySelector('.m-link')).not.toBeNull();
                });
            }
        }).$mount();

        new Vue({
            template: `
            <m-accordion-group :concurrent="concurrent">
                <m-accordion></m-accordion>
                <m-accordion></m-accordion>
                <m-accordion></m-accordion>
            </m-accordion-group>`,
            data: {
                concurrent: true
            },
            mounted(): void {
                Vue.nextTick(() => {
                    expect(this.$el.querySelector('.m-link')).toBeNull();

                    (this as any).concurrent = false;
                    Vue.nextTick(() => {
                        expect(this.$el.querySelector('.m-link')).not.toBeNull();
                    });
                });
            }
        }).$mount();
    });

    it('value prop', () => {
        let vm = new Vue({
            template: `
            <div>
                <m-accordion-group ref="a" :value.sync="model">
                    <m-accordion id="1"></m-accordion>
                    <m-accordion id="2"></m-accordion>
                    <m-accordion id="3"></m-accordion>
                </m-accordion-group>
            </div>`,
            data: {
                model: []
            }
        }).$mount();

        expect((vm.$refs.a as Vue).$el.querySelectorAll('.m-accordion__body-wrap').length).toEqual(0);
        Vue.nextTick(() => {
            expect((vm.$refs.a as Vue).$el.querySelectorAll('.m-link').length).toEqual(1);

            (vm as any).model = ['1'];
            Vue.nextTick(() => {
                expect((vm.$refs.a as Vue).$el.querySelectorAll('.m-accordion__body-wrap').length).toEqual(1);
                expect((vm.$refs.a as Vue).$el.querySelectorAll('.m-link').length).toEqual(2);

                (vm as any).model = ['1', '2'];
                Vue.nextTick(() => {
                    expect((vm.$refs.a as Vue).$el.querySelectorAll('.m-accordion__body-wrap').length).toEqual(2);
                    expect((vm.$refs.a as Vue).$el.querySelectorAll('.m-link').length).toEqual(2);

                    (vm as any).model = ['1', '2', '3'];
                    Vue.nextTick(() => {
                        expect((vm.$refs.a as Vue).$el.querySelectorAll('.m-accordion__body-wrap').length).toEqual(3);
                        expect((vm.$refs.a as Vue).$el.querySelectorAll('.m-link').length).toEqual(1);
                    });
                });
            });
        });
    });

    it('title slot', () => {
        let vm = new Vue({
            template: `
            <div>
                <m-accordion-group ref="a">
                    <div slot="title">Title</div>
                    <m-accordion></m-accordion>
                    <m-accordion></m-accordion>
                </m-accordion-group>
            </div>`
        }).$mount();

        expect((vm.$refs.a as Vue).$el.querySelector('.' + NO_TITLE_CSS)).toBeNull();
    });
});
