import { mount, Wrapper } from '@vue/test-utils';
import Vue, { VueConstructor } from 'vue';
import { resetModulPlugins } from '../../../../tests/helpers/component';
import { ModulVue } from '../../../utils/vue/vue';
import { MDOMPlugin } from '../../domPlugin';
import DroppableGroupPlugin, { MDroppableGroup } from '../droppable/droppable-group';


describe('droppable-group', () => {
    let localVue: VueConstructor<ModulVue>;

    beforeEach(() => {
        resetModulPlugins();
        Vue.use(DroppableGroupPlugin);
    });

    it('it should make group resolvable from child element', () => {
        const childGroup: string = 'childGroup';
        const droppableGroup: Wrapper<Vue> = mount({
            template: `
                <div v-m-droppable-group="'${childGroup}'">
                    <div class="someChild">someChild</div>
                </div>`
        }, { localVue: Vue });
        const childElement: Wrapper<Vue> = droppableGroup.find('.someChild');
        expect(MDOMPlugin.getRecursive(MDroppableGroup, droppableGroup.element)!.options).toBe(childGroup);
    });
});
