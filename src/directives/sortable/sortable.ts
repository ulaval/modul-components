import { mousePositionElement } from './mouse';
import { SORTABLE } from '../directive-names';
import { PluginObject } from 'vue/types/plugin';
import { DirectiveOptions, VNode, VNodeDirective } from 'vue';
import { MDraggableElement, MDraggable } from '../draggable/draggable';
import { MDroppable, MDroppableElement, MDropEvent, MDropEventNames, MDropInfo } from '../droppable/droppable';
import { getVNodeAttributeValue } from '../../utils/vue/directive';

export interface MSortableElement extends MDroppableElement {
    __msortable__?: MSortable;
}

export interface MSortableOptions {
    items: any[];
    acceptedActions: string[];
    grouping?: string;
}

export enum MSortEventNames {
    OnAdd = 'sortable:add',
    OnMove = 'sortable:move'
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

export interface MSortInfo {
    action: string;
    grouping?: string;
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
const DEFAULT_ACTION = 'any';
const MOVE_ACTION = 'move';
export class MSortable {
    public static currentActiveSort: MSortableElement | undefined;
    private element: MSortableElement;
    private emptyPlaceHolderElement: MDroppableElement | undefined;
    private placeHolderElement: MDroppableElement | undefined;
    private options: MSortableOptions;
    private insertAtIndex: number = 0;

    constructor(element: HTMLElement, options: MSortableOptions) {
        this.element = element;
        this.options = options;

        if (this.options.acceptedActions && this.options.acceptedActions.length) {
            this.options.acceptedActions.push(MOVE_ACTION);
        } else {
            this.options.acceptedActions = this.options.acceptedActions ? this.options.acceptedActions : [DEFAULT_ACTION];
        }

        this.attach();
    }

    public update(): void {
        this.attachEmptyPlaceholder();
        this.attachPlaceholder();
        this.attachChilds();
    }

    public detach(): void {
        this.element.removeEventListener(MDropEventNames.OnDrop, this.onDrop.bind(this));
        this.element.removeEventListener(MDropEventNames.OnDragOver, this.onDragOver.bind(this));
        this.element.removeEventListener(MDropEventNames.OnDragLeave, this.onDragLeave.bind(this));
        this.element.__msortable__ = undefined;
        if (this.element.__mdroppable__) this.element.__mdroppable__.detach();
        this.detachPlaceholder(this.emptyPlaceHolderElement);
        this.detachPlaceholder(this.placeHolderElement);
        this.detachChilds();
    }

    private attach(): void {
        this.element.addEventListener(MDropEventNames.OnDrop, this.onDrop.bind(this));
        this.element.addEventListener(MDropEventNames.OnDragOver, this.onDragOver.bind(this));
        this.element.addEventListener(MDropEventNames.OnDragLeave, this.onDragLeave.bind(this));
        this.attachDroppablePart(this.element);
        this.attachEmptyPlaceholder();
        this.attachPlaceholder();
        this.attachChilds();
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
                        dragData: {}
                    });
                }
                draggablePart.__mdraggable__.options.dragData = this.options.items[itemCounter++];

