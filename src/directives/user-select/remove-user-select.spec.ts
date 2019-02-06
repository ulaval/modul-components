import { mount, Wrapper } from '@vue/test-utils';
import Vue, { VueConstructor } from 'vue';
import { resetModulPlugins } from '../../../tests/helpers/component';
import { ModulVue } from '../../utils/vue/vue';
import RemoveUserSelectPlugin from './remove-user-select';


describe('remove-user-select', () => {
    let localVue: VueConstructor<ModulVue>;

    beforeEach(() => {
        resetModulPlugins();
        Vue.use(RemoveUserSelectPlugin);
    });

    [undefined, true].forEach(param => {
        it(`it should render correctly when binding ${param} is provided`, () => {
            const removeUserSelect: Wrapper<Vue> = mount({
                template: param === undefined ? '<div v-m-remove-user-select></div>' : `<div v-m-remove-user-select="${param}"></div>`
            }, { localVue: Vue });

            const options: any = { preventDefault: () => { } };
            removeUserSelect.trigger('onmouseover', options);

            expect(removeUserSelect.element.style.webkitUserSelect).toBe('none');
            expect(removeUserSelect.element.style.msUserSelect).toBe('none');
            expect(removeUserSelect.element.style.userSelect).toBe('none');
        });
    });

    it('it should render correctly when binding equals false', () => {
        const removeUserSelect: Wrapper<Vue> = mount({
            template: '<div v-m-remove-user-select="false"></div>'
        }, { localVue: Vue });

        const options: any = { preventDefault: () => { } };
        removeUserSelect.trigger('onmouseover', options);

        expect(removeUserSelect.element.style.webkitUserSelect).toBe('');
        expect(removeUserSelect.element.style.msUserSelect).toBeUndefined();
        expect(removeUserSelect.element.style.userSelect).toBeUndefined();
    });
});
