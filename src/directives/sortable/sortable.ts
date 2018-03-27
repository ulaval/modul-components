import { mousePositionElement } from './mouse';
import { SORTABLE } from '../directive-names';
import { PluginObject } from 'vue/types/plugin';
import { DirectiveOptions, VNode, VNodeDirective } from 'vue';
import { MDraggable, MDraggableEventNames } from '../draggable/draggable';
import { MDroppable, MDropEvent, MDropEventNames, MDropInfo } from '../droppable/droppable';
import { getVNodeAttributeValue } from '../../utils/vue/directive';
import tabPanel from 'src/components/tab-panel/tab-panel';
import { MDOMPlugin, MElementPlugin } from '../domPlugin';

export interface MSortableOptions {
    items: any[];
    acceptedActions: string[];
    grouping?: any;
}

export enum MSortEventNames {
    OnAdd = 'sortable:add',
    OnMove = 'sortable:move',
    OnRemove = 'sortable:remove'
}

export enum MSortInsertPositions {
    Before = 'before',
    After = 'after'
}

export interface MSortEvent extends DragEvent {
    sortInfo: MSortInfo;
}

export enum MSortClassNames {
    MSortBefore = 'm--is-sortbefore',
    MSortAfter = 'm--is-sortafter'
}

export interface MSortInfo {
    action: string;
    oldGrouping?: string;
    newGrouping?: string;
    data: any;
    canDrop: boolean;
    oldPosition: number;
    newPosition: number;
}

/*
var observer = new MutationObserver(scrollToBottom);
    var config = {childList: true};
    observer.observe(this.el, config);
    function scrollToBottom() {
      // whatever it takes to scroll to the bottom
    }
*/
const DEFAULT_ACTION: string = 'any';
const MOVE_ACTION: string = 'move';

export class MSortable extends MElementPlugin<MSortableOptions> {
    public static defaultMountPoint: string = '__msortable__';
    public static activeSortContainer: MSortable | undefined;
    public static fromSortContainer: MSortable | undefined;

    private emptyPlaceHolderElement: HTMLElement | undefined;
    private placeHolderElement: HTMLElement | undefined;

    constructor(element: HTMLElement, options: MSortableOptions) {
        super(element, options);
    }

    public attach(): void {
        this.setOptions(this.options);
        const plugin = MDOMPlugin.attach(MDroppable, this.element, {
            acceptedActions: this.options.acceptedActions,
            canDrop: true
        });
        plugin.addEventListener(MDropEventNames.OnDrop, this.onDrop.bind(this));
        plugin.addEventListener(MDropEventNames.OnDragOver, this.onChildDragOver.bind(this));
        plugin.addEventListener(MDropEventNames.OnDragLeave, this.onChildDragLeave.bind(this));

        this.attachChilds();
    }

    public update(options: MSortableOptions): void {
        this.setOptions(options);
        this.attachChilds();
    }

    public detach(): void {
        MDOMPlugin.detach(MDroppable, this.element);
        this.detachChilds();
    }

    private setOptions(value: MSortableOptions): void {
        if (value.acceptedActions && value.acceptedActions.length) {
            value.acceptedActions.push(MOVE_ACTION);
        } else {
            value.acceptedActions = value.acceptedActions ? value.acceptedActions : [DEFAULT_ACTION];
        }
        this._options = value;
    }

    private attachChilds(): void {
        let itemCounter = 0;
        for (let i = 0; i < this.element.children.length; i++) {
            const currentElement: HTMLElement = this.element.children[i] as HTMLElement;

            if (currentElement.classList.contains('emptyPlaceholder')) {
                this.attachEmptyPlaceholder(currentElement);
            } else if (currentElement.classList.contains('placeholder')) {
                this.attachPlaceholder(currentElement);
            } else {
                const draggablePlugin: MDraggable = MDOMPlugin.attachUpdate(MDraggable, currentElement, {
                    action: MOVE_ACTION,
                    dragData: this.options.items[itemCounter++],
                    grouping: this.options.grouping
                });
                draggablePlugin.addEventListener(MDraggableEventNames.OnDragEnd, () => this.onChildDragEnd());
                draggablePlugin.addEventListener(MDraggableEventNames.OnDragStart, (event: MDropEvent) => this.onChildDragStart(event));

                const droppablePlugin = MDOMPlugin.attach(MDroppable, currentElement, {
                    acceptedActions: this.options.acceptedActions,
                    grouping: this.options.grouping,
                    canDrop: true
                });
                droppablePlugin.addEventListener(MDropEventNames.OnDragEnter, this.onChildDragEnter.bind(this));
                droppablePlugin.addEventListener(MDropEventNames.OnDragOver, this.onChildDragOver.bind(this));
                droppablePlugin.addEventListener(MDropEventNames.OnDragLeave, this.onChildDragLeave.bind(this));
            }
        }
    }

