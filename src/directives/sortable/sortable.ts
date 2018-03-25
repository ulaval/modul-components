import { mousePositionElement } from './mouse';
import { SORTABLE } from '../directive-names';
import { PluginObject } from 'vue/types/plugin';
import { DirectiveOptions, VNode, VNodeDirective } from 'vue';
import { MDraggableElement, MDraggable, MDraggableEventNames } from '../draggable/draggable';
import { MDroppable, MDroppableElement, MDropEvent, MDropEventNames, MDropInfo } from '../droppable/droppable';
import { getVNodeAttributeValue } from '../../utils/vue/directive';
import tabPanel from 'src/components/tab-panel/tab-panel';

export interface MSortableElement extends MDroppableElement {
    __msortable__?: MSortable;
}

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

export abstract class MHTMLElementPluggin<PluginType> {
    public abstract attach(plugin: PluginType): void;
    public abstract detach(): void;
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
export class MSortable {
    public static activeSortContainer: MSortableElement | undefined;
    public static fromSortContainer: MSortableElement | undefined;
    private element: MSortableElement;
    private emptyPlaceHolderElement: MDroppableElement | undefined;
    private placeHolderElement: MDroppableElement | undefined;

    private _options: MSortableOptions;
    private get options(): MSortableOptions { return this._options; }
    private set options(value) {
        if (value.acceptedActions && value.acceptedActions.length) {
            value.acceptedActions.push(MOVE_ACTION);
        } else {
            value.acceptedActions = value.acceptedActions ? value.acceptedActions : [DEFAULT_ACTION];
        }
        this._options = value;
    }

    constructor(element: HTMLElement, options: MSortableOptions) {
        this.element = element;
        this.options = options;
        this.attach();
    }

    public update(options: MSortableOptions): void {
        this.options = options;

        this.attachEmptyPlaceholder();
        this.attachPlaceholder();
        this.attachChilds();
    }

    public detach(): void {
        this.element.removeEventListener(MDropEventNames.OnDrop, this.onDrop.bind(this));
        this.element.removeEventListener(MDropEventNames.OnDragOver, this.onChildDragOver.bind(this));
        this.element.removeEventListener(MDropEventNames.OnDragLeave, this.onChildDragLeave.bind(this));
        this.element.__msortable__ = undefined;
        if (this.element.__mdroppable__) this.element.__mdroppable__.detach();
        this.detachPlaceholder(this.emptyPlaceHolderElement);
        this.detachPlaceholder(this.placeHolderElement);
        this.detachChilds();
    }

    private attach(): void {
        this.element.addEventListener(MDropEventNames.OnDrop, this.onDrop.bind(this));
        this.element.addEventListener(MDropEventNames.OnDragOver, this.onChildDragOver.bind(this));
        this.element.addEventListener(MDropEventNames.OnDragLeave, this.onChildDragLeave.bind(this));
        this.attachDroppablePart(this.element);
        this.attachEmptyPlaceholder();
        this.attachPlaceholder();
        this.attachChilds();
    }

    private attachDroppablePart(element: MSortableElement): void {
        element.__mdroppable__ = new MDroppable(element, {
            acceptedActions: this.options.acceptedActions
        }, true);
    }

