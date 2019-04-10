import { DirectiveOptions, VNode, VNodeDirective } from 'vue';
import { PluginObject } from 'vue/types/plugin';
import { getVNodeAttributeValue } from '../../utils/vue/directive';
import { dispatchEvent } from '../../utils/vue/events';
import { SORTABLE_NAME } from '../directive-names';
import { DomPlugin, MDOMPlugin, MElementDomPlugin, MountFunction, RefreshFunction } from '../domPlugin';
import DragAndDropPlugin from '../drag-and-drop/drag-and-drop-plugin';
import { MDraggable, MDraggableEventNames, MDraggableOptions } from '../drag-and-drop/draggable/draggable';
import { MDropEvent, MDroppable, MDroppableEventNames, MDroppableOptions } from '../drag-and-drop/droppable/droppable';
import { MDroppableGroup } from '../drag-and-drop/droppable/droppable-group';
import { MSortableDefaultInsertionMarkerBehavior, MSortableInsertionMarkerBehavior } from './insertion-behavior';

export interface MSortableOptions {
    items: any[];
    acceptedActions: string[];
    canSort?: any;
    encapsulate?: boolean;
}

export enum MSortableEventNames {
    OnAdd = 'sortable:add',
    OnMove = 'sortable:move',
    OnRemove = 'sortable:remove'
}

export enum MSortInsertPositions {
    Before = 'before',
    In = 'in',
    After = 'after'
}

export interface MSortEvent extends CustomEvent {
    sortInfo: MSortInfo;
}

export enum MSortableClassNames {
    Sortable = 'm--is-sortable',
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

export enum MSortableAction {
    Default = 'any',
    Move = 'move',
    MoveGroup = 'move_group'
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
                this.element.classList.add(MSortableClassNames.Sortable);
                const plugin: DomPlugin<MDroppableOptions> = MDOMPlugin.attach(MDroppable, this.element, {
                    acceptedActions: this.options.acceptedActions,
                    canDrop: true
                });
                plugin.addEventListener(MDroppableEventNames.OnDrop, (event: MDropEvent) => this.onDrop(event));
                plugin.addEventListener(MDroppableEventNames.OnDragEnter, (event: MDropEvent) => this.onDragEnter(event));
                plugin.addEventListener(MDroppableEventNames.OnDragLeave, (event: MDropEvent) => this.onDragLeave(event));
                plugin.addEventListener(MDroppableEventNames.OnDragOver, (event: MDropEvent) => this.onDragOver(event));
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
        this.element.classList.remove(MSortableClassNames.Sortable);
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
                    for (let i: number = 0; i < mutation.removedNodes.length; i++) {
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
        if (!value.items) { value.items = []; }

        const sortableGroup: MDroppableGroup | undefined = MDOMPlugin.getRecursive(MDroppableGroup, this.element);
        let acceptedActions: string[];
        if (!value.acceptedActions) {
            acceptedActions = [MSortableAction.Default];
        } else {
            acceptedActions = [...value.acceptedActions];
        }

        acceptedActions.push(MSortableAction.Move);
        if (!sortableGroup) { acceptedActions.push(MSortableAction.MoveGroup); }

        this._options = value;
        this._options.acceptedActions = acceptedActions;
    }

