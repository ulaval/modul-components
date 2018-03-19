import { SORTABLE } from '../directive-names';
import { PluginObject } from 'vue/types/plugin';
import { DirectiveOptions, VNode, VNodeDirective } from 'vue';
import { MDraggableElement, MDraggable } from '../draggable/draggable';
import { MDroppable, MDroppableElement } from '../droppable/droppable';

export class MSortableOptions {
    public onDragStart: () => void;
    public onDragEnd: Function;
    public onDragOver: Function;
}

const MSortable: DirectiveOptions = {
    bind(element: HTMLElement, binding: VNodeDirective, node: VNode): void {
        const childs: HTMLCollection = element.children;
        for (let i = 0; i < childs.length; i++) {
            new MDraggable().setOptions({
                action: 'patate',
                element: childs[i] as HTMLElement,
                dragData: {}
            });
            new MDroppable().setOptions(true, {
                acceptedActions: ['patate'],
                element: childs[i] as HTMLElement
            });
        }
    },
    componentUpdated(element: HTMLElement, binding: VNodeDirective, node: VNode): void {
        const childs: HTMLCollection = element.children;
        for (let i = 0; i < childs.length; i++) {
            new MDraggable().setOptions({
                action: 'patate',
                element: childs[i] as HTMLElement,
                dragData: {}
            });
            new MDroppable().setOptions(true, {
                acceptedActions: ['patate'],
                element: childs[i] as HTMLElement
            });
        }
    },
    unbind(element: HTMLElement, binding: VNodeDirective): void {
        const childs: HTMLCollection = element.children;
        for (let i = 0; i < childs.length; i++) {
            let draggablePart = childs[i] as MDraggableElement;
            if (draggablePart.cleanUpDraggable) draggablePart.cleanUpDraggable();

            let droppablePart = childs[i] as MDroppableElement;
            if (droppablePart.cleanUpDroppable) droppablePart.cleanUpDroppable();
        }
    }
};

const SortablePlugin: PluginObject<any> = {
    install(v, options): void {
        v.directive(SORTABLE, MSortable);
    }
};

export default SortablePlugin;
