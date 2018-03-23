import { DirectiveOptions, VNodeDirective, VNode, PluginObject } from 'vue';
import { DRAGGABLE } from '../directive-names';
import { getVNodeAttributeValue } from '../../utils/vue/directive';

export interface MDraggableElement extends HTMLElement {
    __mdraggable__?: MDraggable;
}

export enum MDraggableClassNames {
    MDragging = 'm--is-dragging'
}

export interface MDraggableOptions {
    action: string;
    dragData: any;
}

const DEFAULT_ACTION = 'any';
export class MDraggable {
    public static currentlyDraggedElement: MDraggableElement | undefined;
    public options: MDraggableOptions;
    private element: MDraggableElement;

    constructor(element: HTMLElement, options: MDraggableOptions) {
        this.element = element;
        this.options = options;
        this.attach();
    }

    public detach(): void {
        this.element.draggable = false;
        this.element.removeEventListener('dragend', this.onDragEnd.bind(this));
        this.element.removeEventListener('dragstart', this.onDragStart.bind(this));
        this.element.removeEventListener('touchmove', () => {});
        this.element.__mdraggable__ = undefined;
    }

    public cleanupCssClasses(): void {
        this.element.classList.remove(MDraggableClassNames.MDragging);
    }

    private attach(): void {
        this.options.action = this.options.action ? this.options.action : DEFAULT_ACTION;

        this.element.draggable = true;
        this.element.addEventListener('dragend', this.onDragEnd.bind(this));
        this.element.addEventListener('dragstart', this.onDragStart.bind(this), false);
        this.element.addEventListener('touchmove', () => {});
    }

    private onDragEnter(event: DragEvent): void {
        event.preventDefault();
        MDraggable.currentlyDraggedElement = undefined;
    }

    private onDragEnd(event: DragEvent): void {
        if (MDraggable.currentlyDraggedElement) this.element.classList.remove(MDraggableClassNames.MDragging);
    }

    private onDragStart(event: DragEvent): void {
        event.stopPropagation();

        MDraggable.currentlyDraggedElement = event.currentTarget as MDraggableElement;
        MDraggable.currentlyDraggedElement.classList.add(MDraggableClassNames.MDragging);
        if (typeof this.options.dragData === 'object') {
            event.dataTransfer.setData('text', JSON.stringify(this.options.dragData));
        } else {
            event.dataTransfer.setData('text', this.options.dragData);
        }
    }
}

const Directive: DirectiveOptions = {
    bind(element: MDraggableElement, binding: VNodeDirective, node: VNode): void {
        element.__mdraggable__ = new MDraggable(element, {
            action: getVNodeAttributeValue(node, 'action'),
            dragData: getVNodeAttributeValue(node, 'drag-data')
        });
    },
    unbind(element: MDraggableElement, binding: VNodeDirective): void {
        if (element.__mdraggable__) element.__mdraggable__.detach();
    }
};

const DraggablePlugin: PluginObject<any> = {
    install(v, options): void {
        v.directive(DRAGGABLE, Directive);
    }
};

export default DraggablePlugin;
