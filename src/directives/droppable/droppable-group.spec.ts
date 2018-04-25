import Vue, { VueConstructor } from 'vue';
import { Wrapper, mount } from '@vue/test-utils';
import { ModulVue } from '../../utils/vue/vue';
import { MDOMPlugin } from '../domPlugin';
import DroppableGroupPlugin, { MDroppableGroup } from '../droppable/droppable-group';
import { resetModulPlugins } from '../../../tests/helpers/component';
import RemoveUserSelectPlugin from '../user-select/remove-user-select';

describe('droppable-group', () => {
    let localVue: VueConstructor<ModulVue>;

    beforeEach(() => {
        resetModulPlugins();
        Vue.use(DroppableGroupPlugin);
        Vue.use(RemoveUserSelectPlugin);
    });

    it('it should make group resolvable from child element', () => {
        const childGroup: string = 'childGroup';
        const droppableGroup = mount({
            template: `
                <div v-m-remove-user-select v-m-droppable-group="'${childGroup}'">
                    <div class="someChild">someChild</div>
                </div>`
        }, { localVue: Vue });
        const childElement = droppableGroup.find('.someChild');
        expect(MDOMPlugin.getRecursive(MDroppableGroup, droppableGroup.element).options).toBe(childGroup);
    });
});
