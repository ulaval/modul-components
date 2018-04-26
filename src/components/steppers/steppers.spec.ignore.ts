import Vue from 'vue';
import '../../utils/polyfills';
import SteppersPlugin, { MSteppers } from './steppers';

let step: MSteppers;

describe('MSteppers', () => {
    beforeEach(() => {
        spyOn(console, 'error');

        Vue.use(SteppersPlugin);
    });

    afterEach(done => {
        Vue.nextTick(() => {
            expect(console.error).not.toHaveBeenCalled();

            done();
        });
    });

    // TODO check how to generate real element with phantom

    // it('default line width', () => {
    //     let vm = new Vue({
    //         template: `<m-steppers>
    //                         <m-steppers-item state="completed">Label 1</m-steppers-item>
    //                         <m-steppers-item state="in-progress">Label 2</m-steppers-item>
    //                         <m-steppers-item state="disabled">Label 3</m-steppers-item>
    //                    </m-steppers>`
    //     }).$mount();

    //     let defaultLine: Element | null = vm.$el.querySelector('.m-steppers__default-line');
    //     expect(defaultLine).toBeTruthy();
    //     if (defaultLine) {
    //         Vue.prototype.$log.log(defaultLine.getAttribute('left'));

    //         expect(defaultLine.clientWidth).toBeGreaterThan(0);
    //         // if (textSlot.textContent) {
    //         //     expect(textSlot.textContent.trim()).toBe('Label'); // inner html = 'Label <!---->', text content skip the comments but keeps space so we trim the string
    //         // }
    //     }
    // });

    // it('selected line width', () => {
    //     let vm = new Vue({
    //         template: `<m-steppers>
    //                         <m-steppers-item state="completed">Label 1</m-steppers-item>
    //                         <m-steppers-item state="in-progress">Label 2</m-steppers-item>
    //                         <m-steppers-item state="disabled">Label 3</m-steppers-item>
    //                    </m-steppers>`
    //     }).$mount();

    //     let selectedLine: Element | null = vm.$el.querySelector('.m-steppers__selected-line');
    //     expect(selectedLine).toBeTruthy();

    //     if (selectedLine) {
    //         Vue.nextTick(() => {
    //             Vue.prototype.$log.log(vm.$el.style.width);
    //             // Vue.prototype.$log.log(selectedLine.clientWidth);
    //             // Vue.prototype.$log.log(vm.$el.style.width);

    //             expect(selectedLine.getAttribute('width')).toBeGreaterThan(0);
    //             // if (textSlot.textContent) {
    //             //     expect(textSlot.textContent.trim()).toBe('Label'); // inner html = 'Label <!---->', text content skip the comments but keeps space so we trim the string
    //             // }
    //         });
    //     }
    // });

});