                const droppablePart: MDroppableElement = currentElement as MDroppableElement;
                if (!droppablePart.__mdroppable__) {
                    droppablePart.__mdroppable__ = new MDroppable(droppablePart, {
                        acceptedActions: this.options.acceptedActions,
                        grouping: this.options.grouping
                    }, true);
                    droppablePart.addEventListener(MDropEventNames.OnDragEnter, this.onChildDragEnter.bind(this));
                    droppablePart.addEventListener(MDropEventNames.OnDragOver, this.onChildDragOver.bind(this));
                    droppablePart.addEventListener(MDropEventNames.OnDragLeave, this.onChildDragLeave.bind(this));
                }
            }
        }
    }

    private attachDroppablePart(element: MSortableElement): void {
        element.__mdroppable__ = new MDroppable(element, {
            acceptedActions: this.options.acceptedActions
        }, true);
    }

    private attachEmptyPlaceholder(): void {
        this.setupPlaceholder(this.placeHolderElement, '.emptyPlaceholder', (element: MDroppableElement | undefined) => this.emptyPlaceHolderElement = element);

        if (this.emptyPlaceHolderElement) {
            this.emptyPlaceHolderElement.style.display = this.options.items.length ? 'none' : '';
        }
    }

    private attachPlaceholder(): void {
        this.setupPlaceholder(this.placeHolderElement, '.placeholder', (element: MDroppableElement | undefined) => this.placeHolderElement = element);

        if (this.placeHolderElement && !MDraggable.currentlyDraggedElement) {
            this.placeHolderElement.style.display = 'none';
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
            }
        }
    }

    private detachPlaceholder(placeHolder: HTMLElement | undefined): void {
        if (placeHolder) {
            placeHolder.style.display = '';

            const droppablePlaceholder = placeHolder as MDroppableElement;
            if (droppablePlaceholder && droppablePlaceholder.__mdroppable__) droppablePlaceholder.__mdroppable__.detach();
        }
    }

    private hidePlaceHolder(): void {
        this.insertAtIndex = 0;
        if (this.placeHolderElement) this.placeHolderElement.style.display = 'none';
    }

    private onDrop(event: MDropEvent): void {
        event.stopPropagation();
        let eventName: string;

        const oldIndex = this.options.items.findIndex((item: any) => item === event.dropInfo.data);
        if (this.options.items.find((item: any) => item === event.dropInfo.data)) {
            eventName = MSortEventNames.OnMove;
        } else {
            eventName = MSortEventNames.OnAdd;
        }

        const customEvent: CustomEvent = document.createEvent('CustomEvent');
        const sortInfo: MSortInfo = Object.assign(event.dropInfo, { oldPosition: oldIndex, newPosition: this.insertAtIndex });
        const sortEvent: Event = Object.assign(customEvent, { clientX: event.clientX, clientY: event.clientY }, { sortInfo });
        customEvent.initCustomEvent(eventName, true, true, event.detail);
        this.element.dispatchEvent(sortEvent);
        this.hidePlaceHolder();
    }

    private onDragLeave(event: MDropEvent): void {
        this.hidePlaceHolder();
    }

    private onDragOver(event: MDropEvent): void {
        if (event.target === this.element || (event.target as HTMLElement).parentNode === this.element) {
            if (MSortable.currentActiveSort && MSortable.currentActiveSort !== this.element) {
                if (MSortable.currentActiveSort.__msortable__) MSortable.currentActiveSort.__msortable__.hidePlaceHolder();
            } else {
                MSortable.currentActiveSort = this.element;
            }
        }
        this.showPlaceHolder(event);
    }

    private onChildDragEnter(event: MDropEvent): void {
        event.preventDefault();
        event.stopImmediatePropagation();
        this.showPlaceHolder(event);
    }

    private onChildDragLeave(event: MDropEvent): void {
        event.preventDefault();
        event.stopImmediatePropagation();
        this.hidePlaceHolder();
    }

    private onChildDragOver(event: MDropEvent): void {
        event.preventDefault();
        event.stopPropagation();
        this.showPlaceHolder(event);
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

    private showPlaceHolder(event: MDropEvent): void {
        this.computeInsertPosition(event);
        if (this.isHoveringEmptyPlaceholder()) {
            return;
        }

        // We are hovering over the insertion place holder.  In that case we simply continue to display the placeholder.
        if (this.isHoveringInsertionPlaceholder()) {
            if (this.placeHolderElement) this.placeHolderElement.style.display = 'inherit';
            return;
        }

        const insertPosition = this.computeInsertPosition(event);
        const currentlyDraggedElement: MDraggableElement = MDraggable.currentlyDraggedElement as MDraggableElement;
        const currentDraggable: MDraggable = currentlyDraggedElement.__mdraggable__ as MDraggable;
        if (insertPosition === MSortInsertPositions.Before) {
            this.insertAtIndex = this.options.items.indexOf(currentDraggable.options.dragData) - 1;
        } else {
            this.insertAtIndex = this.options.items.indexOf(currentDraggable.options.dragData) + 1;
        }

        // If we need to change the placeholder's place.
        if (this.placeHolderElement) {
            // We are hovering over one of the sortable's child.
            if (MDroppable.currentHoverElement !== this.element) {
                this.placeHolderElement.style.display = 'inherit';
                if (currentlyDraggedElement) {
                    const domInsertPos: InsertPosition = insertPosition === MSortInsertPositions.Before ? 'beforebegin' : 'afterend';
                    currentlyDraggedElement.insertAdjacentElement(domInsertPos, this.placeHolderElement);
                }
            } else { // We are hovering the sortable itself.
                this.placeHolderElement.style.display = 'inherit';
                const domInsertPos: InsertPosition = insertPosition === MSortInsertPositions.Before ? 'afterbegin' : 'beforeend';
                this.element.insertAdjacentElement(domInsertPos, this.placeHolderElement);
            }

            this.insertAtIndex = Array.from(this.element.children).indexOf(this.placeHolderElement) - 1;
        }
    }

    private movePlaceholder(insertPosition: MSortInsertPositions, placeBefore: () => void, placeAfter: () => void): void {

    }

    private computeInsertPosition(event: MDropEvent): MSortInsertPositions {
        if (MDroppable.currentHoverElement) {
            const mousePosition = mousePositionElement(event);
            if (mousePosition.y <= MDroppable.currentHoverElement.offsetHeight / 2) {
                console.log('Before');
                return MSortInsertPositions.Before;
            } else {
                console.log('After');
                return MSortInsertPositions.After;
            }
        }

        return MSortInsertPositions.After;
    }

    private isHoveringEmptyPlaceholder(): boolean | undefined {
        return this.emptyPlaceHolderElement && MDroppable.currentHoverElement && this.emptyPlaceHolderElement === MDroppable.currentHoverElement;
    }

    private isHoveringInsertionPlaceholder(): boolean | undefined {
        return this.placeHolderElement && MDroppable.currentHoverElement && this.placeHolderElement === MDroppable.currentHoverElement;
    }
}

const Directive: DirectiveOptions = {
    componentUpdated(element: MSortableElement, binding: VNodeDirective, node: VNode): void {
        if (!element.__msortable__) {
            element.__msortable__ = new MSortable(element, {
                items: getVNodeAttributeValue(node, 'items'),
                acceptedActions: getVNodeAttributeValue(node, 'accepted-actions')
            });
        } else {
            element.__msortable__.update();
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