    private attachChilds(): void {
        let itemCounter: number = 0;
        const sortableGroup: MDroppableGroup | undefined = MDOMPlugin.getRecursive(MDroppableGroup, this.element);

        for (let i: number = 0; i < this.element.children.length; i++) {
            const currentElement: HTMLElement = this.element.children[i] as HTMLElement;
            const childDragValue: null | Attr = currentElement.attributes.getNamedItem('can-drag');

            let canDragValue: boolean;
            if (!this.options.canSort) {
                canDragValue = false;
            } else if (childDragValue && childDragValue.value === 'false') {
                canDragValue = false;
            } else if (childDragValue && childDragValue.value === 'true') {
                canDragValue = true;
            } else {
                canDragValue = this.options.canSort;
            }

            if (currentElement.classList.contains('emptyPlaceholder')) {
                this.attachEmptyPlaceholder(currentElement, sortableGroup ? sortableGroup.options : undefined);
            } else {
                const draggableGroup: MDroppableGroup | undefined = MDOMPlugin.get(MDroppableGroup, currentElement);
                const grouping: string | undefined = !sortableGroup ? draggableGroup ? draggableGroup.options : undefined : undefined;

                const draggablePlugin: DomPlugin<MDraggableOptions> = MDOMPlugin.attach(MDraggable, currentElement, {
                    action: !grouping ? MSortableAction.Move : MSortableAction.MoveGroup,
                    dragData: this.options.items[itemCounter++],
                    grouping,
                    canDrag: canDragValue
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
        for (let i: number = 0; i < this.element.children.length; i++) {
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
        this.onDragIn(event);
    }

    private onDragLeave(event: MDropEvent): void {
        event.stopPropagation();

        const newContainer: MSortable | undefined = MDroppable.currentHoverDroppable ? MDOMPlugin.getRecursive(MSortable, MDroppable.currentHoverDroppable.element) : undefined;
        if (!newContainer) {
            this.doCleanUp();
            MSortable.activeSortContainer = undefined;
        }

        if (newContainer && newContainer !== this) {
            this.doCleanUp();
        }
    }

    private onDragOver(event: MDropEvent): void {
        this.onDragIn(event);
    }

    private onDragIn(event: MDropEvent): void {
        event.stopPropagation();
        if (MSortable.activeSortContainer && MSortable.activeSortContainer !== this) {
            MSortable.activeSortContainer.doCleanUp();
        }
        MSortable.activeSortContainer = this;
        this.insertInsertionMarker(event);
    }

    private onDrop(event: MDropEvent): void {
        event.stopPropagation();
        const oldIndex: number = this.options.items.findIndex((item: any) => item === event.dropInfo.data);
        const isMoving: boolean = oldIndex !== -1 || event.dropInfo.action === MSortableAction.Move || event.dropInfo.action === MSortableAction.MoveGroup;

        let eventName: string;
        if (isMoving) {
            eventName = MSortableEventNames.OnMove;
        } else {
            eventName = MSortableEventNames.OnAdd;
        }

        const sortInfo: MSortInfo = {
            canDrop: event.dropInfo.canDrop,
            data: event.dropInfo.data,
            action: event.dropInfo.action,
            oldPosition: oldIndex,
            newPosition: this.getNewPosition(event, oldIndex),
            grouping: event.dropInfo.grouping
        };
        const changed: boolean = sortInfo.oldPosition !== sortInfo.newPosition;
        if (!changed) { return; }

        const customEvent: CustomEvent = document.createEvent('CustomEvent');
        customEvent.initCustomEvent(eventName, true, true, Object.assign(event, { sortInfo }));
        (customEvent as any).sortInfo = sortInfo;
        dispatchEvent(this.element, eventName, customEvent);

        if (MSortable.fromSortContainer && MSortable.fromSortContainer !== MSortable.activeSortContainer) {
            MSortable.fromSortContainer.onRemove(event);
        }

        // TODO: review => Verify this line is useful.
        this.onChildDragEnd(event);
    }

    private onRemove(event: MDropEvent): void {
        const oldIndex: number = this.options.items.findIndex((item: any) => item === event.dropInfo.data);
        if (oldIndex !== -1) {
            const sortInfo: MSortInfo = Object.assign(event.dropInfo, { oldPosition: oldIndex, newPosition: -1 });
            const customEvent: CustomEvent = document.createEvent('CustomEvent');
            customEvent.initCustomEvent(MSortableEventNames.OnRemove, true, true, Object.assign(event, { sortInfo }));
            (customEvent as any).sortInfo = sortInfo;
            dispatchEvent(this.element, MSortableEventNames.OnRemove, customEvent);
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
        // Fix for firefox flickering.
        if (event.detail.target.nodeType === Node.TEXT_NODE) {
            return;
        }

        if (!MDroppable.currentHoverDroppable || !event.dropInfo.canDrop || this.isHoveringOverDraggedElement()) { this.doCleanUp(); return; }

        const currentInsertPosition: MSortInsertPositions = this.getCurrentInsertPosition();
        const newInsertPosition: MSortInsertPositions = this.getInsertionMarkerBehavior().getInsertPosition(event);
        if (MDroppable.currentHoverDroppable === MDroppable.previousHoverContainer && currentInsertPosition === newInsertPosition) { return; }

        let element: HTMLElement;
        if (!this.isInsertingOnChild()) {
            element = newInsertPosition === MSortInsertPositions.Before
                ? this.element.children[0] as HTMLElement : this.element.children[this.element.children.length - 1] as HTMLElement;
        } else {
            element = MDroppable.currentHoverDroppable.element;
        }

        this.doCleanUp();
        let insertionClass: string | undefined;
        switch (newInsertPosition) {
            case MSortInsertPositions.After: insertionClass = MSortableClassNames.SortAfter; break;
            case MSortInsertPositions.Before: insertionClass = MSortableClassNames.SortBefore; break;
            case MSortInsertPositions.In: insertionClass = MSortableClassNames.SortIn; break;
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
        let index: number = 0;
        for (let i: number = 0; i < this.element.children.length; i++) {
            const child: HTMLElement = this.element.children[i] as HTMLElement;
            if (child.classList.contains(MSortableClassNames.EmptyPlaceholder)) { index--; }
            if (child.classList.contains(MSortableClassNames.SortBefore)) {
                break;
            }
            if (child.classList.contains(MSortableClassNames.SortAfter)) {
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
        const mSortAfterElement: Element | null = this.element.querySelector(`.${MSortableClassNames.SortAfter}`);
        if (mSortAfterElement) { return MSortInsertPositions.After; }

        const mSortBeforeElement: Element | null = this.element.querySelector(`.${MSortableClassNames.SortBefore}`);
        if (mSortBeforeElement) { return MSortInsertPositions.Before; }

        const mSortInElement: Element | null = this.element.querySelector(`.${MSortableClassNames.SortIn}`);
        if (mSortInElement) { return MSortInsertPositions.In; }

        return MSortInsertPositions.After;
    }

    private cleanUpInsertionClasses(): void {
        const mSortAfterElement: Element | null = this.element.querySelector(`.${MSortableClassNames.SortAfter}`);
        if (mSortAfterElement) { mSortAfterElement.classList.remove(MSortableClassNames.SortAfter); }
        this.element.classList.remove(MSortableClassNames.SortAfter);

        const mSortInElement: Element | null = this.element.querySelector(`.${MSortableClassNames.SortIn}`);
        if (mSortInElement) { mSortInElement.classList.remove(MSortableClassNames.SortIn); }
        this.element.classList.remove(MSortableClassNames.SortIn);

        const mSortBeforeElement: Element | null = this.element.querySelector(`.${MSortableClassNames.SortBefore}`);
        if (mSortBeforeElement) { mSortBeforeElement.classList.remove(MSortableClassNames.SortBefore); }
        this.element.classList.remove(MSortableClassNames.SortBefore);
    }
}

const extractVnodeAttributes: (binding: VNodeDirective, node: VNode) => MSortableOptions = (binding: VNodeDirective, node: VNode) => {
    return {
        items: getVNodeAttributeValue(node, 'items'),
        acceptedActions: getVNodeAttributeValue(node, 'accepted-actions'),
        canSort: binding.value,
        encapsulate: (binding.modifiers || {}).encapsulate || false
    };
};
const Directive: DirectiveOptions = {
    inserted(element: HTMLElement, binding: VNodeDirective, node: VNode): void {
        MDOMPlugin.attach(MSortable, element, extractVnodeAttributes(binding, node));
    },
    update(element: HTMLElement, binding: VNodeDirective, node: VNode): void {
        MDOMPlugin.attach(MSortable, element, extractVnodeAttributes(binding, node));
    },
    unbind(element: HTMLElement): void {
        MDOMPlugin.detach(MSortable, element);
    }
};

const SortablePlugin: PluginObject<any> = {
    install(v, _options): void {
        v.use(DragAndDropPlugin);
        v.directive(SORTABLE_NAME, Directive);
    }
};

export default SortablePlugin;
