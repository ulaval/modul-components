import { DirectiveOptions, VNodeDirective, VNode, PluginObject } from 'vue';
import { DRAGGABLE } from '../directive-names';

export interface MDragEvent extends DragEvent {}

export interface MDraggableElement extends HTMLElement {
    cleanUp(): void;
}

export enum MDraggableClassNames {
    MDragging = 'm--is-dragging'
}

export interface MDraggableOptions {
    action: String;
    dragData: any;
    element: HTMLElement;
    onDragEnd?: (event: MDragEvent) => any;
    onDragStart?: (event: MDragEvent) => any;
}

export class MDraggable {
    public static currentlyDraggedElement: HTMLElement;
    private options: MDraggableOptions;

    public setOptions(options: MDraggableOptions): void {
        this.options = options;
        this.init();
    }

    public cleanUp(): void {
        this.options.element.draggable = false;
        this.options.element.removeEventListener('dragenter', this.onDragEnter.bind(this));
        this.options.element.removeEventListener('dragend', this.onDragEnd.bind(this));
        this.options.element.removeEventListener('dragstart', this.onDragStart.bind(this));
        window.removeEventListener('touchmove', () => {});
    }

    private init(): void {
        this.options.element.draggable = true;
        this.options.element.addEventListener('dragenter', this.onDragEnter.bind(this));
        this.options.element.addEventListener('dragend', this.onDragEnd.bind(this));
        this.options.element.addEventListener('dragstart', this.onDragStart.bind(this), false);
        window.addEventListener('touchmove', () => {});
    }

    private onDragEnter(event: MDragEvent): void {
        event.preventDefault();
    }

    private onDragEnd(event: MDragEvent): void {
        MDraggable.currentlyDraggedElement.classList.remove(MDraggableClassNames.MDragging);

        // TODO : remove this.
        MDraggable.currentlyDraggedElement.style.backgroundColor = '';

        if (this.options.onDragEnd) {
            this.options.onDragEnd(event);
        }
    }

    private onDragStart(event: MDragEvent): void {
        event.stopPropagation();

        MDraggable.currentlyDraggedElement = event.currentTarget as HTMLElement;
        MDraggable.currentlyDraggedElement.classList.add(MDraggableClassNames.MDragging);

        // TODO : remove this.
        MDraggable.currentlyDraggedElement.style.backgroundColor = 'cyan';

        if (typeof this.options.dragData.value === 'object') {
            event.dataTransfer.setData('text', JSON.stringify(this.options.dragData));
        } else {
            event.dataTransfer.setData('text', this.options.dragData);
        }

        if (this.options.onDragStart) {
            this.options.onDragStart(event);
        }
    }
}

export interface MDraggableBindings extends VNodeDirective {
    test: String;
    anotherTest: () => void;
}

const Directive: DirectiveOptions = {
    bind(element: HTMLElement, binding: MDraggableBindings, node: VNode): void {
        new MDraggable().setOptions({
            action: 'patate',
            element: element,
            dragData: {}
        });

        console.log('Droppable binding done.');
    },
    componentUpdated(element: MDraggableElement, binding: MDraggableBindings, node: VNode): void {
        new MDraggable().setOptions({
            action: 'patate',
            element: element,
            dragData: {}
        });
        console.log('Droppable componentUpdated done.');
    },
    unbind(element: MDraggableElement, binding: VNodeDirective): void {
        element.cleanUp();
        console.log('Droppable unbind done.');
    }
};

const DraggablePlugin: PluginObject<any> = {
    install(v, options): void {
        v.directive(DRAGGABLE, Directive);
    }
};

export default DraggablePlugin;