    private attachChilds(): void {
        let itemCounter = 0;
        for (let i = 0; i < this.element.children.length; i++) {
            const currentElement: HTMLElement = this.element.children[i] as HTMLElement;
            if (currentElement !== this.placeHolderElement && currentElement !== this.emptyPlaceHolderElement) {
                const draggablePart: MDraggableElement = currentElement as MDraggableElement;
                if (!draggablePart.__mdraggable__) {
                    draggablePart.__mdraggable__ = new MDraggable(draggablePart, {
                        action: MOVE_ACTION,
                        dragData: {},
                        grouping: ''
                    });
                }
                draggablePart.__mdraggable__.options.dragData = this.options.items[itemCounter++];
                draggablePart.__mdraggable__.options.grouping = this.options.grouping;
                draggablePart.addEventListener(MDraggableEventNames.OnDragEnd, this.onChildDragEnd.bind(this));
                draggablePart.addEventListener(MDraggableEventNames.OnDragStart, this.onChildDragStart.bind(this));

                const droppablePart: MDroppableElement = currentElement as MDroppableElement;
                if (!droppablePart.__mdroppable__) {
                    droppablePart.__mdroppable__ = new MDroppable(droppablePart, {
                        acceptedActions: [],
                        grouping: ''
                    }, true);
                    droppablePart.__mdroppable__.options.acceptedActions = this.options.acceptedActions;
                    droppablePart.__mdroppable__.options.grouping = this.options.grouping;
                    droppablePart.addEventListener(MDropEventNames.OnDragEnter, this.onChildDragEnter.bind(this));
                    droppablePart.addEventListener(MDropEventNames.OnDragOver, this.onChildDragOver.bind(this));
                    droppablePart.addEventListener(MDropEventNames.OnDragLeave, this.onChildDragLeave.bind(this));
                }
            }
        }
    }

    private detachChilds(): void {
        for (let i = 0; i < this.element.children.length; i++) {
            const currentElement: HTMLElement = this.element.children[i] as HTMLElement;
            if (currentElement !== this.placeHolderElement && currentElement !== this.emptyPlaceHolderElement) {
                const currentElement: HTMLElement = this.element.children[i] as HTMLElement;

                const draggablePart: MDraggableElement = currentElement as MDraggableElement;
                if (draggablePart.__mdraggable__) draggablePart.__mdraggable__.detach();

                const droppablePart: MDroppableElement = currentElement as MDroppableElement;
                if (droppablePart.__mdroppable__) droppablePart.__mdroppable__.detach();

                // TODO: Remove events!!
            }
        }
    }

    private attachEmptyPlaceholder(): void {
        this.setupPlaceholder(this.placeHolderElement, '.emptyPlaceholder', (element: MDroppableElement | undefined) => this.emptyPlaceHolderElement = element);

        if (this.emptyPlaceHolderElement) {
            this.emptyPlaceHolderElement.style.display = this.options.items.length ? 'none' : 'inherit';
            this.emptyPlaceHolderElement.addEventListener(MDropEventNames.OnDragEnter, this.onChildDragEnter.bind(this));
            this.emptyPlaceHolderElement.addEventListener(MDropEventNames.OnDragOver, this.onChildDragOver.bind(this));
            this.emptyPlaceHolderElement.addEventListener(MDropEventNames.OnDragLeave, (e: DragEvent) => { e.stopImmediatePropagation(); e.stopPropagation(); });
        }
    }

    private attachPlaceholder(): void {
        this.setupPlaceholder(this.placeHolderElement, '.placeholder', (element: MDroppableElement | undefined) => this.placeHolderElement = element);

        if (this.placeHolderElement && !MDraggable.currentlyDraggedElement) {
            this.placeHolderElement.style.display = 'none';
            this.placeHolderElement.addEventListener(MDropEventNames.OnDragEnter, this.onChildDragEnter.bind(this));
            this.placeHolderElement.addEventListener(MDropEventNames.OnDragOver, this.onChildDragOver.bind(this));
            this.placeHolderElement.addEventListener(MDropEventNames.OnDragLeave, (e: DragEvent) => { e.stopImmediatePropagation(); e.stopPropagation(); });
        }
    }

    private setupPlaceholder(currentValue: MDroppableElement | undefined, selector: string, set: (element: MDroppableElement | undefined) => void): void {
        const element: MDroppableElement | null = this.element.querySelector(selector);
        if (!element) {
            if (currentValue && currentValue.__mdroppable__) currentValue.__mdroppable__.detach();
            set(undefined);
        } else {
            if (!element.__mdroppable__) {
                element.__mdroppable__ = new MDroppable(element, {
                    acceptedActions: this.options.acceptedActions,
                    grouping: this.options.grouping
                }, true);
                set(element);
            }
        }
    }

