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
        Vue.nextTick(() => {
            let wrap: Element = spinner.$refs.spinnerWrap as Element;

            expect(wrap.classList.contains(MODE_PROCESSING_CSS)).toBeFalsy();
            expect(wrap.classList.contains(SKIN_DARK_CSS)).toBeFalsy();
            expect(wrap.classList.contains(SKIN_LIGHT_CSS)).toBeFalsy();
            expect(wrap.classList.contains(SKIN_LIGHTER_CSS)).toBeFalsy();
        });
    });

    it('title prop', () => {
        Vue.nextTick(() => {
            const titleClass: string = '.m-spinner__title';
            let title: HTMLElement = spinner.$el.querySelector(titleClass) as HTMLElement;
            expect(title).toBeFalsy();

            spinner.title = 'test';
            Vue.nextTick(() => {
                // don't know why (probably portal) but we need two cycles
                Vue.nextTick(() => {
                    title = spinner.$el.querySelector(titleClass) as HTMLElement;
                    expect(title).toBeTruthy();
                    expect(title.innerText).toBe('test');
                });
            });
        });
    });

    it('description prop', () => {
        Vue.nextTick(() => {
            const descClass: string = '.m-spinner__description';
            let desc: HTMLElement = spinner.$el.querySelector(descClass) as HTMLElement;
            expect(desc).toBeFalsy();

            spinner.description = 'desc';
            Vue.nextTick(() => {
                // portal
                Vue.nextTick(() => {
                    desc = spinner.$el.querySelector(descClass) as HTMLElement;
                    expect(desc).toBeTruthy();
                    expect(desc.innerText).toBe('desc');
                });
            });
        });
    });

    describe('skin prop', () => {
        it('dark', () => {
            Vue.nextTick(() => {
                let wrap: Element = spinner.$refs.spinnerWrap as Element;
                expect(wrap).toBeTruthy();
                expect(wrap.classList.contains(SKIN_DARK_CSS)).toBeFalsy();

                spinner.skin = MSpinnerStyle.Dark;
                Vue.nextTick(() => {
                    // portal
                    Vue.nextTick(() => {
                        expect(wrap.classList.contains(SKIN_DARK_CSS)).toBeTruthy();
                    });
                });
            });
        });

        it('light', () => {
            Vue.nextTick(() => {
                let wrap: Element = spinner.$refs.spinnerWrap as Element;
                expect(wrap).toBeTruthy();
                expect(wrap.classList.contains(SKIN_LIGHT_CSS)).toBeFalsy();

                spinner.skin = MSpinnerStyle.Light;
                Vue.nextTick(() => {
                    // portal
                    Vue.nextTick(() => {
                        expect(wrap.classList.contains(SKIN_LIGHT_CSS)).toBeTruthy();
                    });
                });
            });
        });

        it('lighter', () => {
            Vue.nextTick(() => {
                let wrap: Element = spinner.$refs.spinnerWrap as Element;
                expect(wrap).toBeTruthy();
                expect(wrap.classList.contains(SKIN_LIGHTER_CSS)).toBeFalsy();

                spinner.skin = MSpinnerStyle.Lighter;
                Vue.nextTick(() => {
                    // portal
                    Vue.nextTick(() => {
                        expect(wrap.classList.contains(SKIN_LIGHTER_CSS)).toBeTruthy();
                    });
                });
            });
        });

        it('regular', () => {
            Vue.nextTick(() => {
                let wrap: Element = spinner.$refs.spinnerWrap as Element;
                expect(wrap).toBeTruthy();
                expect(wrap.classList.contains(SKIN_DARK_CSS)).toBeFalsy();
                expect(wrap.classList.contains(SKIN_LIGHT_CSS)).toBeFalsy();
                expect(wrap.classList.contains(SKIN_LIGHTER_CSS)).toBeFalsy();

                spinner.skin = MSpinnerStyle.Regular;
                Vue.nextTick(() => {
                    // portal
                    Vue.nextTick(() => {
                        expect(wrap.classList.contains(SKIN_DARK_CSS)).toBeFalsy();
                        expect(wrap.classList.contains(SKIN_LIGHT_CSS)).toBeFalsy();
                        expect(wrap.classList.contains(SKIN_LIGHTER_CSS)).toBeFalsy();
                    });
                });
            });
        });
    });

    describe('size prop', () => {
        it('small', () => {
            Vue.nextTick(() => {
                const iconClass: string = '.m-spinner__icon';
                let icon: Element = spinner.$el.querySelector(iconClass) as Element;
                expect(icon).toBeTruthy();
                expect(icon.classList.contains(SIZE_SMALL_CSS)).toBeFalsy();

                spinner.size = MSpinnerSize.Small;
                Vue.nextTick(() => {
                    // portal
                    Vue.nextTick(() => {
                        expect(icon.classList.contains(SIZE_SMALL_CSS)).toBeTruthy();
                    });
                });
            });
        });

        it('large', () => {
            Vue.nextTick(() => {
                const iconClass: string = '.m-spinner__icon';
                let icon: Element = spinner.$el.querySelector(iconClass) as Element;
                expect(icon).toBeTruthy();
                expect(icon.classList.contains(SIZE_SMALL_CSS)).toBeFalsy();

                spinner.size = MSpinnerSize.Large;
                Vue.nextTick(() => {
                    // portal
                    Vue.nextTick(() => {
                        expect(icon.classList.contains(SIZE_SMALL_CSS)).toBeFalsy();
                    });
                });
            });
        });
    });
});
