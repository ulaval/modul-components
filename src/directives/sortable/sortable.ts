import { DirectiveOptions, VNode, VNodeDirective } from 'vue';
import { PluginObject } from 'vue/types/plugin';

import { isInElement, mousePositionElement } from '../../utils/mouse/mouse';
import { dispatchEvent, getVNodeAttributeValue } from '../../utils/vue/directive';
import { SORTABLE_NAME } from '../directive-names';
import { MDOMPlugin, MElementDomPlugin, MountFunction, RefreshFunction } from '../domPlugin';
import { MDraggable, MDraggableEventNames } from '../draggable/draggable';
import { MDropEvent, MDropEventNames, MDroppable } from '../droppable/droppable';
import { MDroppableGroup } from '../droppable/droppable-group';

export interface MSortableOptions {
    items: any[];
    acceptedActions: string[];
    canSort?: any;
}

export enum MSortEventNames {
    OnAdd = 'sortable:add',
    OnMove = 'sortable:move',
    OnRemove = 'sortable:remove'
}

export enum MSortInsertPositions {
    Before = 'before',
    In = 'in',
    After = 'after'
}

export interface MSortEvent extends DragEvent {
    sortInfo: MSortInfo;
}

export enum MSortClassNames {
    SortBefore = 'm--is-sortbefore',
    SortIn = 'm--is-sortin',
    SortAfter = 'm--is-sortafter',
    EmptyPlaceholder = 'emptyPlaceholder'
}

export interface MSortInfo {
    action: string;
    grouping?: string;
    data: any;
    canDrop: boolean;
    oldPosition: number;
    newPosition: number;
}

const DEFAULT_ACTION: string = 'any';
const MOVE_ACTION: string = 'move';
const MOVE_GROUP_ACTION: string = 'move_group';

export interface MSortableInsertionMarkerBehavior {
    getInsertPosition(event: MDropEvent): MSortInsertPositions;
}

export class MSortableDefaultInsertionMarkerBehavior implements MSortableInsertionMarkerBehavior {
    getInsertPosition(event: MDropEvent): MSortInsertPositions {
        if (MDroppable.currentHoverDroppable) {
            const mousePosition = mousePositionElement(event, MDroppable.currentHoverDroppable.element);
            if (mousePosition.y < MDroppable.currentHoverDroppable.element.offsetHeight / 2) {
                return MSortInsertPositions.Before;
            } else {
                return MSortInsertPositions.After;
            }
        }

        return MSortInsertPositions.After;
    }
}

export class MSortableGroupingInsertionMarkerBehavior implements MSortableInsertionMarkerBehavior {
    getInsertPosition(event: MDropEvent): MSortInsertPositions {
        if (!MDroppable.currentHoverDroppable) { return MSortInsertPositions.After; }

        const mousePosition = mousePositionElement(event, MDroppable.currentHoverDroppable.element);
        if (mousePosition.y <= 10) { return MSortInsertPositions.Before; }
        if (mousePosition.y > MDroppable.currentHoverDroppable.element.offsetHeight - 10) { return MSortInsertPositions.After; }

        return MSortInsertPositions.In;
    }
}

export class MSortable extends MElementDomPlugin<MSortableOptions> {
    public static defaultMountPoint: string = '__msortable__';
    public static activeSortContainer: MSortable | undefined;
    public static fromSortContainer: MSortable | undefined;

    private emptyPlaceHolderElement: HTMLElement | undefined;

    private observer: MutationObserver;

    constructor(element: HTMLElement, options: MSortableOptions) {
        super(element, options);
    }

    public doCleanUp(): void {
        this.cleanUpInsertionClasses();
    }

    public attach(mount: MountFunction): void {
        this.observer = new MutationObserver(mutations => this.manageMutation(mutations));
        this.observer.observe(this.element, { childList: true });
        this.setOptions(this.options);
        this.attachChilds();
        if (this.options.canSort) {
            mount(() => {
                const plugin = MDOMPlugin.attach(MDroppable, this.element, {
                    acceptedActions: this.options.acceptedActions,
                    canDrop: true
                });
                plugin.addEventListener(MDropEventNames.OnDrop, (event: MDropEvent) => this.onDrop(event));
                plugin.addEventListener(MDropEventNames.OnDragEnter, (event: MDropEvent) => this.onDragEnter(event));
                plugin.addEventListener(MDropEventNames.OnDragLeave, (event: MDropEvent) => this.onDragLeave(event));
                plugin.addEventListener(MDropEventNames.OnDragOver, (event: MDropEvent) => this.onDragOver(event));
            });
        }
    }

