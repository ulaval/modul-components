import { DirectiveOptions, VNodeDirective, VNode, PluginObject } from 'vue';
import { DROPPABLE } from '../directive-names';
import { MDraggable } from '../draggable/draggable';
import { getVNodeAttributeValue } from '../../utils/vue/directive';
import { MElementPlugin, MDOMPlugin } from '../plugin';

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
    canDrop?: boolean;
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

export class MDroppable extends MElementPlugin<MDroppableOptions> {
    public static currentHoverDroppable?: MDroppable;
    public static defaultMountPoint: string = '__mdroppable__';
    constructor(element: HTMLElement, options: MDroppableOptions) {
        super(element, options);
    }

    public attach(): void {
        this.options.acceptedActions = this.options.canDrop ? this.options.acceptedActions || [DEFAULT_ACTION] : [];

        this.addEventListener('dragenter', (event: DragEvent) => this.onDragEnter(event));
        this.addEventListener('dragleave', (event: DragEvent) => this.onDragLeave(event));
        this.addEventListener('dragover', (event: DragEvent) => this.onDragOver(event));

        if (this.options.canDrop) {
            this.addEventListener('drop', (event: DragEvent) => this.onDrop(event));
        }
        this.addEventListener('touchmove', () => {});
    }

    public update(options: any): void {
        this._options = options;
    }

    public detach(): void {
        this.cleanupCssClasses();
        this.removeAllEvents();
    }

    private onDragEnter(event: DragEvent): void {
        event.preventDefault();
        this.onDragIn(event);
        this.dispatchEvent(event, MDropEventNames.OnDragEnter);
    }

    private onDragLeave(event: DragEvent): any {
        this.cleanupCssClasses();
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
        this.cleanupCssClasses();

        MDroppable.currentHoverDroppable = this;
        this.element.classList.add(MDroppableClassNames.MOvering);

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

        this.cleanupCssClasses();
        this.dispatchEvent(event, MDropEventNames.OnDrop);
        MDroppable.currentHoverDroppable = undefined;
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

    private canDrop(): boolean {
        if (!MDraggable.currentDraggable) return false;

        const currentHoverElement: HTMLElement | undefined = MDroppable.currentHoverDroppable ? MDroppable.currentHoverDroppable.element : undefined;
        const currentDraggabke: HTMLElement | undefined = MDraggable.currentDraggable ? MDraggable.currentDraggable.element : undefined;

        const isHoveringOverDraggingElement = currentHoverElement === currentDraggabke;
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

    private cleanupCssClasses(): void {
        this.element.classList.remove(MDroppableClassNames.MOvering);
        this.element.classList.remove(MDroppableClassNames.MCanDrop);
        this.element.classList.remove(MDroppableClassNames.MCantDrop);
    }
}

const Directive: DirectiveOptions = {
    bind(element: HTMLElement, binding: VNodeDirective, node: VNode): void {
        MDOMPlugin.attach(MDroppable, element, {
            acceptedActions: getVNodeAttributeValue(node, 'accepted-actions'),
            grouping: getVNodeAttributeValue(node, 'grouping'),
            canDrop: binding.value
        });
    },
    update(element: MDroppableElement, binding: VNodeDirective, node: VNode): void {
        MDOMPlugin.update(MDroppable, element, {
            acceptedActions: getVNodeAttributeValue(node, 'accepted-actions'),
            grouping: getVNodeAttributeValue(node, 'grouping'),
            canDrop: binding.value
        });
    },
    unbind(element: MDroppableElement, binding: VNodeDirective): void {
        MDOMPlugin.detach(MDroppable, element);
    }
};

const DroppablePlugin: PluginObject<any> = {
    install(v, options): void {
        v.directive(DROPPABLE, Directive);
    }
};

export default DroppablePlugin;
