import Vue from 'vue';
import '../../utils/polyfills';
import { MRadio } from './radio';

let radio: MRadio;

describe('radio', () => {
    beforeEach(() => {
        radio = new MRadio().$mount();
    });

    it('sets radioID on the input and label elements', () => {
        let input: HTMLInputElement | null = radio.$el.querySelector('input');
        let label: HTMLLabelElement | null = radio.$el.querySelector('label');
        expect(input).toBeTruthy();
        expect(label).toBeTruthy();
        if (input) {
            expect(input.id).toEqual(radio.radioID);
        }
        if (label) {
            expect(label.htmlFor).toEqual(radio.radioID);
        }
    });

    it('handles enabled prop', () => {
        expect(radio.$el.classList.contains('m--is-disabled')).toBeFalsy();

        radio.enabled = false;
        Vue.nextTick(() => {
            expect(radio.$el.classList.contains('m--is-disabled')).toBeTruthy();

            radio.enabled = true;
            Vue.nextTick(() => {
                expect(radio.$el.classList.contains('m--is-disabled')).toBeFalsy();
            });
        });
    });
});