    public update(options: MSortableOptions, refresh: RefreshFunction): void {
        this.setOptions(options);
        if (this.options.canSort) {
            refresh(() => this.attachChilds());
        }
    }

    public detach(): void {
        this.observer.disconnect();
        this.doCleanUp();
        this.detachChilds();
        MDOMPlugin.detach(MDroppable, this.element);
    }

    private manageMutation(mutations: MutationRecord[]): void {
        let refreshChild: boolean = false;
        mutations.forEach(mutation => {
            // when an item leave the sortable we have to clean it up.
            if (mutation.type === 'childList') {
                if (mutation.removedNodes.length) {
                    for (let i = 0; i < mutation.removedNodes.length; i++) {
                        const currentElement: HTMLElement = mutation.removedNodes[i] as HTMLElement;
                        MDOMPlugin.detach(MDraggable, currentElement);
                        MDOMPlugin.detach(MDroppable, currentElement);
                    }
                }
                if (mutation.addedNodes) { refreshChild = true; }
            }
        });

        if (refreshChild) { this.attachChilds(); }
    }

    private setOptions(value: MSortableOptions): void {
        if (value.canSort === undefined) { value.canSort = true; }

        const sortableGroup = MDOMPlugin.getRecursive(MDroppableGroup, this.element);
        let acceptedActions: string[];
        if (!value.acceptedActions || !value.acceptedActions.length) {
            acceptedActions = [DEFAULT_ACTION];
        } else {
            acceptedActions = [...value.acceptedActions];
        }

        acceptedActions.push(MOVE_ACTION);
        if (!sortableGroup) { acceptedActions.push(MOVE_GROUP_ACTION); }

        this._options = value;
        this._options.acceptedActions = acceptedActions;
    }

    private attachChilds(): void {
        let itemCounter = 0;
        const sortableGroup = MDOMPlugin.getRecursive(MDroppableGroup, this.element);
        for (let i = 0; i < this.element.children.length; i++) {
            const currentElement: HTMLElement = this.element.children[i] as HTMLElement;

            if (currentElement.classList.contains('emptyPlaceholder')) {
                this.attachEmptyPlaceholder(currentElement, sortableGroup ? sortableGroup.options : undefined);
            } else {
                const draggableGroup = MDOMPlugin.get(MDroppableGroup, currentElement);
                const grouping = !sortableGroup ? draggableGroup ? draggableGroup.options : undefined : undefined;

                const draggablePlugin = MDOMPlugin.attach(MDraggable, currentElement, {
                    action: !grouping ? MOVE_ACTION : MOVE_GROUP_ACTION,
                    dragData: this.options.items[itemCounter++],
                    grouping,
                    canDrag: this.options.canSort
                });
                draggablePlugin.removeEventListener(MDraggableEventNames.OnDragEnd);
                draggablePlugin.removeEventListener(MDraggableEventNames.OnDragStart);
                draggablePlugin.addEventListener(MDraggableEventNames.OnDragEnd, (event: MDropEvent) => this.onChildDragEnd(event));
                draggablePlugin.addEventListener(MDraggableEventNames.OnDragStart, (event: MDropEvent) => this.onChildDragStart(event));

                MDOMPlugin.attach(MDroppable, currentElement, {
                    acceptedActions: this.options.acceptedActions,
                    canDrop: this.options.canSort
                });
            }
        }
    }

    private detachChilds(): void {
        for (let i = 0; i < this.element.children.length; i++) {
            const currentElement: HTMLElement = this.element.children[i] as HTMLElement;
            MDOMPlugin.detach(MDraggable, currentElement);
            MDOMPlugin.detach(MDroppable, currentElement);
        }
    }

    private attachEmptyPlaceholder(element: HTMLElement, grouping?: string): void {
        if (element) {
            MDOMPlugin.attach(MDroppable, element, {
                acceptedActions: this.options.acceptedActions,
                canDrop: this.options.canSort
            });
        }

        this.emptyPlaceHolderElement = element;
        if (this.emptyPlaceHolderElement) {
            this.emptyPlaceHolderElement.style.display = this.options.items.length ? 'none' : '';
        }
    }

    private onDragEnter(event: MDropEvent): void {
        event.stopPropagation();
        if (MSortable.activeSortContainer && MSortable.activeSortContainer !== this) { MSortable.activeSortContainer.doCleanUp(); }
        MSortable.activeSortContainer = this;
        this.insertInsertionMarker(event);
    }

