import { mousePositionElement } from './mouse';
import { SORTABLE } from '../directive-names';
import { PluginObject } from 'vue/types/plugin';
import { DirectiveOptions, VNode, VNodeDirective } from 'vue';
import { MDraggable, MDraggableEventNames } from '../draggable/draggable';
import { MDroppable, MDropEvent, MDropEventNames, MDropInfo } from '../droppable/droppable';
import tabPanel from 'src/components/tab-panel/tab-panel';
import { MDOMPlugin, MElementPlugin } from '../domPlugin';
import { getVNodeAttributeValue } from '../../utils/vue/directive';
import { MSortableGroup } from './sortable-group';

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
    SortBefore = 'm--is-sortbefore',
    SortAfter = 'm--is-sortafter',
    EmptyPlaceholder = 'emptyPlaceholder',
    PlaceHolder = 'placeholder'
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
        plugin.addEventListener(MDropEventNames.OnDragEnter, (event: MDropEvent) => this.onDragEnter(event));
        plugin.addEventListener(MDropEventNames.OnDragLeave, (event: MDropEvent) => this.onDragLeave(event));
        plugin.addEventListener(MDropEventNames.OnDragOver, (event: MDropEvent) => this.onDragOver(event));

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
        const sortableGroup: MSortableGroup | undefined = MDOMPlugin.getRecursive(MSortableGroup, this.element);
        let acceptedActions: string[];
        if (!value.acceptedActions.length) {
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
        const sortableGroup: MSortableGroup | undefined = MDOMPlugin.getRecursive(MSortableGroup, this.element);
        for (let i = 0; i < this.element.children.length; i++) {
            const currentElement: HTMLElement = this.element.children[i] as HTMLElement;

            if (currentElement.classList.contains('emptyPlaceholder')) {
                this.attachEmptyPlaceholder(currentElement, sortableGroup ? sortableGroup.options : this.options.grouping);
            } else if (currentElement.classList.contains('placeholder')) {
                this.attachPlaceholder(currentElement, sortableGroup ? sortableGroup.options : this.options.grouping);
            } else {
                const draggableGroup: MSortableGroup | undefined = MDOMPlugin.getRecursive(MSortableGroup, currentElement);
                const grouping = !sortableGroup ? draggableGroup ? draggableGroup.options : undefined : undefined;
                const draggablePlugin: MDraggable = MDOMPlugin.attachUpdate(MDraggable, currentElement, {
                    action: !grouping ? MOVE_ACTION : MOVE_GROUP_ACTION,
                    dragData: this.options.items[itemCounter++],
                    grouping
                });
                draggablePlugin.removeEventListener(MDraggableEventNames.OnDragEnd);
                draggablePlugin.removeEventListener(MDraggableEventNames.OnDragStart);
                draggablePlugin.addEventListener(MDraggableEventNames.OnDragEnd, (event: MDropEvent) => this.onChildDragEnd(event));
                draggablePlugin.addEventListener(MDraggableEventNames.OnDragStart, (event: MDropEvent) => this.onChildDragStart(event));

                MDOMPlugin.attachUpdate(MDroppable, currentElement, {
                    acceptedActions: this.options.acceptedActions,
                    canDrop: true
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
        this.emptyPlaceHolderElement = this.setupPlaceholder(element, grouping);
        if (this.emptyPlaceHolderElement) {
            this.emptyPlaceHolderElement.style.display = this.options.items.length ? 'none' : 'inherit';
        }
    }

    private attachPlaceholder(element: HTMLElement, grouping?: string): void {
        this.placeHolderElement = this.setupPlaceholder(element, grouping);
        if (this.placeHolderElement) { this.hidePlaceHolder(); }
    }

    private setupPlaceholder(element: HTMLElement, grouping?: string): HTMLElement | undefined {
        if (!element) { return undefined; }

        MDOMPlugin.attachUpdate(MDroppable, element, {
            acceptedActions: this.options.acceptedActions,
            canDrop: true
        });

        return element;
    }

    private onDragEnter(event: MDropEvent): void {
        event.stopPropagation();
        event.preventDefault();
        if (MSortable.activeSortContainer && MSortable.activeSortContainer !== this) { MSortable.activeSortContainer.doCleanUp(); }
        MSortable.activeSortContainer = this;
        this.positionPlaceholder(event);
    }

    private onDragLeave(event: MDropEvent): void {
        event.stopPropagation();
        event.preventDefault();
        const newContainer = MDroppable.currentHoverDroppable ? MDOMPlugin.getRecursive(MSortable, MDroppable.currentHoverDroppable.element) : undefined;
        if (!newContainer || newContainer !== this) {
            if (MSortable.activeSortContainer) { MSortable.activeSortContainer.doCleanUp(); }
            if (!newContainer) { MSortable.activeSortContainer = undefined; }
            this.doCleanUp();
        }
    }

    private doCleanUp(): void {
        this.hidePlaceHolder();
        this.cleanUpInsertionClasses();
    }

    private onDragOver(event: MDropEvent): void {
        event.stopPropagation();
        event.preventDefault();
        this.positionPlaceholder(event);
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
        this.element.dispatchEvent(sortEvent);

        if (MSortable.fromSortContainer && MSortable.fromSortContainer !== MSortable.activeSortContainer) {
            MSortable.fromSortContainer.onRemove(event);
        }

        this.onChildDragEnd(event);
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

    private onChildDragEnd(event: MDropEvent): void {
        event.preventDefault();
        event.stopPropagation();
        if (MSortable.fromSortContainer) { MSortable.fromSortContainer.doCleanUp(); }
        if (MSortable.activeSortContainer) { MSortable.activeSortContainer.doCleanUp(); }
        this.doCleanUp();
        MSortable.fromSortContainer = undefined;
        MSortable.activeSortContainer = undefined;
    }

    private onChildDragStart(event: MDropEvent): void {
        event.preventDefault();
        event.stopPropagation();
        MSortable.fromSortContainer = this;
    }

    private positionPlaceholder(event: MDropEvent): void {
        if (!MDroppable.currentHoverDroppable) { return; }

        if (!this.hasItems() || this.isHoveringInsertionPlaceholder() || !MDroppable.currentHoverDroppable || !event.dropInfo.canDrop) {
            if (this.isHoveringOverDraggedElement()) { this.hidePlaceHolder(); }
            return;
        }

        let element: HTMLElement;
        const insertPosition: MSortInsertPositions = this.computeInsertPosition(event);
        if (!this.isInsertingAroundChild()) {
            element = insertPosition === MSortInsertPositions.Before
                ? this.element.children[0] as HTMLElement : this.element.children[this.element.children.length - 1] as HTMLElement;
        } else {
            element = MDroppable.currentHoverDroppable.element;
        }

        this.insertPlaceHolder(element, insertPosition === MSortInsertPositions.Before ? 'beforebegin' : 'afterend');
    }

    private insertPlaceHolder(element: HTMLElement, insertPosition: InsertPosition): void {
        this.cleanUpInsertionClasses();
        const insertionClass: string = insertPosition.includes('before') ? MSortClassNames.SortBefore : MSortClassNames.SortAfter;
        element.classList.add(insertionClass);
        if (this.placeHolderElement) {
            this.showPlaceHolder();
            element.insertAdjacentElement(insertPosition, this.placeHolderElement);
        }
    }

    private getNewPosition(event: MDropEvent, oldPosition: number): number {
        let index = 0;
        for (let i = 0; i < this.element.children.length; i++) {
            const child: HTMLElement = this.element.children[i] as HTMLElement;
            if (child.classList.contains(MSortClassNames.EmptyPlaceholder)) { index--; }
            if (child.classList.contains(MSortClassNames.PlaceHolder)) { index--; }
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
            return this.options.grouping;
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
        if (this.placeHolderElement) { this.placeHolderElement.style.display = ''; }
    }

    private hidePlaceHolder(): void {
        if (this.placeHolderElement) { this.placeHolderElement.style.display = 'none'; }
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
        const mSortAfterElement = this.element.querySelector(`.${MSortClassNames.SortAfter}`);
        if (mSortAfterElement) { mSortAfterElement.classList.remove(MSortClassNames.SortAfter); }
        this.element.classList.remove(MSortClassNames.SortAfter);

        const mSortBeforeElement = this.element.querySelector(`.${MSortClassNames.SortBefore}`);
        if (mSortBeforeElement) { mSortBeforeElement.classList.remove(MSortClassNames.SortBefore); }
        this.element.classList.remove(MSortClassNames.SortBefore);
    }
}

const extractVnodeAttributes: (node: VNode) => MSortableOptions = (node: VNode) => {
    return {
        items: getVNodeAttributeValue(node, 'items'),
        acceptedActions: getVNodeAttributeValue(node, 'accepted-actions')
    };
};
const Directive: DirectiveOptions = {
    bind(element: HTMLElement, binding: VNodeDirective, node: VNode): void {
        MDOMPlugin.attach(MSortable, element, extractVnodeAttributes(node));
    },
    inserted(element: HTMLElement, binding: VNodeDirective, node: VNode): void {
        const options = extractVnodeAttributes(node);
        const sortableGroup: MSortableGroup | undefined = MDOMPlugin.getRecursive(MSortableGroup, element);
        options.grouping = sortableGroup ? sortableGroup.options : undefined;
        MDOMPlugin.update(MSortable, element, options);
    },
    componentUpdated(element: HTMLElement, binding: VNodeDirective, node: VNode): void {
        const options = extractVnodeAttributes(node);
        const sortableGroup: MSortableGroup | undefined = MDOMPlugin.getRecursive(MSortableGroup, element);
        options.grouping = sortableGroup ? sortableGroup.options : undefined;
        MDOMPlugin.update(MSortable, element, options);
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
