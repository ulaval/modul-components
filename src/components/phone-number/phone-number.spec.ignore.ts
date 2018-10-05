// import Vue from 'vue';
// import '../../utils/polyfills';
// import SpinnerPlugin, { MSpinner, MSpinnerStyle, MSpinnerSize, PROCESSING_WARN } from './spinner';
// import { SPINNER_NAME } from '../component-names';

// export const SPINNER_CLASS: string = '.m-spinner';

// describe('MSpinnerStyle', () => {
//     it('validates enum', () => {
//         expect(MSpinnerStyle.Regular).toEqual('regular');
//         expect(MSpinnerStyle.Dark).toEqual('dark');
//         expect(MSpinnerStyle.Light).toEqual('light');
//         expect(MSpinnerStyle.Lighter).toEqual('lighter');
//     });
// });

// describe('MSpinnerSize', () => {
//     it('validates enum', () => {
//         expect(MSpinnerSize.Small).toEqual('small');
//         expect(MSpinnerSize.Large).toEqual('large');
//     });
// });

// describe('spinner', () => {
//     const MODE_PROCESSING_CSS: string = 'm--is-processing';
//     const SKIN_DARK_CSS: string = 'm--is-dark';
//     const SKIN_LIGHT_CSS: string = 'm--is-light';
//     const SKIN_LIGHTER_CSS: string = 'm--is-lighter';
//     const SIZE_SMALL_CSS: string = 'm--is-small';

//     const BACKDROP_QUERY: string = '.m-backdrop';

//     let spinner: MSpinner;

//     beforeEach(() => {
//         spyOn(console, 'error');

//         Vue.use(SpinnerPlugin);
//     });

//     afterEach(done => {
//         document.body.innerHTML = '';

//         Vue.nextTick(() => {
//             expect(console.error).not.toHaveBeenCalled();

//             done();
//         });
//     });

//     it('css class for spinner are not present', done => {
//         spinner = new MSpinner().$mount();
//         Vue.nextTick(() => {
//             let wrap: Element = spinner.$refs.spinnerWrap as Element;

//             expect(wrap.classList.contains(MODE_PROCESSING_CSS)).toBeFalsy();
//             expect(wrap.classList.contains(SKIN_DARK_CSS)).toBeFalsy();
//             expect(wrap.classList.contains(SKIN_LIGHT_CSS)).toBeFalsy();
//             expect(wrap.classList.contains(SKIN_LIGHTER_CSS)).toBeFalsy();

//             expect(document.body.querySelector(BACKDROP_QUERY)).toBeFalsy();

//             done();
//         });
//     });

//     it('title prop', done => {
//         spinner = new MSpinner().$mount();
//         Vue.nextTick(() => {
//             const titleClass: string = '.m-spinner__title';
//             let title: HTMLElement = spinner.$el.querySelector(titleClass) as HTMLElement;
//             expect(title).toBeFalsy();

//             spinner.title = true;
//             Vue.nextTick(() => {
//                 // don't know why (probably portal) but we need two cycles
//                 Vue.nextTick(() => {
//                     title = spinner.$el.querySelector(titleClass) as HTMLElement;
//                     expect(title).toBeTruthy();
//                     done();
//                 });
//             });
//         });
//     });

//     it('titleMessage prop', done => {
//         spinner = new MSpinner().$mount();
//         Vue.nextTick(() => {
//             const titleClass: string = '.m-spinner__title';
//             let title: HTMLElement = spinner.$el.querySelector(titleClass) as HTMLElement;
//             expect(title).toBeFalsy();

//             spinner.titleMessage = 'title';
//             Vue.nextTick(() => {
//                 // don't know why (probably portal) but we need two cycles
//                 Vue.nextTick(() => {
//                     title = spinner.$el.querySelector(titleClass) as HTMLElement;
//                     expect(title).toBeTruthy();
//                     expect(title.innerText).toBe('title');
//                     done();
//                 });
//             });
//         });
//     });

//     it('description prop', done => {
//         spinner = new MSpinner().$mount();
//         Vue.nextTick(() => {
//             const descClass: string = '.m-spinner__description';
//             let desc: HTMLElement = spinner.$el.querySelector(descClass) as HTMLElement;
//             expect(desc).toBeFalsy();