    private onDragLeave(event: MDropEvent): void {
        event.stopPropagation();

        const newContainer = MDroppable.currentHoverDroppable ? MDOMPlugin.getRecursive(MSortable, MDroppable.currentHoverDroppable.element) : undefined;
        if (!newContainer || !isInElement(event, this.element)) {
            this.doCleanUp();
            MSortable.activeSortContainer = undefined;
        }

        if (newContainer && newContainer !== this) {
            this.doCleanUp();
        }
    }

    private onDragOver(event: MDropEvent): void {
        event.stopPropagation();
        this.insertInsertionMarker(event);
    }

    private onDrop(event: MDropEvent): void {
        event.stopPropagation();
        const oldIndex: number = this.options.items.findIndex((item: any) => item === event.dropInfo.data);
        const isMoving: boolean = oldIndex !== -1 || event.dropInfo.action === MOVE_ACTION || event.dropInfo.action === MOVE_GROUP_ACTION;

        let eventName: string;
        if (isMoving) {
            eventName = MSortEventNames.OnMove;
        } else {
            eventName = MSortEventNames.OnAdd;
        }

        const customEvent: CustomEvent = document.createEvent('CustomEvent');
        const sortInfo: MSortInfo = {
            canDrop: event.dropInfo.canDrop,
            data: event.dropInfo.data,
            action: event.dropInfo.action,
            oldPosition: oldIndex,
            newPosition: this.getNewPosition(event, oldIndex),
            grouping: this.getNewGrouping(event, oldIndex)
        };
        const changed: boolean = sortInfo.oldPosition !== sortInfo.newPosition;
        if (!changed) { return; }

        const sortEvent: Event = Object.assign(customEvent, { clientX: event.clientX, clientY: event.clientY }, { sortInfo });
        customEvent.initCustomEvent(eventName, true, true, event.detail);
        dispatchEvent(this.element, eventName, sortEvent);

        if (MSortable.fromSortContainer && MSortable.fromSortContainer !== MSortable.activeSortContainer) {
            MSortable.fromSortContainer.onRemove(event);
        }

        // TODO: review => Verify this line is useful.
        this.onChildDragEnd(event);
    }

    private onRemove(event: MDropEvent): void {
        const oldIndex: number = this.options.items.findIndex((item: any) => item === event.dropInfo.data);
        if (oldIndex !== -1) {
            const customEvent: CustomEvent = document.createEvent('CustomEvent');
            const sortInfo: MSortInfo = Object.assign(event.dropInfo, { oldPosition: oldIndex, newPosition: -1 });
            const sortEvent: Event = Object.assign(customEvent, { clientX: event.clientX, clientY: event.clientY }, { sortInfo });
            customEvent.initCustomEvent(MSortEventNames.OnRemove, true, true, event.detail);
            dispatchEvent(this.element, MSortEventNames.OnRemove, sortEvent);
        }
    }

    private onChildDragEnd(event: MDropEvent): void {
        event.stopPropagation();
        if (MSortable.fromSortContainer) { MSortable.fromSortContainer.doCleanUp(); }
        if (MSortable.activeSortContainer) { MSortable.activeSortContainer.doCleanUp(); }
        this.doCleanUp();
        MSortable.fromSortContainer = undefined;
        MSortable.activeSortContainer = undefined;
    }

    private onChildDragStart(event: MDropEvent): void {
        event.stopPropagation();
        MSortable.fromSortContainer = this;
    }

    private insertInsertionMarker(event: MDropEvent): void {
        if (!MDroppable.currentHoverDroppable || this.isHoveringOverDraggedElement()) { this.cleanUpInsertionClasses(); return; }

        const currentInsertPosition = this.getCurrentInsertPosition();
        const newInsertPosition: MSortInsertPositions = this.getInsertionMarkerBehavior().getInsertPosition(event);
        if (MDroppable.currentHoverDroppable === MDroppable.previousHoverContainer && currentInsertPosition === newInsertPosition) {
            return;
        }

        let element: HTMLElement;
        if (!this.isInsertingOnChild()) {
            element = newInsertPosition === MSortInsertPositions.Before
                ? this.element.children[0] as HTMLElement : this.element.children[this.element.children.length - 1] as HTMLElement;
        } else {
            element = MDroppable.currentHoverDroppable.element;
        }

        this.cleanUpInsertionClasses();
        let insertionClass: string | undefined;
        switch (newInsertPosition) {
            case MSortInsertPositions.After: insertionClass = MSortClassNames.SortAfter; break;
            case MSortInsertPositions.Before: insertionClass = MSortClassNames.SortBefore; break;
            case MSortInsertPositions.In: insertionClass = MSortClassNames.SortIn; break;
        }
        if (insertionClass) { element.classList.add(insertionClass); }
    }