    private detachPlaceholder(placeHolder: HTMLElement | undefined): void {
        if (placeHolder) {
            placeHolder.style.display = '';

            const droppablePlaceholder = placeHolder as MDroppableElement;
            if (droppablePlaceholder && droppablePlaceholder.__mdroppable__) droppablePlaceholder.__mdroppable__.detach();
            // TODO : REMOVE EVENTS!!
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
            oldGrouping: MSortable.fromSortContainer ? (MSortable.fromSortContainer.__msortable__ as MSortable).options.grouping : undefined,
            newGrouping: this.options.grouping
        };
        const sortEvent: Event = Object.assign(customEvent, { clientX: event.clientX, clientY: event.clientY }, { sortInfo });
        customEvent.initCustomEvent(eventName, true, true, event.detail);
        this.element.dispatchEvent(sortEvent);

        if (MSortable.fromSortContainer && MSortable.fromSortContainer.__msortable__ && MSortable.fromSortContainer !== MSortable.activeSortContainer) {
            MSortable.fromSortContainer.__msortable__.onRemove(event);
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
        if (MSortable.activeSortContainer && MSortable.activeSortContainer.__msortable__) {
            MSortable.activeSortContainer.__msortable__.hidePlaceHolder();
        }
        MSortable.fromSortContainer = undefined;
        MSortable.activeSortContainer = undefined;
        this.cleanUpClasses();
    }

    private onChildDragEnter(event: MDropEvent): void {
        event.preventDefault();
        event.stopImmediatePropagation();
        this.positionPlaceholder(event);
    }

    private onChildDragLeave(event: MDropEvent): void {
        event.preventDefault();
        event.stopImmediatePropagation();

        console.log('you left');
        MSortable.activeSortContainer = undefined;
        this.hidePlaceHolder();
        this.cleanUpClasses();
    }

    private onChildDragOver(event: MDropEvent): void {
        event.preventDefault();
        event.stopImmediatePropagation();
        this.positionPlaceholder(event);
    }

    private onChildDragStart(): void {
        const element: MDraggableElement = MDraggable.currentlyDraggedElement as MDraggableElement;
        const container: MSortableElement = this.findSortableContainer(element);

        MSortable.fromSortContainer = container;
    }

    private positionPlaceholder(event: MDropEvent): void {
        if (MSortable.activeSortContainer !== this.element) {
            console.log('test');
            if (MSortable.activeSortContainer && MSortable.activeSortContainer.__msortable__) {
                MSortable.activeSortContainer.__msortable__.hidePlaceHolder();
            }

            MSortable.activeSortContainer = this.element;
        }

        if (this.options.items.length === 0 || this.isHoveringInsertionPlaceholder() || !event.dropInfo.canDrop) {
            return;
        }

        const draggableElement = MDraggable.currentlyDraggedElement;
        if (MDroppable.currentHoverElement && MDraggable.currentlyDraggedElement && MDroppable.currentHoverElement === MDraggable.currentlyDraggedElement) {
            this.hidePlaceHolder();
            return;
        } else {
            this.showPlaceHolder();
        }

        this.cleanUpClasses();
        const insertPosition: MSortInsertPositions = this.computeInsertPosition(event);
        if (this.placeHolderElement) {
            // We are hovering over one of the sortable's child.
            if (MDroppable.currentHoverElement !== this.element && MDroppable.currentHoverElement) {
                const domInsertPos: InsertPosition = insertPosition === MSortInsertPositions.Before ? 'beforebegin' : 'afterend';
                MDroppable.currentHoverElement.insertAdjacentElement(domInsertPos, this.placeHolderElement);
                MDroppable.currentHoverElement.classList.add(insertPosition === MSortInsertPositions.Before ? MSortClassNames.MSortBefore : MSortClassNames.MSortAfter);
            } else { // We are hovering the sortable itself.
                const domInsertPos: InsertPosition = insertPosition === MSortInsertPositions.Before ? 'afterbegin' : 'beforeend';
                this.element.insertAdjacentElement(domInsertPos, this.placeHolderElement);
                this.element.classList.add(insertPosition === MSortInsertPositions.Before ? MSortClassNames.MSortBefore : MSortClassNames.MSortAfter);
            }
        }
    }

    private showPlaceHolder(): void {
        if (this.placeHolderElement) this.placeHolderElement.style.display = 'inherit';
    }

    private computeInsertPosition(event: MDropEvent): MSortInsertPositions {
        if (MDroppable.currentHoverElement) {
            const mousePosition = mousePositionElement(event);
            if (mousePosition.y < MDroppable.currentHoverElement.offsetHeight / 2) {
                return MSortInsertPositions.Before;
            } else {
                return MSortInsertPositions.After;
            }
        }

        return MSortInsertPositions.After;
    }

    private findSortableContainer(element: MSortableElement): MSortableElement {
        do {
            if (!element.__msortable__) {
                element = element.parentNode as MSortableElement;
            }
        } while (element && !element.__msortable__);
        return element;
    }

    private getNewPosition(event: MDropEvent): number {
        if (this.options.items.length === 0) return 0;

        // We are hovering over one of the sortable's child.
        const insertPosition: MSortInsertPositions = this.computeInsertPosition(event);
        if (MDroppable.currentHoverElement !== this.element) {
            const currentHoverElement = (MDroppable.currentHoverElement as MDraggableElement).__mdraggable__ as MDraggable;
            const itemIndex = this.options.items.indexOf(currentHoverElement.options.dragData);
            return insertPosition === MSortInsertPositions.Before
                ? itemIndex
                : itemIndex + 1;
        } else { // We are hovering the sortable itself.
            return MSortInsertPositions.Before ? 0 : this.options.items.length - 1;
        }
    }

    private hidePlaceHolder(): void {
        if (this.placeHolderElement) this.placeHolderElement.style.display = 'none';
    }

    private isHoveringInsertionPlaceholder(): boolean | undefined {
        return this.placeHolderElement && MDroppable.currentHoverElement && this.placeHolderElement === MDroppable.currentHoverElement;
    }

    private cleanUpClasses(): void {
        const mSortAfterElement = this.element.querySelector(`.${MSortClassNames.MSortAfter}`);
        if (mSortAfterElement) mSortAfterElement.classList.remove(MSortClassNames.MSortAfter);

        const mSortBeforeElement = this.element.querySelector(`.${MSortClassNames.MSortBefore}`);
        if (mSortBeforeElement) mSortBeforeElement.classList.remove(MSortClassNames.MSortBefore);
    }
}

const Directive: DirectiveOptions = {
    bind(element: MSortableElement, binding: VNodeDirective, node: VNode): void {
        if (!element.__msortable__) {
            element.__msortable__ = new MSortable(element, {
                items: getVNodeAttributeValue(node, 'items'),
                acceptedActions: getVNodeAttributeValue(node, 'accepted-actions'),
                grouping: getVNodeAttributeValue(node, 'grouping')
            });
        } else {
            element.__msortable__.update({
                items: getVNodeAttributeValue(node, 'items'),
                acceptedActions: getVNodeAttributeValue(node, 'accepted-actions'),
                grouping: getVNodeAttributeValue(node, 'grouping')
            });
        }
    },
    componentUpdated(element: MSortableElement, binding: VNodeDirective, node: VNode): void {
        if (!element.__msortable__) {
            element.__msortable__ = new MSortable(element, {
                items: getVNodeAttributeValue(node, 'items'),
                acceptedActions: getVNodeAttributeValue(node, 'accepted-actions'),
                grouping: getVNodeAttributeValue(node, 'grouping')
            });
        } else {
            element.__msortable__.update({
                items: getVNodeAttributeValue(node, 'items'),
                acceptedActions: getVNodeAttributeValue(node, 'accepted-actions'),
                grouping: getVNodeAttributeValue(node, 'grouping')
            });
        }
    },
    unbind(element: MSortableElement, binding: VNodeDirective): void {
        if (element.__msortable__) element.__msortable__.detach();
    }
};

const SortablePlugin: PluginObject<any> = {
    install(v, options): void {
        v.directive(SORTABLE, Directive);
    }
};

export default SortablePlugin;
