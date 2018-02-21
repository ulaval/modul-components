import Vue from 'vue';
import '../../utils/polyfills';
import DatepickerPlugin, { MDatepicker } from './datepicker';
import * as moment from 'moment';

const DATEPICKER_CSS: string = 'm-datepicker';
const TEXT_FIELD_CSS: string = 'm-textfield';
const TEXT_FIELD_INPUT_CSS: string = 'm-textfield__input';
const VALIDATION_MESSAGE_TEXT_CSS: string = 'm-validation-message__text';

let datepicker: MDatepicker;

describe('datepicker', () => {
    Vue.use(DatepickerPlugin);

    it('css classes are present', () => {
        new Vue({
            template: `<m-datepicker></m-datepicker>`,
            mounted() {
                expect(this.$el.classList.contains(DATEPICKER_CSS)).toBeTruthy();
                expect(this.$el.querySelector('.' + TEXT_FIELD_CSS)).not.toBeNull();
            }
        }).$mount();
    });

    it('format prop', () => {
        let date = moment();

        new Vue({
            template: `<m-datepicker v-model="value"></m-datepicker>`,
            data: {
                value: date
            },
            mounted() {
                let input = this.$el.querySelector('.' + TEXT_FIELD_INPUT_CSS) as HTMLInputElement;
                expect(input.value).toEqual(date.format('YYYY/MM/DD'));
            }
        }).$mount();

        new Vue({
            template: `<m-datepicker v-model="value" :format="format"></m-datepicker>`,
            data: {
                value: date,
                format: 'lll'
            },
            mounted() {
                let input = this.$el.querySelector('.' + TEXT_FIELD_INPUT_CSS) as HTMLInputElement;
                expect(input.value).toEqual(date.format('lll'));
            }
        }).$mount();
    });

    it('disabled prop', () => {
        new Vue({
            template: `<m-datepicker></m-datepicker>`,
            mounted() {
                let input = this.$el.querySelector('.' + TEXT_FIELD_INPUT_CSS) as HTMLInputElement;
                expect(input.disabled).toBeFalsy();
            }
        }).$mount();

        new Vue({
            template: `<m-datepicker :disabled="disabled"></m-datepicker>`,
            data: {
                disabled: false
            },
            mounted() {
                let input = this.$el.querySelector('.' + TEXT_FIELD_INPUT_CSS) as HTMLInputElement;
                expect(input.disabled).toBeFalsy();

                (this as any).disabled = true;
                Vue.nextTick(() => {
                    expect(input.disabled).toBeTruthy();

                    (this as any).disabled = false;
                    Vue.nextTick(() => {
                        expect(input.disabled).toBeFalsy();
                    });
                });
            }
        }).$mount();
    });

    it('required prop', () => {
        new Vue({
            template: `<m-datepicker v-model="value"></m-datepicker>`,
            data: {
                value: ''
            },
            mounted() {
                let input = this.$el.querySelector('.' + TEXT_FIELD_INPUT_CSS) as HTMLInputElement;
                input.blur();
                Vue.nextTick(() => {
                    expect(this.$el.querySelector('.' + VALIDATION_MESSAGE_TEXT_CSS)).toBeNull();
                });
            }
        }).$mount();

        // new Vue({
        //     template: `<m-datepicker v-model="value" :required="required"></m-datepicker>`,
        //     data: {
        //         value: '',
        //         required: true
        //     },
        //     mounted() {
        //         let input = this.$el.querySelector('.' + TEXT_FIELD_INPUT_CSS) as HTMLInputElement;
        //         input.blur();

        //         Vue.nextTick(() => {
        //             expect(this.$el.querySelector('.' + VALIDATION_MESSAGE_TEXT_CSS)).not.toBeNull();

        //             (this as any).required = false;
        //             input.blur();
        //             Vue.nextTick(() => {
        //                 expect(this.$el.querySelector('.' + VALIDATION_MESSAGE_TEXT_CSS)).toBeNull();
        //             });
        //         });
        //     }
        // }).$mount();
    });

    it('min prop', () => {
        let date = moment();

        let vm = new Vue({
            template: `<m-datepicker v-model="value" :min="min"></m-datepicker>`,
            data: {
                value: date,
                min: date.add(1, 'day')
            },
            mounted() {
                let input = this.$el.querySelector('.' + TEXT_FIELD_INPUT_CSS) as HTMLInputElement;
                expect((this as any).value.isSame((this as any).min, 'day')).toBeTruthy();
            }
        }).$mount();
    });

    it('max prop', () => {
        let date = moment();

        let vm = new Vue({
            template: `<m-datepicker v-model="value" :max="max"></m-datepicker>`,
            data: {
                value: date,
                max: date.subtract(1, 'day')
            },
            mounted() {
                let input = this.$el.querySelector('.' + TEXT_FIELD_INPUT_CSS) as HTMLInputElement;
                expect((this as any).value.isSame((this as any).max, 'day')).toBeTruthy();
            }
        }).$mount();
    });
});
