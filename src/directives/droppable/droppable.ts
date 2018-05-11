import { DirectiveOptions, PluginObject, VNode, VNodeDirective } from 'vue';

import { isInElement } from '../../utils/mouse/mouse';
import { dispatchEvent, getVNodeAttributeValue } from '../../utils/vue/directive';
import { DROPPABLE_NAME } from '../directive-names';
import { MDOMPlugin, MElementDomPlugin, MountFunction, RefreshFunction } from '../domPlugin';
import { MDraggable } from '../draggable/draggable';
import { MSortableAction } from '../sortable/sortable';
import RemoveUserSelectPlugin, { MRemoveUserSelect } from '../user-select/remove-user-select';

export enum MDroppableClassNames {
    Droppable = 'm--is-droppable',
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
    canDrop: any;
}

export enum MDroppableEventNames {
    OnDrop = 'droppable:drop',
    OnDragEnter = 'droppable:dragenter',
    OnDragLeave = 'droppable:dragleave',
    OnDragOver = 'droppable:dragover'
}

const DEFAULT_ACTION = 'any';

export class MDroppable extends MElementDomPlugin<MDroppableOptions> {
    public static defaultMountPoint: string = '__mdroppable__';
    public static currentHoverDroppable?: MDroppable;
    public static previousHoverContainer?: MDroppable;

    constructor(element: HTMLElement, options: MDroppableOptions) {
        super(element, options);
    }

    public attach(mount: MountFunction): void {
        this.setOptions(this.options);
        if (this.options.canDrop) {
            mount(() => {
                this.element.classList.add(MDroppableClassNames.Droppable);
                MDOMPlugin.attach(MRemoveUserSelect, this.element, true);
                this.addEventListener('dragenter', (event: DragEvent) => this.onDragEnter(event));
                this.addEventListener('dragleave', (event: DragEvent) => this.onDragLeave(event));

                // Firefox doesn't handle dragLeave correctly.  We have to declare dragexit AND dragleave for that reason.
                this.addEventListener('dragexit', (event: DragEvent) => this.onDragLeave(event));
                this.addEventListener('dragover', (event: DragEvent) => this.onDragOver(event));
                this.addEventListener('drop', (event: DragEvent) => this.onDrop(event));
            });
        }
    }

    public update(options: MDroppableOptions, refresh: RefreshFunction): void {
        this.setOptions(this._options = options);
        if (this.options.canDrop) {
            refresh(() => { this.element.classList.add(MDroppableClassNames.Droppable); });
        }
    }

    public detach(): void {
        MDOMPlugin.detach(MRemoveUserSelect, this.element);
        this.cleanupCssClasses();
        this.removeAllEvents();
        this.element.classList.remove(MDroppableClassNames.Droppable);
    }

    public cleanupCssClasses(): void {
        this.element.classList.remove(MDroppableClassNames.Overing);
        this.element.classList.remove(MDroppableClassNames.CanDrop);
        this.element.classList.remove(MDroppableClassNames.CantDrop);
    }

    public leaveDroppable(event: DragEvent): void {
        if (MDroppable.currentHoverDroppable === this) {
            MDroppable.previousHoverContainer = this;
            MDroppable.currentHoverDroppable = undefined;
        }

        this.cleanupCssClasses();
        this.dispatchEvent(event, MDroppableEventNames.OnDragLeave);
    }

    public canDrop(draggable: MDraggable | undefined = MDraggable.currentDraggable): boolean {
        if (!draggable) { return false; }

        const canDrop = this.options.canDrop ? true : false;
        const acceptAny = this.options.acceptedActions.find(action => action === 'any') !== undefined;
        const draggableAction: string = draggable.options.action;
        const isAllowedAction = this.options.acceptedActions.find(action => action === draggableAction) !== undefined;
        return canDrop && !this.isHoveringOverDraggedElementChild() && (acceptAny || isAllowedAction);
    }

    private setOptions(value: MDroppableOptions): void {
        if (value.canDrop === undefined) { value.canDrop = true; }
        this._options = value;
        this._options.acceptedActions = this.options.canDrop ? this.options.acceptedActions || [DEFAULT_ACTION] : [];
    }

