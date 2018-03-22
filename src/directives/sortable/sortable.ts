import { SORTABLE } from '../directive-names';
import { PluginObject } from 'vue/types/plugin';
import { DirectiveOptions, VNode, VNodeDirective } from 'vue';
import { MDraggableElement, MDraggable } from '../draggable/draggable';
import { MDroppable, MDroppableElement, MDropEvent } from '../droppable/droppable';
import { getVNodeAttributeValue } from '../../utils/vue/directive';

export interface MSortableElement extends MDroppableElement {
    __msortable__?: MSortable;
}

export interface MSortableOptions {
    items: any[];
    acceptedActions: string[];
    grouping?: string;
}

export class MSortable {
    private element: MSortableElement;
    private emptyPlaceHolderElement: MDroppableElement | undefined;
    private placeHolderElement: MDroppableElement | undefined;
    private options: MSortableOptions;

    constructor(element: HTMLElement, options: MSortableOptions) {
        this.element = element;
        this.options = options;
        this.attach();
    }

    public update(): void {
        this.attachEmptyPlaceholder();
        this.attachPlaceholder();
    }

    public detach(): void {
        this.element.removeEventListener('droppable:drop', this.onDrop.bind(this));
        this.element.__msortable__ = undefined;
        if (this.element.__mdroppable__) this.element.__mdroppable__.detach();
        this.detachPlaceholder(this.emptyPlaceHolderElement);
        this.detachPlaceholder(this.placeHolderElement);
    }

    private attach(): void {
        this.element.addEventListener('droppable:drop', this.onDrop.bind(this));
        this.attachDroppablePart(this.element);
        this.attachEmptyPlaceholder();
        this.attachPlaceholder();
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
        }
    }

    private onDrop(event: MDropEvent): void {
        const customEvent: CustomEvent = document.createEvent('CustomEvent');
        const dropInfo = event.dropInfo;
        const dropEvent: Event = Object.assign(customEvent, { dropInfo });
        customEvent.initCustomEvent('sortable:add', true, true, event.detail);
        this.element.dispatchEvent(dropEvent);
    }
}

const Directive: DirectiveOptions = {
    componentUpdated(element: MSortableElement, binding: VNodeDirective, node: VNode): void {
        if (!element.__msortable__) {
            element.__msortable__ = new MSortable(element, {
                items: binding.value,
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
