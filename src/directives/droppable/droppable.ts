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

export interface MDropEvent extends DragEvent {
    dropInfo: MDropInfo;
}

export interface MDroppableElement extends HTMLElement {
    __mdroppable__?: MDroppable;
}

export interface MDroppableOptions {
    acceptedActions: string[];
    grouping?: string;
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
        if (this.element.__mdroppable__) this.element.__mdroppable__.cleanupDroppableCssClasses();
        event.dataTransfer.dropEffect = MDropEffect.MNone;

        this.dispatchEvent(event, MDropEventNames.OnDragLeave);
    }

    private onDragEnter(event: DragEvent): void {
        event.preventDefault();
        this.onDragIn(event);
        this.dispatchEvent(event, MDropEventNames.OnDragEnter);
    }

    private onDragOver(event: DragEvent): any {
        event.stopPropagation();
        this.onDragIn(event);
        this.dispatchEvent(event, MDropEventNames.OnDragOver);
    }

    private onDragIn(event: DragEvent): any {
        event.stopPropagation();
        if (this.element.__mdroppable__) {
            this.element.__mdroppable__.cleanupDroppableCssClasses();
        }

        MDroppable.currentOverElement = this.element;
        MDroppable.currentOverElement.classList.add(MDroppableClassNames.MOvering);

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
            this.element.__mdroppable__.cleanupDroppableCssClasses();
        }

        MDroppable.currentOverElement = undefined;
        this.dispatchEvent(event, MDropEventNames.OnDrop);
    }

    private cleanupDroppableCssClasses(): void {
        this.element.classList.remove(MDroppableClassNames.MOvering);
        this.element.classList.remove(MDroppableClassNames.MCanDrop);
        this.element.classList.remove(MDroppableClassNames.MCantDrop);
    }

    private canDrop(): boolean {
        const acceptAny = this.options.acceptedActions.find(action => action === 'any') !== undefined;
        const draggableAction: string | undefined = MDraggable.currentlyDraggedElement.__mdraggable__
            ? MDraggable.currentlyDraggedElement.__mdraggable__.options.action
            : undefined;
        const isAllowedAction = this.options.acceptedActions.find(action => action === draggableAction) !== undefined;
        return MDroppable.currentOverElement !== MDraggable.currentlyDraggedElement && (acceptAny || isAllowedAction);
    }

    private dispatchEvent(event: DragEvent, name: string): void {
        const customEvent: CustomEvent = document.createEvent('CustomEvent');

        const data: string = event.dataTransfer.getData('text');
        const dropInfo: MDropInfo = {
            action: MDraggable.currentlyDraggedElement.__mdraggable__ ? MDraggable.currentlyDraggedElement.__mdraggable__.options.action : DEFAULT_ACTION,
            grouping: this.options.grouping,
            data: data ? JSON.parse(event.dataTransfer.getData('text')) : undefined,
            canDrop: this.canDrop()
        };
        const dropEvent: Event = Object.assign(customEvent, { dropInfo });

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