    private onDragLeave(event: DragEvent): void {
        if (this.isLeavingDroppable(event, this)) { this.leaveDroppable(event); }
    }

    private isLeavingDroppable(event: DragEvent, droppable?: MDroppable): boolean {
        if (!droppable) { return false; }
        const threshold: number = 3;
        return !isInElement(event, droppable.element) || MDroppable.previousHoverContainer !== MDroppable.currentHoverDroppable;
    }

    private onDragEnter(event: DragEvent): any {
        return this.onDragIn(event);
    }

    private onDragOver(event: DragEvent): any {
        return this.onDragIn(event);
    }

    private onDragIn(event: DragEvent): any {
        if (document.elementFromPoint) {
            const element = document.elementFromPoint(event.clientX, event.clientY) as HTMLElement;
            const droppable = MDOMPlugin.getRecursive(MDroppable, element);
            // Firefox sometime fires events on the wrong container for some reasons.  This fix it.
            if (droppable !== this) { this.cleanupCssClasses(); return; }
        }

        let className: string;
        if (this.canDrop()) {
            event.preventDefault();
            event.dataTransfer.dropEffect = MDropEffect.MMove;
            className = MDroppableClassNames.CanDrop;
        } else {
            event.dataTransfer.dropEffect = MDropEffect.MNone;
            className = MDroppableClassNames.CantDrop;
        }

        MDroppable.previousHoverContainer = MDroppable.currentHoverDroppable;
        MDroppable.currentHoverDroppable = this;
        if (MDroppable.previousHoverContainer !== MDroppable.currentHoverDroppable || !this.element.classList.contains(className)) {
            this.cleanupCssClasses();
            this.element.classList.add(MDroppableClassNames.Overing);
            this.element.classList.add(className);

            this.dispatchEvent(event, MDroppableEventNames.OnDragEnter);
        }

        this.dispatchEvent(event, MDroppableEventNames.OnDragOver);
    }

    private onDrop(event: DragEvent): void {
        event.stopPropagation();

        // Important for firefox as it tries to open dropped content as URL by default.
        event.preventDefault();
        this.cleanupCssClasses();
        MDroppable.currentHoverDroppable = undefined;
        this.dispatchEvent(event, MDroppableEventNames.OnDrop);
    }

    private dispatchEvent(event: DragEvent, name: string): void {
        const dropInfo = this.extractDropInfo(event);
        const customEvent: CustomEvent = document.createEvent('CustomEvent');
        customEvent.initCustomEvent(name, true, true, Object.assign(event, { dropInfo }));
        (customEvent as any).dropInfo = dropInfo;
        dispatchEvent(this.element, name, customEvent);
    }

    private extractDropInfo(event: DragEvent): MDropInfo {
        const data = MDraggable.currentDraggable ? MDraggable.currentDraggable.options.dragData || event.dataTransfer.getData('text') : undefined;
        const action: string = MDraggable.currentDraggable ? MDraggable.currentDraggable.options.action : DEFAULT_ACTION;
        const grouping: string = MDraggable.currentDraggable ? MDraggable.currentDraggable.options.grouping : undefined;
        return {
            action: action,
            grouping: action === MSortableAction.MoveGroup || ![MSortableAction.MoveGroup, MSortableAction.Move].find(item => item === action) ? grouping : undefined,
            data,
            canDrop: this.canDrop()
        };
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
    inserted(element: HTMLElement, binding: VNodeDirective, node: VNode): void {
        MDOMPlugin.attach(MDroppable, element, extractVnodeAttributes(binding, node));
    },
    update(element: HTMLElement, binding: VNodeDirective, node: VNode): void {
        MDOMPlugin.attach(MDroppable, element, extractVnodeAttributes(binding, node));
    },
    componentUpdated(element: HTMLElement, binding: VNodeDirective, node: VNode): void {
        MDOMPlugin.attach(MDroppable, element, extractVnodeAttributes(binding, node));
    },
    unbind(element: HTMLElement, binding: VNodeDirective): void {
        MDOMPlugin.detach(MDroppable, element);
    }
};

const DroppablePlugin: PluginObject<any> = {
    install(v, options): void {
        v.use(RemoveUserSelectPlugin);
        v.directive(DROPPABLE_NAME, Directive);
    }
};

export default DroppablePlugin;