    private detachChilds(): void {
        for (let i = 0; i < this.element.children.length; i++) {
            const currentElement: HTMLElement = this.element.children[i] as HTMLElement;
            if (currentElement !== this.placeHolderElement && currentElement !== this.emptyPlaceHolderElement) {
                const currentElement: HTMLElement = this.element.children[i] as HTMLElement;
                MDOMPlugin.detach(MDraggable, currentElement);
                MDOMPlugin.detach(MDroppable, currentElement);
            }
        }
    }

    private attachEmptyPlaceholder(element: HTMLElement): void {
        this.emptyPlaceHolderElement = this.setupPlaceholder(element);
        if (this.emptyPlaceHolderElement) {
            this.emptyPlaceHolderElement.style.display = this.options.items.length ? 'none' : 'inherit';
        }
    }

    private attachPlaceholder(element: HTMLElement): void {
        this.placeHolderElement = this.setupPlaceholder(element);
        if (this.placeHolderElement) {
            this.placeHolderElement.style.display = 'none';
        }
    }

    private setupPlaceholder(element: HTMLElement): HTMLElement | undefined {
        if (!element) return undefined;

        if (element && !MDOMPlugin.get(MDroppable, element)) {
            const plugin = MDOMPlugin.attach(MDroppable, element, {
                acceptedActions: this.options.acceptedActions,
                grouping: this.options.grouping,
                canDrop: true
            });
            plugin.addEventListener(MDropEventNames.OnDragEnter, this.onChildDragEnter.bind(this));
            plugin.addEventListener(MDropEventNames.OnDragOver, this.onChildDragOver.bind(this));
            plugin.addEventListener(MDropEventNames.OnDragLeave, (e: DragEvent) => { e.stopImmediatePropagation(); e.stopPropagation(); });
        }

        return element;
    }

    private detachPlaceholder(placeHolder: HTMLElement | undefined): void {
        if (placeHolder) {
            placeHolder.style.display = '';

            MDOMPlugin.detach(MDroppable, placeHolder);
        }
    }

    private onDrop(event: MDropEvent): void {
        event.stopPropagation();
        const oldIndex: number = this.options.items.findIndex((item: any) => item === event.dropInfo.data);
        const isMoving: boolean = oldIndex !== -1 || event.dropInfo.action === MOVE_ACTION;

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
            newPosition: this.getNewPosition(event),
            oldGrouping: MSortable.fromSortContainer ? MSortable.fromSortContainer.options.grouping : undefined,
            newGrouping: this.options.grouping
        };
        const sortEvent: Event = Object.assign(customEvent, { clientX: event.clientX, clientY: event.clientY }, { sortInfo });
        customEvent.initCustomEvent(eventName, true, true, event.detail);
        this.element.dispatchEvent(sortEvent);