    private getInsertionMarkerBehavior(): MSortableInsertionMarkerBehavior {
        /*const droppable: MDroppable = MDroppable.currentHoverDroppable as MDroppable;

        if (MDOMPlugin.get(MDroppableGroup, droppable.element)) {
            return new MSortableGroupingInsertionMarkerBehavior();
        }
*/
        return new MSortableDefaultInsertionMarkerBehavior();
    }

    private getNewPosition(event: MDropEvent, oldPosition: number): number {
        let index = 0;
        for (let i = 0; i < this.element.children.length; i++) {
            const child: HTMLElement = this.element.children[i] as HTMLElement;
            if (child.classList.contains(MSortClassNames.EmptyPlaceholder)) { index--; }
            if (child.classList.contains(MSortClassNames.SortBefore)) {
                break;
            }
            if (child.classList.contains(MSortClassNames.SortAfter)) {
                index++;
                break;
            }
            index++;
        }

        let newIndex: number = index < 0 ? 0 : index;
        if (oldPosition !== -1 && oldPosition < newIndex) {
            newIndex--;
        }
        return newIndex;
    }

    private getNewGrouping(event: MDropEvent, oldPosition: number): string | undefined {
        if (event.dropInfo.action === MOVE_GROUP_ACTION) {
            return event.dropInfo.grouping;
        } else {
            return undefined;
        }
    }

    private isHoveringOverDraggedElement(): boolean {
        return MDraggable.currentDraggable !== undefined && MDroppable.currentHoverDroppable !== undefined
            && MDroppable.currentHoverDroppable.element === MDraggable.currentDraggable.element;
    }

    private isInsertingOnChild(): boolean {
        return MDroppable.currentHoverDroppable !== undefined && MDroppable.currentHoverDroppable.element !== this.element;
    }

    private hasItems(): boolean {
        return this.options.items.length > 0;
    }

    private getCurrentInsertPosition(): MSortInsertPositions {
        const mSortAfterElement = this.element.querySelector(`.${MSortClassNames.SortAfter}`);
        if (mSortAfterElement) { return MSortInsertPositions.After; }

        const mSortBeforeElement = this.element.querySelector(`.${MSortClassNames.SortBefore}`);
        if (mSortBeforeElement) { return MSortInsertPositions.Before; }

        const mSortInElement = this.element.querySelector(`.${MSortClassNames.SortIn}`);
        if (mSortInElement) { return MSortInsertPositions.In; }

        return MSortInsertPositions.After;
    }

    private cleanUpInsertionClasses(): void {
        const mSortAfterElement = this.element.querySelector(`.${MSortClassNames.SortAfter}`);
        if (mSortAfterElement) { mSortAfterElement.classList.remove(MSortClassNames.SortAfter); }
        this.element.classList.remove(MSortClassNames.SortAfter);

        const mSortInElement = this.element.querySelector(`.${MSortClassNames.SortIn}`);
        if (mSortInElement) { mSortInElement.classList.remove(MSortClassNames.SortIn); }
        this.element.classList.remove(MSortClassNames.SortIn);

        const mSortBeforeElement = this.element.querySelector(`.${MSortClassNames.SortBefore}`);
        if (mSortBeforeElement) { mSortBeforeElement.classList.remove(MSortClassNames.SortBefore); }
        this.element.classList.remove(MSortClassNames.SortBefore);
    }
}

const extractVnodeAttributes: (binding: VNodeDirective, node: VNode) => MSortableOptions = (binding: VNodeDirective, node: VNode) => {
    return {
        items: getVNodeAttributeValue(node, 'items'),
        acceptedActions: getVNodeAttributeValue(node, 'accepted-actions'),
        canSort: binding.value
    };
};
const Directive: DirectiveOptions = {
    inserted(element: HTMLElement, binding: VNodeDirective, node: VNode): void {
        MDOMPlugin.attach(MSortable, element, extractVnodeAttributes(binding, node));
    },
    update(element: HTMLElement, binding: VNodeDirective, node: VNode): void {
        MDOMPlugin.attach(MSortable, element, extractVnodeAttributes(binding, node));
    },
    unbind(element: HTMLElement, binding: VNodeDirective): void {
        MDOMPlugin.detach(MSortable, element);
    }
};

const SortablePlugin: PluginObject<any> = {
    install(v, options): void {
        v.directive(SORTABLE_NAME, Directive);
    }
};

export default SortablePlugin;
