import { DirectiveOptions, VNodeDirective, VNode, PluginObject } from 'vue';
import { DROPPABLE } from '../directive-names';
import { MDraggable } from '../draggable/draggable';
import { getVNodeAttributeValue } from '../../utils/vue/directive';

export enum MDroppableClassNames {
    MOvering = 'm--is-dragover',
    MCanDrop = 'm--can-drop',
    MCantDrop = 'm--cant-drop'
}

export enum MDroppableOrientation {
    MBefore = 'before',
    MAfter = 'after'
}

export enum MDropEffect {
    MMove = 'move',
    MNone = 'none'
}

export interface MDropEvent<T> extends DragEvent {
    position: { element: HTMLElement, orientation: MDroppableOrientation };
    dragInfo: MDragInfo<T>;
}

export interface MDroppableElement extends HTMLElement {
    __mdroppable__?: MDroppable;
}

export interface MDroppableOptions {
    acceptedActions: string[];
    grouping?: string;
}

export interface MDragInfo<T> {
    action: string;
    grouping?: string;
    data: T;
}

const DEFAULT_ACTION = 'any';
export class MDroppable {
    public static currentOverElement: MDroppableElement | undefined;
    public options: MDroppableOptions;
    private element: MDroppableElement;

    constructor(element: HTMLElement, options: MDroppableOptions, canDrop?: boolean) {
        this.element = element;
        this.options = options;
        this.attach(canDrop);
    }

    public detach(): void {
        this.element.removeEventListener('dragleave', this.onDragLeave.bind(this));
        this.element.removeEventListener('dragenter', this.onDragEnter.bind(this));
        this.element.removeEventListener('dragover', this.onDragOver.bind(this));
        this.element.removeEventListener('drop', this.onDrop.bind(this));
        this.element.removeEventListener('touchmove', () => {});
        this.element.__mdroppable__ = undefined;
    }

    private attach(canDrop?: boolean): void {
        this.options.acceptedActions = canDrop ? this.options.acceptedActions || [DEFAULT_ACTION] : [];

        this.element.addEventListener('dragleave', this.onDragLeave.bind(this));
        this.element.addEventListener('dragenter', this.onDragEnter.bind(this));
        this.element.addEventListener('dragover', this.onDragOver.bind(this));

        if (canDrop) {
            this.element.addEventListener('drop', this.onDrop.bind(this));
        }
        this.element.addEventListener('touchmove', () => {});
    }

    private onDragLeave(event: DragEvent): any {
        MDroppable.currentOverElement = event.currentTarget as HTMLElement;
        if (MDroppable.currentOverElement.__mdroppable__) MDroppable.currentOverElement.__mdroppable__.cleanupDroppableCssClasses();
        MDroppable.currentOverElement = undefined;
        event.dataTransfer.dropEffect = MDropEffect.MNone;
    }

    private onDragEnter(event: DragEvent): void {
        event.preventDefault();
        MDroppable.currentOverElement = this.element;
        MDroppable.currentOverElement.classList.add(MDroppableClassNames.MOvering);
    }

    private onDragOver(event: DragEvent): any {
        event.stopPropagation();

        if (MDroppable.currentOverElement && MDroppable.currentOverElement.__mdroppable__) {
            MDroppable.currentOverElement.__mdroppable__.cleanupDroppableCssClasses();
        }

        const acceptAny = this.options.acceptedActions.find(action => action === 'any');
        const draggableAction: string | undefined = MDraggable.currentlyDraggedElement.__mdraggable__
            ? MDraggable.currentlyDraggedElement.__mdraggable__.options.action
            : undefined;
        const isAllowedAction = this.options.acceptedActions.find(action => action === draggableAction);
        if (MDroppable.currentOverElement === MDraggable.currentlyDraggedElement || (!acceptAny && !isAllowedAction)) {
            event.dataTransfer.dropEffect = MDropEffect.MNone;
            if (MDroppable.currentOverElement) MDroppable.currentOverElement.classList.add(MDroppableClassNames.MCantDrop);
        } else {
            event.preventDefault();
            event.dataTransfer.dropEffect = MDropEffect.MMove;
            if (MDroppable.currentOverElement) MDroppable.currentOverElement.classList.add(MDroppableClassNames.MCanDrop);
        }
    }

    private onDrop(event: DragEvent): any {
        event.stopPropagation();
        event.preventDefault();

        if (MDroppable.currentOverElement && MDroppable.currentOverElement.__mdroppable__) {
            MDroppable.currentOverElement.__mdroppable__.cleanupDroppableCssClasses();
        }

        this.dispatchEvent(event, 'droppable:drop');
    }

    private cleanupDroppableCssClasses(): void {
        this.element.classList.remove(MDroppableClassNames.MOvering);
        this.element.classList.remove(MDroppableClassNames.MCanDrop);
        this.element.classList.remove(MDroppableClassNames.MCantDrop);
    }

    private dispatchEvent(event: DragEvent, name: string): void {
        const customEvent: CustomEvent = document.createEvent('CustomEvent');

        const dragInfo: MDragInfo<any> = {
            action: MDraggable.currentlyDraggedElement.__mdraggable__ ? MDraggable.currentlyDraggedElement.__mdraggable__.options.action : DEFAULT_ACTION,
            grouping: this.options.grouping,
            data: JSON.parse(event.dataTransfer.getData('text'))
        };

        const test = Object.assign(event, { dragInfo });
        customEvent.initCustomEvent(name, true, true, event);
        this.element.dispatchEvent(Object.assign(customEvent, { dragInfo: dragInfo }));
    }
}

interface DraggableBinding extends VNodeDirective {
    dropListener: (event: DragEvent) => void;
}

const emit = (vnode, name, data) => {
    const handlers = (vnode.data && vnode.data.on) ||
        (vnode.componentOptions && vnode.componentOptions.listeners);

    if (handlers && handlers[name]) {
        handlers[name].fns(data);
    }
};

const Directive: DirectiveOptions = {
    bind(element: MDroppableElement, binding: DraggableBinding, node: VNode): void {
        element.__mdroppable__ = new MDroppable(element, {
            acceptedActions: getVNodeAttributeValue(node, 'accepted-actions'),
            grouping: getVNodeAttributeValue(node, 'grouping')
        }, binding.value);
    },
    unbind(element: MDroppableElement, binding: VNodeDirective): void {
        if (element.__mdroppable__) element.__mdroppable__.detach();
    }
};

const DroppablePlugin: PluginObject<any> = {
    install(v, options): void {
        v.directive(DROPPABLE, Directive);
    }
};

export default DroppablePlugin;