        if (MSortable.fromSortContainer && MSortable.fromSortContainer !== MSortable.activeSortContainer) {
            MSortable.fromSortContainer.onRemove(event);
        }
    }

    private onRemove(event: MDropEvent): void {
        const oldIndex: number = this.options.items.findIndex((item: any) => item === event.dropInfo.data);
        if (oldIndex !== -1) {
            const customEvent: CustomEvent = document.createEvent('CustomEvent');
            const sortInfo: MSortInfo = Object.assign(event.dropInfo, { oldPosition: oldIndex, newPosition: -1 });
            const sortEvent: Event = Object.assign(customEvent, { clientX: event.clientX, clientY: event.clientY }, { sortInfo });
            customEvent.initCustomEvent(MSortEventNames.OnRemove, true, true, event.detail);
            this.element.dispatchEvent(sortEvent);
        }
    }

    private onChildDragEnd(): void {
        this.hidePlaceHolder();
        MSortable.fromSortContainer = undefined;
        MSortable.activeSortContainer = undefined;
        this.cleanUpInsertionClasses();
    }

    private onChildDragEnter(event: MDropEvent): void {
        event.preventDefault();
        event.stopImmediatePropagation();
        this.markAsActiveSort();
        this.positionPlaceholder(event);
    }

    private onChildDragLeave(event: MDropEvent): void {
        event.preventDefault();
        event.stopImmediatePropagation();

        MSortable.activeSortContainer = undefined;
        this.hidePlaceHolder();
        this.cleanUpInsertionClasses();
    }

    private onChildDragOver(event: MDropEvent): void {
        event.preventDefault();
        event.stopImmediatePropagation();
        this.markAsActiveSort();
        this.positionPlaceholder(event);
    }

    private onChildDragStart(event: MDropEvent): void {
        MSortable.fromSortContainer = this;
    }

    private positionPlaceholder(event: MDropEvent): void {
        if (!this.hasItems() || this.isHoveringInsertionPlaceholder() || !MDroppable.currentHoverDroppable || !event.dropInfo.canDrop) {
            if (this.isHoveringOverDraggedElement()) this.hidePlaceHolder();
            return;
        }

        const insertPosition: MSortInsertPositions = this.computeInsertPosition(event);
        if (this.isInsertingAroundChild()) {
            this.insertPlaceHolder(MDroppable.currentHoverDroppable.element, insertPosition === MSortInsertPositions.Before ? 'beforebegin' : 'afterend');
        } else {
            this.insertPlaceHolder(this.element, insertPosition === MSortInsertPositions.Before ? 'afterbegin' : 'beforeend');
        }
    }

    private insertPlaceHolder(element: HTMLElement, insertPosition: InsertPosition): void {
        this.cleanUpInsertionClasses();
        if (this.placeHolderElement) {
            this.showPlaceHolder();

            const insertionClass: string = insertPosition.includes('before') ? MSortClassNames.MSortBefore : MSortClassNames.MSortAfter;
            element.insertAdjacentElement(insertPosition, this.placeHolderElement);
            element.classList.add(insertionClass);
        }
    }

    private markAsActiveSort(): void {
        if (MSortable.activeSortContainer !== this) {
            if (MSortable.activeSortContainer) {
                MSortable.activeSortContainer.hidePlaceHolder();
            }

            MSortable.activeSortContainer = this;
        }
    }

    private getNewPosition(event: MDropEvent): number {
        if (!MDroppable.currentHoverDroppable || !this.hasItems() || !MDroppable.currentHoverDroppable) return 0;

        // We are hovering over one of the sortable's child.
        const insertPosition: MSortInsertPositions = this.computeInsertPosition(event);
        if (MDroppable.currentHoverDroppable.element !== this.element) {
            const currentHoverElement = MDOMPlugin.get(MDraggable, MDroppable.currentHoverDroppable.element) as MDraggable;
            const itemIndex = this.options.items.indexOf(currentHoverElement.options.dragData);
            return insertPosition === MSortInsertPositions.Before
                ? itemIndex
                : itemIndex + 1;
        } else { // We are hovering the sortable itself.
            return MSortInsertPositions.Before ? 0 : this.options.items.length - 1;
        }
    }

    private computeInsertPosition(event: MDropEvent): MSortInsertPositions {
        if (MDroppable.currentHoverDroppable) {
            const mousePosition = mousePositionElement(event);
            if (mousePosition.y < MDroppable.currentHoverDroppable.element.offsetHeight / 2) {
                return MSortInsertPositions.Before;
            } else {
                return MSortInsertPositions.After;
            }
        }

        return MSortInsertPositions.After;
    }

    private showPlaceHolder(): void {
        if (this.placeHolderElement) this.placeHolderElement.style.display = 'inherit';
    }

    private hidePlaceHolder(): void {
        if (this.placeHolderElement) this.placeHolderElement.style.display = 'none';
    }

    private isHoveringInsertionPlaceholder(): boolean | undefined {
        return this.placeHolderElement && MDroppable.currentHoverDroppable && this.placeHolderElement === MDroppable.currentHoverDroppable.element;
    }

    private isHoveringOverDraggedElement(): boolean {
        return MDraggable.currentDraggable !== undefined && MDroppable.currentHoverDroppable !== undefined
            && MDroppable.currentHoverDroppable.element === MDraggable.currentDraggable.element;
    }

    private isInsertingAroundChild(): boolean {
        return MDroppable.currentHoverDroppable !== undefined && MDroppable.currentHoverDroppable.element !== this.element;
    }

    private hasItems(): boolean {
        return this.options.items.length > 0;
    }

    private cleanUpInsertionClasses(): void {
        const parent: HTMLElement = (this.element.parentNode as HTMLElement);
        const mSortAfterElement = parent.querySelector(`.${MSortClassNames.MSortAfter}`);
        if (mSortAfterElement) mSortAfterElement.classList.remove(MSortClassNames.MSortAfter);

        const mSortBeforeElement = parent.querySelector(`.${MSortClassNames.MSortBefore}`);
        if (mSortBeforeElement) mSortBeforeElement.classList.remove(MSortClassNames.MSortBefore);
    }
}

const extractVnodeAttributes: (node: VNode) => MSortableOptions = (node: VNode) => {
    return {
        items: getVNodeAttributeValue(node, 'items'),
        acceptedActions: getVNodeAttributeValue(node, 'accepted-actions'),
        grouping: getVNodeAttributeValue(node, 'grouping')
    };
};
const Directive: DirectiveOptions = {
    bind(element: HTMLElement, binding: VNodeDirective, node: VNode): void {
        MDOMPlugin.attach(MSortable, element, extractVnodeAttributes(node));
    },
    componentUpdated(element: HTMLElement, binding: VNodeDirective, node: VNode): void {
        MDOMPlugin.update(MSortable, element, extractVnodeAttributes(node));
    },
    unbind(element: HTMLElement, binding: VNodeDirective): void {
        MDOMPlugin.detach(MSortable, element);
    }
};

const SortablePlugin: PluginObject<any> = {
    install(v, options): void {
        v.directive(SORTABLE, Directive);
    }
};

export default SortablePlugin;
