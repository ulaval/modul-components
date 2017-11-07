import Vue from 'vue';
import '../../utils/polyfills';
import SpinnerPlugin, { MSpinner, MSpinnerStyle, MSpinnerSize } from './spinner';

const MODE_LOADING_CSS: string = 'm--is-loading';
const MODE_PROCESSING_CSS: string = 'm--is-processing';
const SKIN_DARK_CSS: string = 'm--is-dark';
const SKIN_LIGHT_CSS: string = 'm--is-light';
const SKIN_LIGHTER_CSS: string = 'm--is-lighter';
const SIZE_SMALL_CSS: string = 'm--is-small';

let spinner: MSpinner;

describe('MSpinnerStyle', () => {
    it('validates enum', () => {
        expect(MSpinnerStyle.Regular).toEqual('regular');
        expect(MSpinnerStyle.Dark).toEqual('dark');
        expect(MSpinnerStyle.Light).toEqual('light');
        expect(MSpinnerStyle.Lighter).toEqual('lighter');
    });
});

describe('MSpinnerSize', () => {
    it('validates enum', () => {
        expect(MSpinnerSize.Small).toEqual('small');
        expect(MSpinnerSize.Large).toEqual('large');
    });
});

describe('spinner', () => {
    beforeEach(() => {
        Vue.use(SpinnerPlugin);
        spinner = new MSpinner().$mount();
    });

    it('css class for spinner are not present', () => {
        let wrap: Element | null = (spinner as Vue).$el.querySelector('m-spinner__wrap');
        if (wrap) {
            expect(wrap.classList.contains(MODE_PROCESSING_CSS)).toBeFalsy();
            expect(wrap.classList.contains(SKIN_DARK_CSS)).toBeFalsy();
            expect(wrap.classList.contains(SKIN_LIGHT_CSS)).toBeFalsy();
            expect(wrap.classList.contains(SKIN_LIGHTER_CSS)).toBeFalsy();
        }
    });

    it('skin prop', () => {
        let wrap: Element | null = (spinner as Vue).$el.querySelector('m-spinner__wrap');
        if (wrap) {
            expect(wrap.classList.contains(SKIN_DARK_CSS)).toBeFalsy();
            expect(wrap.classList.contains(SKIN_LIGHT_CSS)).toBeFalsy();
            expect(wrap.classList.contains(SKIN_LIGHTER_CSS)).toBeFalsy();
        }
        spinner.skin = MSpinnerStyle.Dark;
        Vue.nextTick(() => {
            let wrap: Element | null = (spinner as Vue).$el.querySelector('m-spinner__wrap');
            if (wrap) {
                expect(wrap.classList.contains(SKIN_DARK_CSS)).toBeTruthy();
            }
            spinner.skin = MSpinnerStyle.Light;
            Vue.nextTick(() => {
                if (wrap) {
                    expect(wrap.classList.contains(SKIN_LIGHT_CSS)).toBeTruthy();
                }
                spinner.skin = MSpinnerStyle.Lighter;
                Vue.nextTick(() => {
                    if (wrap) {
                        expect(wrap.classList.contains(SKIN_LIGHTER_CSS)).toBeTruthy();
                    }
                    spinner.skin = MSpinnerStyle.Regular;
                    Vue.nextTick(() => {
                        if (wrap) {
                            expect(wrap.classList.contains(SKIN_DARK_CSS)).toBeFalsy();
                            expect(wrap.classList.contains(SKIN_LIGHT_CSS)).toBeFalsy();
                            expect(wrap.classList.contains(SKIN_LIGHTER_CSS)).toBeFalsy();
                        }
                    });
                });
            });
        });
    });

    it('size prop', () => {
        let spinnerIcon: Element | null = (spinner as Vue).$el.querySelector('m-spinner__icon');
        if (spinnerIcon) {
            expect(spinnerIcon.classList.contains(SIZE_SMALL_CSS)).toBeFalsy();
        }
        spinner.size = MSpinnerSize.Small;
        Vue.nextTick(() => {
            if (spinnerIcon) {
                expect(spinnerIcon.classList.contains(SIZE_SMALL_CSS)).toBeTruthy();
            }
            spinner.size = MSpinnerSize.Small;
            Vue.nextTick(() => {
                if (spinnerIcon) {
                    expect(spinnerIcon.classList.contains(SIZE_SMALL_CSS)).toBeFalsy();
                }
            });
        });
    });

});
