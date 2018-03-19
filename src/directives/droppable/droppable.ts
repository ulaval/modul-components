import { DirectiveOptions, VNodeDirective, VNode, PluginObject } from 'vue';
import { DROPPABLE } from '../directive-names';
import { MDraggable } from '../draggable/draggable';

export interface MDragEvent extends DragEvent {}

export interface MDroppableElement extends HTMLElement {
    cleanUp(): void;
}

export enum MDroppableClassNames {
    MOvering = 'm--is-dragover',
    MDroppable = 'm--is-droppable'
}

export interface MDroppableOptions {
    acceptedActions: String[];
    element: HTMLElement;
    onDragLeave?: (event: MDragEvent) => any;
    onDragOver?: (event: MDragEvent) => any;
    onDrop?: (event: MDragEvent) => any;
}

export class MDroppable {
    public static currentOverElement: HTMLElement;
    private options: MDroppableOptions;

    public setOptions(options: MDroppableOptions): void {
        this.options = options;
        this.init();
    }

    public cleanUp(): void {
        this.options.element.removeEventListener('dragleave', this.onDragLeave.bind(this));
        this.options.element.removeEventListener('dragover', this.onDragOver.bind(this));
        this.options.element.removeEventListener('drop', this.onDrop.bind(this));
    }

    private init(): void {
        (this.options.element as MDroppableElement).cleanUp = this.cleanUp.bind(this);
        this.options.element.addEventListener('dragleave', this.onDragLeave.bind(this));
        this.options.element.addEventListener('dragover', this.onDragOver.bind(this));
        this.options.element.addEventListener('drop', this.onDrop.bind(this));
    }

    private onDragLeave(event: MDragEvent): any {
        MDroppable.currentOverElement = event.currentTarget as HTMLElement;
        MDroppable.currentOverElement.classList.remove(MDroppableClassNames.MOvering);
        MDroppable.currentOverElement.classList.remove(MDroppableClassNames.MDroppable);
        event.dataTransfer.dropEffect = 'none';

        // TODO : remove this.
        MDroppable.currentOverElement.style.backgroundColor = '';

        if (this.options.onDragLeave) {
            this.options.onDragLeave(event);
        }
    }

    private onDragOver(event: MDragEvent): any {
        console.log('test', event, this.options.element);
        event.stopPropagation();

        if (MDroppable.currentOverElement) {
            // TODO: remove this.
            MDroppable.currentOverElement.style.backgroundColor = '';
            MDroppable.currentOverElement.classList.remove(MDroppableClassNames.MOvering);
            MDroppable.currentOverElement.classList.remove(MDroppableClassNames.MDroppable);
        }

        MDroppable.currentOverElement = this.options.element;
        MDroppable.currentOverElement.classList.add(MDroppableClassNames.MOvering);

        if (MDroppable.currentOverElement === MDraggable.currentlyDraggedElement) {
            event.dataTransfer.dropEffect = 'none';

            // TODO: remove this.
            MDroppable.currentOverElement.style.backgroundColor = 'blue';
        } else {
            event.preventDefault();
            event.dataTransfer.dropEffect = 'move';

            // TODO: remove this.
            MDroppable.currentOverElement.style.backgroundColor = 'red';
            MDroppable.currentOverElement.classList.add(MDroppableClassNames.MDroppable);
        }

        if (this.options.onDragOver) {
            this.options.onDragOver(event);
        }
    }

    private onDrop(event: MDragEvent): any {
        event.stopPropagation();
        event.preventDefault();
        MDroppable.currentOverElement.classList.remove(MDroppableClassNames.MOvering);
        MDroppable.currentOverElement.classList.remove(MDroppableClassNames.MDroppable);

        // TODO: remove this.
        MDroppable.currentOverElement.style.backgroundColor = '';

        if (this.options.onDrop) {
            this.options.onDrop(event);
        }
    }
}

export class MDroppableBinding {

}

const Directive: DirectiveOptions = {
    bind(element: HTMLElement, binding: VNodeDirective, node: VNode): void {
        new MDroppable().setOptions({
            acceptedActions: ['patate'],
            element: element
        });
        console.log('Droppable binding done.');
    },
    componentUpdated(element: MDroppableElement, binding: VNodeDirective, node: VNode): void {
        new MDroppable().setOptions({
            acceptedActions: ['patate'],
            element: element
        });
        console.log('Droppable componentUpdated done.');
    },
    unbind(element: MDroppableElement, binding: VNodeDirective): void {
        element.cleanUp();
        console.log('Droppable unbind done.');
    }
};

const DroppablePlugin: PluginObject<any> = {
    install(v, options): void {
        v.directive(DROPPABLE, Directive);
    }
};

export default DroppablePlugin;
