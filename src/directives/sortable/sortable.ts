import { SORTABLE } from '../directive-names';
import { PluginObject } from 'vue/types/plugin';
import { DirectiveOptions, VNode, VNodeDirective } from 'vue';
import { MDraggableElement, MDraggable } from '../draggable/draggable';
import { MDroppable, MDroppableElement } from '../droppable/droppable';
import { getVNodeAttributeValue } from '../../utils/vue/directive';

export class MSortableOptions {
    public onDragStart: () => void;
    public onDragEnd: Function;
    public onDragOver: Function;
}

const MSortable: DirectiveOptions = {
    bind(element: HTMLElement, binding: VNodeDirective, node: VNode): void {
        const childs: HTMLCollection = element.children;
        for (let i = 0; i < childs.length; i++) {
            const draggableElement = element as MDraggableElement;
            draggableElement.__mdraggable__ = new MDraggable(element, {
                action: getVNodeAttributeValue(node, 'action'),
                dragData: {}
            });

            const droppableElement = element as MDroppableElement;
            droppableElement.__mdroppable__ = new MDroppable(element, {
                acceptedActions: getVNodeAttributeValue(node, 'acceptedActions'),
                grouping: getVNodeAttributeValue(node, 'grouping')
            }, true);
        }
    },
    unbind(element: HTMLElement, binding: VNodeDirective): void {
        const childs: HTMLCollection = element.children;
        for (let i = 0; i < childs.length; i++) {
            let draggablePart = childs[i] as MDraggableElement;
            if (draggablePart.__mdraggable__) draggablePart.__mdraggable__.detach();

            let droppablePart = childs[i] as MDroppableElement;
            if (droppablePart.__mdroppable__) droppablePart.__mdroppable__.detach();
        }
    }
};

const SortablePlugin: PluginObject<any> = {
    install(v, options): void {
        v.directive(SORTABLE, MSortable);
    }
};

export default SortablePlugin;
