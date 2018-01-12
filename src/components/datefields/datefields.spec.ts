import Vue from 'vue';
import '../../utils/polyfills';
import DateFieldsPlugin, { MDatefields } from './datefields';
import * as moment from 'moment';

const DATEFIELDS_CSS: string = 'm-datefields';
const COMPLETE_CSS: string = 'complete';
const YEAR_DD_CSS: string = 'm-datefields_years';
const MONTH_DD_CSS: string = 'm-datefields_months';
const DATE_DD_CSS: string = 'm-datefields_dates';
const SPINNER_CSS: string = 'm-spinner';

let datefields: MDatefields;

describe('datefields', () => {
    beforeEach(() => {
        spyOn(console, 'error');

        Vue.use(DateFieldsPlugin);
    });

    afterEach(done => {
        Vue.nextTick(() => {
            expect(console.error).not.toHaveBeenCalled();

            done();
        });
    });

    it('css classes are present', () => {
        datefields = new MDatefields().$mount();

        expect(datefields.$el.classList.contains(DATEFIELDS_CSS)).toBeTruthy();
        expect(datefields.$el.classList.contains(COMPLETE_CSS)).toBeFalsy();
    });

    it('All fields selected', () => {
        let dateMoment = moment();

        new Vue({
            template: `<m-datefields v-model="value"></m-datefields>`,
            data: {
                value: dateMoment
            },
            mounted() {
                expect(this.$el.classList.contains(DATEFIELDS_CSS)).toBeTruthy();
                expect(this.$el.classList.contains(COMPLETE_CSS)).toBeTruthy();
            }
        }).$mount();

    });

    it('V-model => Dropdown initialisation', done => {
        let dateUndefined = undefined;
        let dateMoment = moment({ 'year': 1999, 'month': 7, 'date': 12 });
        let dateDate = moment({ 'year': 1999, 'month': 7, 'date': 12 }).toDate();

        new Vue({
            template: `<m-datefields v-model="value"></m-datefields>`,
            data: {
                value: dateUndefined
            },
            mounted() {
                Vue.nextTick(() => {
                    Vue.nextTick(() => {
                        let year = this.$el.querySelector('.' + YEAR_DD_CSS + ' .m-dropdown__input') as HTMLInputElement;
                        let month = this.$el.querySelector('.' + MONTH_DD_CSS + ' .m-dropdown__input') as HTMLInputElement;
                        let date = this.$el.querySelector('.' + DATE_DD_CSS + ' .m-dropdown__input') as HTMLInputElement;
                        expect(year.value).toEqual('');
                        expect(month.value).toEqual('');
                        expect(date.value).toEqual('');

                        done();
                    });
                });
            }
        }).$mount();

        new Vue({
            template: `<m-datefields v-model="value"></m-datefields>`,
            data: {
                value: dateMoment
            },
            mounted() {
                Vue.nextTick(() => {
                    Vue.nextTick(() => {
                        let year = this.$el.querySelector('.' + YEAR_DD_CSS + ' .m-dropdown__input') as HTMLInputElement;
                        let month = this.$el.querySelector('.' + MONTH_DD_CSS + ' .m-dropdown__input') as HTMLInputElement;
                        let date = this.$el.querySelector('.' + DATE_DD_CSS + ' .m-dropdown__input') as HTMLInputElement;
                        expect(year.value).toEqual('1999');
                        expect(month.value).toEqual('August');
                        expect(date.value).toEqual('12');

                        done();
                    });
                });
            }
        }).$mount();

        new Vue({
            template: `<m-datefields v-model="value"></m-datefields>`,
            data: {
                value: dateDate
            },
            mounted() {
                Vue.nextTick(() => {
                    Vue.nextTick(() => {
                        let year = this.$el.querySelector('.' + YEAR_DD_CSS + ' .m-dropdown__input') as HTMLInputElement;
                        let month = this.$el.querySelector('.' + MONTH_DD_CSS + ' .m-dropdown__input') as HTMLInputElement;
                        let date = this.$el.querySelector('.' + DATE_DD_CSS + ' .m-dropdown__input') as HTMLInputElement;
                        expect(year.value).toEqual('1999');
                        expect(month.value).toEqual('August');
                        expect(date.value).toEqual('12');

                        done();
                    });
                });
            }
        }).$mount();
    });

    it('V-model format', done => {
        let dateMoment = moment({ 'year': 1999, 'month': 7, 'date': 12 });
        let dateDate = moment({ 'year': 1999, 'month': 7, 'date': 12 }).toDate();

        new Vue({
            template: `<m-datefields v-model="value"></m-datefields>`,
            data: {
                value: dateMoment
            },
            mounted() {
                Vue.nextTick(() => {
                    Vue.nextTick(() => {
                        expect(dateMoment instanceof Date).toBeFalsy();

                        done();
                    });
                });
            }
        }).$mount();

        new Vue({
            template: `<m-datefields v-model="value"></m-datefields>`,
            data: {
                value: dateDate
            },
            mounted() {
                Vue.nextTick(() => {
                    Vue.nextTick(() => {
                        expect(dateDate instanceof Date).toBeTruthy();

                        done();
                    });
                });
            }
        }).$mount();
    });

    it('disabled prop', done => {
        new Vue({
            template: `<m-datefields></m-datefields>`,
            mounted() {
                let year = this.$el.querySelector('.' + YEAR_DD_CSS + ' .m-dropdown__input') as HTMLInputElement;
                let month = this.$el.querySelector('.' + MONTH_DD_CSS + ' .m-dropdown__input') as HTMLInputElement;
                let date = this.$el.querySelector('.' + DATE_DD_CSS + ' .m-dropdown__input') as HTMLInputElement;
                expect(year.disabled).toBeFalsy();
                expect(month.disabled).toBeFalsy();
                expect(date.disabled).toBeFalsy();
            }
        }).$mount();

        new Vue({
            template: `<m-datefields :disabled="disabled"></m-datefields>`,
            data: {
                disabled: false
            },
            mounted() {
                let year = this.$el.querySelector('.' + YEAR_DD_CSS + ' .m-dropdown__input') as HTMLInputElement;
                let month = this.$el.querySelector('.' + MONTH_DD_CSS + ' .m-dropdown__input') as HTMLInputElement;
                let date = this.$el.querySelector('.' + DATE_DD_CSS + ' .m-dropdown__input') as HTMLInputElement;
                expect(year.disabled).toBeFalsy();
                expect(month.disabled).toBeFalsy();
                expect(date.disabled).toBeFalsy();

                (this as any).disabled = true;
                Vue.nextTick(() => {
                    expect(year.disabled).toBeTruthy();
                    expect(month.disabled).toBeTruthy();
                    expect(date.disabled).toBeTruthy();

                    (this as any).disabled = false;
                    Vue.nextTick(() => {
                        expect(year.disabled).toBeFalsy();
                        expect(month.disabled).toBeFalsy();
                        expect(date.disabled).toBeFalsy();

                        done();
                    });
                });
            }
        }).$mount();
    });

    it('waiting prop', done => {
        new Vue({
            template: `<m-datefields></m-datefields>`,
            mounted() {
                let year = this.$el.querySelector('.' + YEAR_DD_CSS + ' .m-dropdown__input') as HTMLInputElement;
                let month = this.$el.querySelector('.' + MONTH_DD_CSS + ' .m-dropdown__input') as HTMLInputElement;
                let date = this.$el.querySelector('.' + DATE_DD_CSS + ' .m-dropdown__input') as HTMLInputElement;
                let spinner = this.$el.querySelector('.' + SPINNER_CSS) as HTMLElement;
                expect(year.disabled).toBeFalsy();
                expect(month.disabled).toBeFalsy();
                expect(date.disabled).toBeFalsy();
                expect(spinner).toBeNull();

            }
        }).$mount();

        new Vue({
            template: `<m-datefields :waiting="waiting"></m-datefields>`,
            data: {
                waiting: false
            },
            mounted() {
                let year = this.$el.querySelector('.' + YEAR_DD_CSS + ' .m-dropdown__input') as HTMLInputElement;
                let month = this.$el.querySelector('.' + MONTH_DD_CSS + ' .m-dropdown__input') as HTMLInputElement;
                let date = this.$el.querySelector('.' + DATE_DD_CSS + ' .m-dropdown__input') as HTMLInputElement;
                expect(year.disabled).toBeFalsy();
                expect(month.disabled).toBeFalsy();
                expect(date.disabled).toBeFalsy();
                expect(this.$el.querySelector('.' + SPINNER_CSS)).toBeNull();

                (this as any).waiting = true;
                Vue.nextTick(() => {
                    expect(year.disabled).toBeTruthy();
                    expect(month.disabled).toBeTruthy();
                    expect(date.disabled).toBeTruthy();
                    expect(this.$el.querySelector('.' + SPINNER_CSS)).not.toBeNull();

                    (this as any).waiting = false;
                    Vue.nextTick(() => {
                        expect(year.disabled).toBeFalsy();
                        expect(month.disabled).toBeFalsy();
                        expect(date.disabled).toBeFalsy();
                        expect(this.$el.querySelector('.' + SPINNER_CSS)).toBeNull();

                        done();
                    });
                });
            }
        }).$mount();
    });

    it('Remove dropdown', done => {
        new Vue({
            template: `<m-datefields></m-datefields>`,
            mounted() {
                let year = this.$el.querySelector('.' + YEAR_DD_CSS) as HTMLInputElement;
                let month = this.$el.querySelector('.' + MONTH_DD_CSS) as HTMLInputElement;
                let date = this.$el.querySelector('.' + DATE_DD_CSS) as HTMLInputElement;
                expect(year).not.toBeNull();
                expect(month).not.toBeNull();
                expect(date).not.toBeNull();
            }
        }).$mount();

        new Vue({
            template: `<m-datefields :year="year" :month="month" :date="date"></m-datefields>`,
            data: {
                year: true,
                month: true,
                date: true
            },
            mounted() {
                expect(this.$el.querySelector('.' + YEAR_DD_CSS)).not.toBeNull();
                expect(this.$el.querySelector('.' + MONTH_DD_CSS)).not.toBeNull();
                expect(this.$el.querySelector('.' + DATE_DD_CSS)).not.toBeNull();

                (this as any).year = false;
                Vue.nextTick(() => {
                    expect(this.$el.querySelector('.' + YEAR_DD_CSS)).toBeNull();
                    expect(this.$el.querySelector('.' + MONTH_DD_CSS)).not.toBeNull();
                    expect(this.$el.querySelector('.' + DATE_DD_CSS)).not.toBeNull();

                    (this as any).month = false;
                    Vue.nextTick(() => {
                        expect(this.$el.querySelector('.' + YEAR_DD_CSS)).toBeNull();
                        expect(this.$el.querySelector('.' + MONTH_DD_CSS)).toBeNull();
                        expect(this.$el.querySelector('.' + DATE_DD_CSS)).not.toBeNull();

                        (this as any).date = false;
                        Vue.nextTick(() => {
                            expect(this.$el.querySelector('.' + YEAR_DD_CSS)).toBeNull();
                            expect(this.$el.querySelector('.' + MONTH_DD_CSS)).toBeNull();
                            expect(this.$el.querySelector('.' + DATE_DD_CSS)).toBeNull();

                            (this as any).date = true;
                            Vue.nextTick(() => {
                                expect(this.$el.querySelector('.' + YEAR_DD_CSS)).toBeNull();
                                expect(this.$el.querySelector('.' + MONTH_DD_CSS)).toBeNull();
                                expect(this.$el.querySelector('.' + DATE_DD_CSS)).not.toBeNull();

                                done();
                            });
                        });
                    });
                });
            }
        }).$mount();
    });

    it('minYear prop', done => {
        let date = moment({ year: 2000, month: 0, date: 1 });

        let vm = new Vue({
            template: `<m-datefields v-model="date" :minYear="min"></m-datefields>`,
            data: {
                date: date,
                min: 2000
            },
            mounted() {
                Vue.nextTick(() => {
                    Vue.nextTick(() => {
                        expect(this.date).toBeDefined();
                        expect(this.$el.classList.contains(COMPLETE_CSS)).toBeTruthy();

                        this.date = moment({ year: 1999, month: 11, date: 31 });
                        Vue.nextTick(() => {
                            Vue.nextTick(() => {
                                expect(this.$el.classList.contains(COMPLETE_CSS)).toBeFalsy();

                                done();
                            });
                        });
                    });
                });
            }
        }).$mount();
    });

    it('maxYear prop', done => {
        let date = moment({ year: 1999, month: 11, date: 31 });

        let vm = new Vue({
            template: `<m-datefields v-model="date" :maxYear="max"></m-datefields>`,
            data: {
                date: date,
                max: 1999
            },
            mounted() {
                Vue.nextTick(() => {
                    Vue.nextTick(() => {
                        expect(this.date).toBeDefined();
                        expect(this.$el.classList.contains(COMPLETE_CSS)).toBeTruthy();

                        this.date = moment({ year: 2000, month: 0, date: 1 });
                        Vue.nextTick(() => {
                            Vue.nextTick(() => {
                                expect(this.$el.classList.contains(COMPLETE_CSS)).toBeFalsy();

                                done();
                            });
                        });
                    });
                });
            }
        }).$mount();
    });
});
