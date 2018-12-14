import { mount, Wrapper } from '@vue/test-utils';
import Vue from 'vue';
import { renderComponent } from '../../../tests/helpers/render';
import { MInputGroup } from '../input-group/input-group';

describe(`MInputGroup`, () => {
    let wrapper: Wrapper<MInputGroup>;
    let legend: string | undefined;
    let errors: string[] | undefined;

    beforeEach(() => {
        legend = undefined;
        errors = undefined;
    });

    const initialiserWrapper: Function = (): void => {
        wrapper = mount(MInputGroup, {
            localVue: Vue,
            propsData: {
                legend,
                errors
            }
        });
    };

    describe(`without content`, () => {
        beforeEach(() => {
            initialiserWrapper();
        });

        it(`will render correctly`, async () => {
            expect(renderComponent(wrapper.vm)).resolves.toMatchSnapshot();
        });
    });

    describe(`with legend`, () => {
        beforeEach(() => {
            legend = 'Some legend';
            initialiserWrapper();
        });

        it(`will render correctly`, async () => {
            expect(renderComponent(wrapper.vm)).resolves.toMatchSnapshot();
        });
    });

    describe(`with errors`, () => {
        beforeEach(() => {
            errors = ['first error', 'second error'];
            initialiserWrapper();
        });

        it(`will render correctly`, async () => {
            expect(renderComponent(wrapper.vm)).resolves.toMatchSnapshot();
        });
    });
});