//             spinner.description = true;
//             Vue.nextTick(() => {
//                 // portal
//                 Vue.nextTick(() => {
//                     desc = spinner.$el.querySelector(descClass) as HTMLElement;
//                     expect(desc).toBeTruthy();
//                     done();
//                 });
//             });
//         });
//     });

//     it('descriptionMessage prop', done => {
//         spinner = new MSpinner().$mount();
//         Vue.nextTick(() => {
//             const descClass: string = '.m-spinner__description';
//             let desc: HTMLElement = spinner.$el.querySelector(descClass) as HTMLElement;
//             expect(desc).toBeFalsy();

//             spinner.descriptionMessage = 'desc';
//             Vue.nextTick(() => {
//                 // portal
//                 Vue.nextTick(() => {
//                     desc = spinner.$el.querySelector(descClass) as HTMLElement;
//                     expect(desc).toBeTruthy();
//                     expect(desc.innerText).toBe('desc');

//                     done();
//                 });
//             });
//         });
//     });

//     describe('skin prop', () => {
//         beforeEach(() => {
//             spinner = new MSpinner().$mount();
//         });

//         it('dark', done => {
//             Vue.nextTick(() => {
//                 let wrap: Element = spinner.$refs.spinnerWrap as Element;
//                 expect(wrap).toBeTruthy();
//                 expect(wrap.classList.contains(SKIN_DARK_CSS)).toBeFalsy();

//                 spinner.skin = MSpinnerStyle.Dark;
//                 Vue.nextTick(() => {
//                     // portal
//                     Vue.nextTick(() => {
//                         expect(wrap.classList.contains(SKIN_DARK_CSS)).toBeTruthy();

//                         done();
//                     });
//                 });
//             });
//         });

//         it('light', done => {
//             Vue.nextTick(() => {
//                 let wrap: Element = spinner.$refs.spinnerWrap as Element;
//                 expect(wrap).toBeTruthy();
//                 expect(wrap.classList.contains(SKIN_LIGHT_CSS)).toBeFalsy();

//                 spinner.skin = MSpinnerStyle.Light;
//                 Vue.nextTick(() => {
//                     // portal
//                     Vue.nextTick(() => {
//                         expect(wrap.classList.contains(SKIN_LIGHT_CSS)).toBeTruthy();

//                         done();
//                     });
//                 });
//             });
//         });

//         it('lighter', done => {
//             Vue.nextTick(() => {
//                 let wrap: Element = spinner.$refs.spinnerWrap as Element;
//                 expect(wrap).toBeTruthy();
//                 expect(wrap.classList.contains(SKIN_LIGHTER_CSS)).toBeFalsy();

//                 spinner.skin = MSpinnerStyle.Lighter;
//                 Vue.nextTick(() => {
//                     // portal
//                     Vue.nextTick(() => {
//                         expect(wrap.classList.contains(SKIN_LIGHTER_CSS)).toBeTruthy();

//                         done();
//                     });
//                 });
//             });
//         });

//         it('regular', done => {
//             Vue.nextTick(() => {
//                 let wrap: Element = spinner.$refs.spinnerWrap as Element;
//                 expect(wrap).toBeTruthy();
//                 expect(wrap.classList.contains(SKIN_DARK_CSS)).toBeFalsy();
//                 expect(wrap.classList.contains(SKIN_LIGHT_CSS)).toBeFalsy();
//                 expect(wrap.classList.contains(SKIN_LIGHTER_CSS)).toBeFalsy();

//                 spinner.skin = MSpinnerStyle.Regular;
//                 Vue.nextTick(() => {
//                     // portal
//                     Vue.nextTick(() => {
//                         expect(wrap.classList.contains(SKIN_DARK_CSS)).toBeFalsy();
//                         expect(wrap.classList.contains(SKIN_LIGHT_CSS)).toBeFalsy();
//                         expect(wrap.classList.contains(SKIN_LIGHTER_CSS)).toBeFalsy();

//                         done();
//                     });
//                 });
//             });
//         });
//     });

//     describe('size prop', () => {
//         beforeEach(() => {
//             spinner = new MSpinner().$mount();
//         });

