import { DirectiveOptions, VNodeDirective, VNode, PluginObject } from 'vue';
import { DROPPABLE } from '../directive-names';
import { MDraggable } from '../draggable/draggable';
import { MElementPlugin, MDOMPlugin } from '../domPlugin';
import { mousePositionElement } from '../sortable/mouse';
import { getVNodeAttributeValue } from '../../utils/vue/directive';

export enum MDroppableClassNames {
    Overing = 'm--is-dragover',
    CanDrop = 'm--can-drop',
    CantDrop = 'm--cant-drop'
}

export enum MDropEffect {
    MMove = 'move',
    MNone = 'none'
}

export interface MDropEvent extends DragEvent {
    dropInfo: MDropInfo;
}

export interface MDroppableOptions {
    acceptedActions: string[];
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
    public static defaultMountPoint: string = '__mdroppable__';
    public static currentHoverDroppable?: MDroppable;
    public static previousHoverContainer?: MDroppable;

    constructor(element: HTMLElement, options: MDroppableOptions) {
        super(element, options);
    }

    public attach(): void {
        this.setOptions(this.options);
        this.addEventListener('dragenter', (event: DragEvent) => this.onDragEnter(event));
        this.addEventListener('dragleave', (event: DragEvent) => this.onDragLeave(event));
        this.addEventListener('dragover', (event: DragEvent) => this.onDragOver(event));
        this.addEventListener('touchmove', () => {});
        this.bindDropEvent(this.options.canDrop);
    }

    public update(options: MDroppableOptions): void {
        this.setOptions(this._options = options);
        this.bindDropEvent(options.canDrop);
    }

    public detach(): void {
        this.cleanupCssClasses();
        this.removeAllEvents();
    }

    public cleanupCssClasses(): void {
        this.element.classList.remove(MDroppableClassNames.Overing);
        this.element.classList.remove(MDroppableClassNames.CanDrop);
        this.element.classList.remove(MDroppableClassNames.CantDrop);
    }

    private setOptions(value: MDroppableOptions): void {
        this._options = value;
        this._options.acceptedActions = this.options.canDrop ? this.options.acceptedActions || [DEFAULT_ACTION] : [];
    }

    private bindDropEvent(canDrop: boolean | undefined): void {
        this.removeEventListener('drop');
        if (canDrop) {
            this.addEventListener('drop', (event: DragEvent) => this.onDrop(event));
        }
    }

    private onDragLeave(event: DragEvent): void {
        event.preventDefault();
        event.stopPropagation();
        const leaveContainer: MDroppable | undefined = MDOMPlugin.getRecursive(MDroppable, event.target as HTMLElement);

        if (this.isLeavingDroppable(event, leaveContainer)) {
            if (MDroppable.currentHoverDroppable === this) {
                MDroppable.previousHoverContainer = this;
                MDroppable.currentHoverDroppable = undefined;
            }
            this.cleanupCssClasses();
            this.dispatchEvent(event, MDropEventNames.OnDragLeave);
        }
    }

    private isLeavingDroppable(event: DragEvent, droppable?: MDroppable): boolean {
        if (!droppable) { return false; }

        const threshold: number = 3;
        const mousePosition = mousePositionElement(event, droppable.element);
        return mousePosition.x < 0 || mousePosition.y < 0
            || mousePosition.x + threshold > droppable.element.offsetWidth
            || mousePosition.y + threshold > droppable.element.offsetHeight || MDroppable.previousHoverContainer !== MDroppable.currentHoverDroppable;
    }

    private onDragEnter(event: DragEvent): any {
        return this.onDragIn(event);
    }

    private onDragOver(event: DragEvent): any {
        return this.onDragIn(event);
    }

