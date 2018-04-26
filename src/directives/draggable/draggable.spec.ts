import { mount, Wrapper } from '@vue/test-utils';
import Vue, { VueConstructor } from 'vue';

import { resetModulPlugins } from './../../../tests/helpers/component';
import { ModulVue } from './../../utils/vue/vue';
import { MDOMPlugin } from './../domPlugin';
import { MRemoveUserSelect } from './../user-select/remove-user-select';
import DraggablePlugin, { MDraggable, MDraggableClassNames, MDraggableOptions } from './draggable';

describe('draggable', () => {
    const getDraggableDirective: (bindingValue?: boolean, options?: MDraggableOptions, innerHtml?: string) => Wrapper<Vue> =
    (bindingValue?: boolean, options?: MDraggableOptions, innerHtml?: string) => {
        if (options) {
            return mount({
                template: bindingValue === undefined ? `<div v-m-draggable :action="action" :drag-data="dragData">${innerHtml}</div>`
                    : `<div v-m-draggable="${bindingValue}" :action="action" :drag-data"dragData">${innerHtml}</div>`,
                data: () => options
            }, { localVue: Vue });
        } else {
            return mount({
                template: bindingValue === undefined ? `<div v-m-draggable>${innerHtml}</div>`
                    : `<div v-m-draggable="${bindingValue}">${innerHtml}</div>`
            }, { localVue: Vue });
        }
    };

    let localVue: VueConstructor<ModulVue>;
    beforeEach(() => {
        resetModulPlugins();
        Vue.use(DraggablePlugin);
    });

    [undefined, true].forEach(param => {
        it(`it should render correctly when binding ${param} is provided`, () => {
            const userDefinedAction = 'someAction';
            const userDefinedData = 'someData';
            const draggable = getDraggableDirective(param, { dragData: userDefinedData, action: userDefinedAction, canDrag: true });

            // expect(draggable.element.classList).toContain(MDraggableClassNames.Draggable);
            // expect(MDOMPlugin.get(MDraggable, draggable.element).options.action).toBe(userDefinedAction);
            // expect(MDOMPlugin.get(MDraggable, draggable.element).options.dragData).toBe(userDefinedData);
            // expect(draggable.element.draggable).toBe(true);
            // expect(MDOMPlugin.get(MRemoveUserSelect, draggable.element)).toBeDefined();
        });
        it(`it should default action correctly when binding ${param} is provided and action is not user defined`, () => {
            const draggable = getDraggableDirective(param);
            expect(MDOMPlugin.get(MDraggable, draggable.element).options.action).toBe('any');
        });
    });

    it('it should render correctly when binding false is provided', () => {
        const draggable = getDraggableDirective(false);

        expect(draggable.element.classList).not.toContain(MDraggableClassNames.Draggable);
        expect(draggable.element.draggable).toBeUndefined();
        expect(MDOMPlugin.get(MDraggable, draggable.element)).toBeUndefined();
        expect(MDOMPlugin.get(MRemoveUserSelect, draggable.element)).toBeUndefined();
    });

    [undefined, true, false].forEach(param => {
        it(`it should manage drag image correctly when binding ${param} is provided`, () => {
            const draggable = getDraggableDirective(param, undefined, `<div class="dragImage"></div>`);

            const dragImage = draggable.find('.dragImage');
            expect(dragImage.element.style.left).toBe('-9999px');
            expect(dragImage.element.style.top).toBe('-9999px');
            expect(dragImage.element.style.position).toBe('absolute');
            expect(dragImage.element.style.overflow).toBe('hidden');
            expect(dragImage.element.style.zIndex).toBe('1');
            expect(dragImage.element.hidden).toBeTruthy();
        });
    });

    it('it should add grabbing class on mouse down', () => {
        const draggable = getDraggableDirective();
        draggable.trigger('mousedown');

        expect(draggable.element.classList).toContain(MDraggableClassNames.Grabbing);
    });

    it('it should remove grabbing class on mouse up', () => {
        const draggable = getDraggableDirective();
        draggable.trigger('mousedown');
        draggable.trigger('mouseup');

        expect(draggable.element.classList).not.toContain(MDraggableClassNames.Grabbing);
    });

    /* describe('onDragStart', () => {
        let draggable: Wrapper<Vue>;
        const userDefinedAction = 'someAction';
        const dragImageClass = 'someDragImageClass';
        beforeEach(() => {
            draggable = mount({
                template: `
                    <div v-m-draggable :action="'${userDefinedAction}'">
                        <div class="${dragImageClass}">DragImage</div>
                    </div>`
            }, { localVue: Vue }).find('div');
        });

        it('it should manage DragEvent correctly', () => {
            const options = { stopPropagation: () => {}, dataTransfer: { setData: () => {}, setDragImage: () => {}, getData: () => {} } };
            jest.spyOn(options, 'stopPropagation');
            draggable.trigger('dragstart', options);

            expect(MDraggable.currentDraggable).toBe(MDOMPlugin.get(MDraggable, draggable.element));
            expect(options.stopPropagation).toHaveBeenCalled();
        });
    }); */
});