//         it('small', done => {
//             Vue.nextTick(() => {
//                 const iconClass: string = '.m-spinner__icon';
//                 let icon: Element = spinner.$el.querySelector(iconClass) as Element;
//                 expect(icon).toBeTruthy();
//                 expect(icon.classList.contains(SIZE_SMALL_CSS)).toBeFalsy();

//                 spinner.size = MSpinnerSize.Small;
//                 Vue.nextTick(() => {
//                     // portal
//                     Vue.nextTick(() => {
//                         expect(icon.classList.contains(SIZE_SMALL_CSS)).toBeTruthy();

//                         done();
//                     });
//                 });
//             });
//         });

//         it('large', done => {
//             Vue.nextTick(() => {
//                 const iconClass: string = '.m-spinner__icon';
//                 let icon: Element = spinner.$el.querySelector(iconClass) as Element;
//                 expect(icon).toBeTruthy();
//                 expect(icon.classList.contains(SIZE_SMALL_CSS)).toBeFalsy();

//                 spinner.size = MSpinnerSize.Large;
//                 Vue.nextTick(() => {
//                     // portal
//                     Vue.nextTick(() => {
//                         expect(icon.classList.contains(SIZE_SMALL_CSS)).toBeFalsy();

//                         done();
//                     });
//                 });
//             });
//         });
//     });

//     describe('processing prop', () => {
//         it('should warn if set while visible', done => {
//             spinner = new MSpinner().$mount();
//             spyOn(console, 'warn');
//             Vue.nextTick(() => {
//                 let wrap: Element = spinner.$refs.spinnerWrap as Element;
//                 expect(wrap).toBeTruthy();
//                 expect(wrap.classList.contains(MODE_PROCESSING_CSS)).toBeFalsy();

//                 spinner.processing = true;
//                 Vue.nextTick(() => {
//                     // portal
//                     Vue.nextTick(() => {
//                         const warn: string = `<${SPINNER_NAME}>: ${PROCESSING_WARN}`;
//                         expect(Vue.prototype.$log.warn).toHaveBeenCalledWith(warn);

//                         done();
//                     });
//                 });
//             });
//         });

//         it('should warn if set while visible of not (v-show)', done => {
//             spyOn(console, 'warn');
//             let vm = new Vue({
//                 data: {
//                     processing: false,
//                     visible: true
//                 },
//                 template: `<m-spinner :processing="processing" v-show="visible"></m-spinner>`
//             }).$mount();

//             Vue.nextTick(() => {
//                 (vm as any).visible = false;
//                 Vue.nextTick(() => {
//                     (vm as any).processing = true;
//                     Vue.nextTick(() => {
//                         (vm as any).visible = true;
//                         Vue.nextTick(() => {
//                             const warn: string = `<${SPINNER_NAME}>: ${PROCESSING_WARN}`;
//                             expect(Vue.prototype.$log.warn).toHaveBeenCalledWith(warn);

//                             done();
//                         });
//                     });
//                 });
//             });
//         });

//         it('can be set while not visible (v-if)', done => {
//             spyOn(console, 'warn');
//             let vm = new Vue({
//                 data: {
//                     processing: false,
//                     visible: false
//                 },
//                 template: `<m-spinner :processing="processing" v-if="visible"></m-spinner>`
//             }).$mount();

//             Vue.nextTick(() => {
//                 (vm as any).visible = false;
//                 Vue.nextTick(() => {
//                     (vm as any).dialog = true;
//                     Vue.nextTick(() => {
//                         (vm as any).visible = true;
//                         Vue.nextTick(() => {
//                             const warn: string = `<${SPINNER_NAME}>: ${PROCESSING_WARN}`;
//                             expect(Vue.prototype.$log.warn).not.toHaveBeenCalledWith(warn);

//                             done();
//                         });
//                     });
//                 });
//             });
//         });

//         it('css', done => {
//             let vm = new Vue({
//                 data: {
//                     processing: true
//                 },
//                 template: `<m-spinner :processing="processing"></m-spinner>`
//             }).$mount();

//             Vue.nextTick(() => {
//                 let wrap: Element | null = document.body.querySelector('.m-spinner__wrap');
//                 expect(wrap).toBeTruthy();
//                 if (wrap) {
//                     expect(wrap.classList.contains(MODE_PROCESSING_CSS)).toBeTruthy();
//                 }

//                 done();
//             });
//         });
//     });
// });