    private onDragIn(event: DragEvent): any {
        event.stopPropagation();

        const element = document.elementFromPoint(event.clientX, event.clientY) as HTMLElement;
        const droppable = MDOMPlugin.getRecursive(MDroppable, element);
        // Firefox sometime fires events on the wrong container for some reasons.  This fix it.
        if (droppable !== this) { this.cleanupCssClasses(); return; }

        if (this.canDrop()) {
            event.preventDefault();
            event.dataTransfer.dropEffect = MDropEffect.MMove;
            this.element.classList.add(MDroppableClassNames.CanDrop);
        } else {
            event.preventDefault();
            event.dataTransfer.dropEffect = MDropEffect.MNone;
            this.element.classList.add(MDroppableClassNames.CantDrop);
        }

        MDroppable.previousHoverContainer = MDroppable.currentHoverDroppable;
        MDroppable.currentHoverDroppable = this;
        if (MDroppable.previousHoverContainer !== MDroppable.currentHoverDroppable) {
            if (MDroppable.previousHoverContainer) { MDroppable.previousHoverContainer.cleanupCssClasses(); }
            this.cleanupCssClasses();
            this.element.classList.add(MDroppableClassNames.Overing);

            this.dispatchEvent(event, MDropEventNames.OnDragEnter);
        }

        this.dispatchEvent(event, MDropEventNames.OnDragOver);
    }

    private onDrop(event: DragEvent): void {
        event.stopPropagation();
        event.preventDefault();

        this.cleanupCssClasses();
        this.dispatchEvent(event, MDropEventNames.OnDrop);
        MDraggable.currentDraggable = undefined;
        MDroppable.currentHoverDroppable = undefined;
    }

    private dispatchEvent(event: DragEvent, name: string): void {
        if (!MDraggable.currentDraggable) { return; }

        const customEvent: CustomEvent = document.createEvent('CustomEvent');
        customEvent.initCustomEvent(name, true, true, event);
        this.element.dispatchEvent(Object.assign(customEvent, {
            clientX: event.clientX,
            clientY: event.clientY,
            relatedTarget: event.relatedTarget,
            toElement: event.toElement,
            fromElement: event.fromElement }, { dropInfo: this.extractDropInfo(event) }));
    }

    private extractDropInfo(event: DragEvent): MDropInfo | undefined {
        if (!MDraggable.currentDraggable) { return; }

        const data = MDraggable.currentDraggable.options.dragData || event.dataTransfer.getData('text');
        return {
            action: MDraggable.currentDraggable ? MDraggable.currentDraggable.options.action : DEFAULT_ACTION,
            grouping: MDraggable.currentDraggable.options.grouping,
            data,
            canDrop: this.canDrop()
        };
    }

    private canDrop(): boolean {
        if (!MDraggable.currentDraggable) { return false; }

        console.log('group', MDraggable.currentDraggable.options, this.options);

        const acceptAny = this.options.acceptedActions.find(action => action === 'any') !== undefined;
        const draggableAction: string = MDraggable.currentDraggable.options.action;
        const isAllowedAction = this.options.acceptedActions.find(action => action === draggableAction) !== undefined;
        return !this.isHoveringOverDraggedElementChild() && (acceptAny || isAllowedAction);
    }

    private isHoveringOverDraggedElementChild(): boolean {
        if (!MDroppable.currentHoverDroppable || !MDraggable.currentDraggable) { return false; }

        let found: boolean = false;
        let element: HTMLElement | undefined = MDroppable.currentHoverDroppable.element;
        while (!found && element) {
            if (element === MDraggable.currentDraggable.element) { found = true; }
            element = element.parentNode as HTMLElement;
        }
        return found;
    }
}

const extractVnodeAttributes: (binding: VNodeDirective, node: VNode) => MDroppableOptions = (binding: VNodeDirective, node: VNode) => {
    return {
        acceptedActions: getVNodeAttributeValue(node, 'accepted-actions'),
        grouping: getVNodeAttributeValue(node, 'grouping'),
        canDrop: binding.value
    };
};
const Directive: DirectiveOptions = {
    bind(element: HTMLElement, binding: VNodeDirective, node: VNode): void {
        MDOMPlugin.attach(MDroppable, element, extractVnodeAttributes(binding, node));
    },
    update(element: HTMLElement, binding: VNodeDirective, node: VNode): void {
        MDOMPlugin.update(MDroppable, element, extractVnodeAttributes(binding, node));
    },
    unbind(element: HTMLElement, binding: VNodeDirective): void {
        MDOMPlugin.detach(MDroppable, element);
    }
};

const DroppablePlugin: PluginObject<any> = {
    install(v, options): void {
        v.directive(DROPPABLE, Directive);
    }
};

export default DroppablePlugin;
