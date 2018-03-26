import { DirectiveOptions, VNodeDirective, VNode, PluginObject } from 'vue';
import { DROPPABLE } from '../directive-names';
import { MDraggable, MDraggableElement } from '../draggable/draggable';
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

export interface MDropEvent extends DragEvent {
    dropInfo: MDropInfo;
}

export interface MDroppableElement extends HTMLElement {
    __mdroppable__?: MDroppable;
}

export interface MDroppableOptions {
    acceptedActions: string[];
    grouping?: any;
}

export interface MDropInfo {
    action: string;
    grouping?: string;
    data: any;
    canDrop: boolean;
}

export enum MDropEventNames {
    OnDrop = 'droppable:drop',
    OnDragEnter = 'droppable:dragenter',
    OnDragLeave = 'droppable:dragleave',
    OnDragOver = 'droppable:dragover'
}

const DEFAULT_ACTION = 'any';
export class MDroppable {
    public static currentHoverElement: MDroppableElement | undefined;
    public options: MDroppableOptions;
    private element: MDroppableElement;

    constructor(element: HTMLElement, options: MDroppableOptions, canDrop?: boolean) {
        this.element = element;
        this.options = options;
        this.attach(canDrop);
    }

    public detach(): void {
        this.element.removeEventListener('dragenter', this.onDragEnter.bind(this));
        this.element.removeEventListener('dragleave', this.onDragLeave.bind(this));
        this.element.removeEventListener('dragover', this.onDragOver.bind(this));
        this.element.removeEventListener('drop', this.onDrop.bind(this));
        this.element.removeEventListener('touchmove', () => {});
        this.element.__mdroppable__ = undefined;
    }

    private attach(canDrop?: boolean): void {
        this.options.acceptedActions = canDrop ? this.options.acceptedActions || [DEFAULT_ACTION] : [];

        this.element.addEventListener('dragenter', this.onDragEnter.bind(this));
        this.element.addEventListener('dragleave', this.onDragLeave.bind(this));
        this.element.addEventListener('dragover', this.onDragOver.bind(this));

        if (canDrop) {
            this.element.addEventListener('drop', this.onDrop.bind(this));
        }
        this.element.addEventListener('touchmove', () => {});
    }

    private onDragEnter(event: DragEvent): void {
        event.preventDefault();
        this.onDragIn(event);
        this.dispatchEvent(event, MDropEventNames.OnDragEnter);
    }

    private onDragLeave(event: DragEvent): any {
        if (this.element.__mdroppable__) this.element.__mdroppable__.cleanupCssClasses();
        event.dataTransfer.dropEffect = MDropEffect.MNone;

        this.dispatchEvent(event, MDropEventNames.OnDragLeave);
    }

    private onDragOver(event: DragEvent): any {
        event.stopPropagation();
        this.onDragIn(event);
        this.dispatchEvent(event, MDropEventNames.OnDragOver);
    }

    private onDragIn(event: DragEvent): any {
        event.stopPropagation();
        if (this.element.__mdroppable__) {
            this.element.__mdroppable__.cleanupCssClasses();
        }

        MDroppable.currentHoverElement = this.element;
        MDroppable.currentHoverElement.classList.add(MDroppableClassNames.MOvering);

        if (this.canDrop()) {
            event.preventDefault();
            event.dataTransfer.dropEffect = MDropEffect.MMove;
            this.element.classList.add(MDroppableClassNames.MCanDrop);
        } else {
            event.dataTransfer.dropEffect = MDropEffect.MNone;
            this.element.classList.add(MDroppableClassNames.MCantDrop);
        }
    }

    private onDrop(event: DragEvent): any {
        event.stopPropagation();
        event.preventDefault();

        if (this.element.__mdroppable__) {
            this.element.__mdroppable__.cleanupCssClasses();
        }

        if (MDraggable.currentDraggable) {
            MDraggable.currentDraggable.cleanupCssClasses();
        }

        this.dispatchEvent(event, MDropEventNames.OnDrop);
        MDroppable.currentHoverElement = undefined;
        MDraggable.currentDraggable = undefined;
    }

    private cleanupCssClasses(): void {
        this.element.classList.remove(MDroppableClassNames.MOvering);
        this.element.classList.remove(MDroppableClassNames.MCanDrop);
        this.element.classList.remove(MDroppableClassNames.MCantDrop);
    }

    private canDrop(): boolean {
        if (!MDraggable.currentDraggable) return false;

        const isHoveringOverDraggingElement = MDroppable.currentHoverElement === MDraggable.currentDraggable.element;
        const acceptAny = this.options.acceptedActions.find(action => action === 'any') !== undefined;
        const draggableAction: string = MDraggable.currentDraggable.options.action;
        const isAllowedAction = this.options.acceptedActions.find(action => action === draggableAction) !== undefined;
        return !isHoveringOverDraggingElement && !this.isHoveringOverDraggedElementChild() && (acceptAny || isAllowedAction);
    }

    private isHoveringOverDraggedElementChild(): boolean {
        if (!MDraggable.currentDraggable) return false;

        let element = MDraggable.currentDraggable.element;
        let hovering = false;
        do {
            hovering = element.parentNode === MDraggable.currentDraggable.element;
            element = element.parentNode as HTMLElement;
        } while (!hovering && element);

        return hovering;
    }

    private dispatchEvent(event: DragEvent, name: string): void {
        if (!MDraggable.currentDraggable) return;

        const customEvent: CustomEvent = document.createEvent('CustomEvent');

        const data = MDraggable.currentDraggable
            ? MDraggable.currentDraggable.options.dragData
            ? MDraggable.currentDraggable.options.dragData
            : event.dataTransfer.getData('text') : undefined;
        const dropInfo: MDropInfo = {
            action: MDraggable.currentDraggable ? MDraggable.currentDraggable.options.action : DEFAULT_ACTION,
            grouping: this.options.grouping,
            data,
            canDrop: this.canDrop()
        };
        const dropEvent: Event = Object.assign(customEvent, { clientX: event.clientX, clientY: event.clientY }, { dropInfo });

        customEvent.initCustomEvent(name, true, true, event);
        this.element.dispatchEvent(dropEvent);
    }
}

const Directive: DirectiveOptions = {
    bind(element: MDroppableElement, binding: VNodeDirective, node: VNode): void {
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
