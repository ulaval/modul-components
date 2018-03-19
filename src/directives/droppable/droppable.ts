import { DirectiveOptions, VNodeDirective, VNode, PluginObject } from 'vue';
import { DROPPABLE } from '../directive-names';
import { MDraggable } from '../draggable/draggable';
import { getVNodeAttributeValue } from '../../utils/vue/directive';

export interface MDragEvent extends DragEvent {}

export interface MDroppableElement extends HTMLElement {
    cleanUpDroppable?(): void;
}

export enum MDroppableClassNames {
    MOvering = 'm--is-dragover',
    MCanDrop = 'm--can-drop',
    MCantDrop = 'm--cant-drop'
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

    public setOptions(canDrop: boolean, options: MDroppableOptions): void {
        this.options = options;
        this.init(canDrop);
    }

    public cleanUp(): void {
        this.options.element.removeEventListener('dragleave', this.onDragLeave.bind(this));
        this.options.element.removeEventListener('dragenter', this.onDragEnter.bind(this));
        this.options.element.removeEventListener('dragover', this.onDragOver.bind(this));
        this.options.element.removeEventListener('drop', this.onDrop.bind(this));
        (this.options.element as MDroppableElement).cleanUpDroppable = undefined;
        this.options.element.removeEventListener('touchmove', () => {});
    }

    private init(canDrop: boolean): void {
        const element = (this.options.element as MDroppableElement);
        if (element.cleanUpDroppable) element.cleanUpDroppable();

        this.options.acceptedActions = canDrop ? this.options.acceptedActions || ['any'] : [];

        element.cleanUpDroppable = this.cleanUp.bind(this);
        element.addEventListener('dragleave', this.onDragLeave.bind(this));
        element.addEventListener('dragenter', this.onDragEnter.bind(this));
        element.addEventListener('dragover', this.onDragOver.bind(this));

        if (canDrop) {
            element.addEventListener('drop', this.onDrop.bind(this));
        }
        this.options.element.addEventListener('touchmove', () => {});
    }

    private onDragLeave(event: MDragEvent): any {
        MDroppable.currentOverElement = event.currentTarget as HTMLElement;
        this.cleanupDroppableCssClasses(MDroppable.currentOverElement);
        event.dataTransfer.dropEffect = 'none';

        if (this.options.onDragLeave) {
            this.options.onDragLeave(event);
        }
    }

    private onDragEnter(event: MDragEvent): void {
        event.preventDefault();
    }

    private onDragOver(event: MDragEvent): any {
        event.stopPropagation();

        if (MDroppable.currentOverElement) {
            this.cleanupDroppableCssClasses(MDroppable.currentOverElement);
        }

        MDroppable.currentOverElement = this.options.element;
        MDroppable.currentOverElement.classList.add(MDroppableClassNames.MOvering);

        const acceptAny = this.options.acceptedActions.find(action => action === 'any');
        const isAllowedAction = this.options.acceptedActions.find(action => action === MDraggable.currentlyDraggedElement.action);
        if (MDroppable.currentOverElement === MDraggable.currentlyDraggedElement || (!acceptAny && !isAllowedAction)) {
            event.dataTransfer.dropEffect = 'none';
            MDroppable.currentOverElement.classList.add(MDroppableClassNames.MCantDrop);
        } else {
            event.preventDefault();
            event.dataTransfer.dropEffect = 'move';
            MDroppable.currentOverElement.classList.add(MDroppableClassNames.MCanDrop);
        }

        if (this.options.onDragOver) {
            this.options.onDragOver(event);
        }
    }

    private onDrop(event: MDragEvent): any {
        event.stopPropagation();
        event.preventDefault();
        this.cleanupDroppableCssClasses(MDroppable.currentOverElement);

        if (this.options.onDrop) {
            this.options.onDrop(event);
        }
    }

    private cleanupDroppableCssClasses(element: HTMLElement): void {
        MDroppable.currentOverElement.classList.remove(MDroppableClassNames.MOvering);
        MDroppable.currentOverElement.classList.remove(MDroppableClassNames.MCanDrop);
        MDroppable.currentOverElement.classList.remove(MDroppableClassNames.MCantDrop);
    }
}

export class MDroppableBinding {

}

const Directive: DirectiveOptions = {
    bind(element: HTMLElement, binding: VNodeDirective, node: VNode): void {
        new MDroppable().setOptions(binding.value, {
            acceptedActions: getVNodeAttributeValue(node, 'accepted-actions'),
            element: element
        });
        console.log('Droppable binding done.');
    },
    componentUpdated(element: MDroppableElement, binding: VNodeDirective, node: VNode): void {
        new MDroppable().setOptions(binding.value, {
            acceptedActions: getVNodeAttributeValue(node, 'accepted-actions'),
            element: element
        });
        console.log('Droppable componentUpdated done.');
    },
    unbind(element: MDroppableElement, binding: VNodeDirective): void {
        if (element.cleanUpDroppable) element.cleanUpDroppable();
        console.log('Droppable unbind done.');
    }
};

const DroppablePlugin: PluginObject<any> = {
    install(v, options): void {
        v.directive(DROPPABLE, Directive);
    }
};

export default DroppablePlugin;
