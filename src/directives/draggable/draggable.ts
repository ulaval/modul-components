import { DirectiveOptions, VNodeDirective, VNode, PluginObject } from 'vue';
import { DRAGGABLE } from '../directive-names';
import { getVNodeAttributeValue } from '../../utils/vue/directive';

export interface MDragEvent extends DragEvent {}

export interface MDraggableElement extends HTMLElement {
    action: string;
    cleanUpDraggable?(): void;
}

export enum MDraggableClassNames {
    MDragging = 'm--is-dragging'
}

export interface MDraggableOptions {
    action: string;
    dragData: any;
    element: HTMLElement;
    onDragEnd?: (event: MDragEvent) => any;
    onDragStart?: (event: MDragEvent) => any;
}

export class MDraggable {
    public static currentlyDraggedElement: MDraggableElement;
    private options: MDraggableOptions;

    public attach(options: MDraggableOptions): void {
        this.options = options;
        this.init();
    }

    public detach(): void {
        this.options.element.draggable = false;
        this.options.element.removeEventListener('dragend', this.onDragEnd.bind(this));
        this.options.element.removeEventListener('dragstart', this.onDragStart.bind(this));
        (this.options.element as MDraggableElement).cleanUpDraggable = undefined;
        this.options.element.removeEventListener('touchmove', () => {});
    }

    private init(): void {
        const element = (this.options.element as MDraggableElement);
        if (element.cleanUpDraggable) element.cleanUpDraggable();

        this.options.action = this.options.action ? this.options.action : 'any';

        element.draggable = true;
        element.cleanUpDraggable = this.detach.bind(this);
        element.action = this.options.action;

        element.addEventListener('dragend', this.onDragEnd.bind(this));
        element.addEventListener('dragstart', this.onDragStart.bind(this), false);
        element.addEventListener('touchmove', () => {});
    }

    private onDragEnter(event: MDragEvent): void {
        event.preventDefault();
    }

    private onDragEnd(event: MDragEvent): void {
        MDraggable.currentlyDraggedElement.classList.remove(MDraggableClassNames.MDragging);

        if (this.options.onDragEnd) this.options.onDragEnd(event);
    }

    private onDragStart(event: MDragEvent): void {
        event.stopPropagation();

        MDraggable.currentlyDraggedElement = event.currentTarget as MDraggableElement;
        MDraggable.currentlyDraggedElement.classList.add(MDraggableClassNames.MDragging);

        if (typeof this.options.dragData.value === 'object') {
            event.dataTransfer.setData('text', JSON.stringify(this.options.dragData));
        } else {
            event.dataTransfer.setData('text', this.options.dragData);
        }

        if (this.options.onDragStart) this.options.onDragStart(event);
    }
}

const Directive: DirectiveOptions = {
    bind(element: HTMLElement, binding: VNodeDirective, node: VNode): void {
        new MDraggable().attach({
            action: getVNodeAttributeValue(node, 'action'),
            element: element,
            dragData: {}
        });

        console.log('Droppable binding done.');
    },
    componentUpdated(element: MDraggableElement, binding: VNodeDirective, node: VNode): void {
        new MDraggable().attach({
            action: getVNodeAttributeValue(node, 'action'),
            element: element,
            dragData: {}
        });
        console.log('Droppable componentUpdated done.');
    },
    unbind(element: MDraggableElement, binding: VNodeDirective): void {
        if (element.cleanUpDraggable) element.cleanUpDraggable();
        console.log('Droppable unbind done.');
    }
};

const DraggablePlugin: PluginObject<any> = {
    install(v, options): void {
        v.directive(DRAGGABLE, Directive);
    }
};

export default DraggablePlugin;
