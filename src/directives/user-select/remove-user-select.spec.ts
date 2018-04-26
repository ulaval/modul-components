import { resetModulPlugins } from '../../../tests/helpers/component';
import Vue, { VueConstructor } from 'vue';
import { ModulVue } from '../../utils/vue/vue';
import { Wrapper, mount } from '@vue/test-utils';
import RemoveUserSelectPlugin from './remove-user-select';

describe('remove-user-select', () => {
    let localVue: VueConstructor<ModulVue>;

    beforeEach(() => {
        resetModulPlugins();
        Vue.use(RemoveUserSelectPlugin);
    });

    [undefined, true].forEach(param => {
        it(`it should render correctly when binding ${param} is provided`, () => {
            const removeUserSelect = mount({
                template: param === undefined ? '<div v-m-remove-user-select></div>' : `<div v-m-remove-user-select="${param}"></div>`
            }, { localVue: Vue });

            const options = { preventDefault: () => {} };
            jest.spyOn(options, 'preventDefault');
            removeUserSelect.trigger('onmouseover', options);

            expect(options.preventDefault).toHaveBeenCalled();
            expect(removeUserSelect.element.style.webkitUserSelect).toBe('none');
            expect(removeUserSelect.element.style.msUserSelect).toBe('none');
            expect(removeUserSelect.element.style.userSelect).toBe('none');
        });
    });

    it('it should render correctly when binding equals false', () => {
        const removeUserSelect = mount({
            template: '<div v-m-remove-user-select="false"></div>'
        }, { localVue: Vue });

        const options = { preventDefault: () => {} };
        jest.spyOn(options, 'preventDefault');
        removeUserSelect.trigger('onmouseover', options);

        expect(options.preventDefault).toHaveBeenCalledTimes(0);
        expect(removeUserSelect.element.style.webkitUserSelect).toBe('');
        expect(removeUserSelect.element.style.msUserSelect).toBeUndefined();
        expect(removeUserSelect.element.style.userSelect).toBeUndefined();
    });
});
