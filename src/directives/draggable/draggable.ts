import { DirectiveOptions, VNodeDirective, VNode, PluginObject } from 'vue';
import { DRAGGABLE } from '../directive-names';
import { MElementPlugin, MDOMPlugin } from '../domPlugin';
import { getVNodeAttributeValue } from '../../utils/vue/directive';
import { MDroppable } from '../droppable/droppable';
import { clearUserSelection } from '../../utils/selection/selection';
import { MRemoveUserSelect } from '../user-select/remove-user-select';
import { MSortable } from '../sortable/sortable';

export enum MDraggableClassNames {
    Dragging = 'm--is-dragging'
}

export interface MDraggableOptions {
    action: string;
    dragData: any;
    grouping?: any;
}

export interface MDragInfo {
    action: string;
    grouping?: string;
    data: any;
}

export enum MDraggableEventNames {
    OnDragStart = 'draggable:dragstart',
    OnDragEnd = 'draggable:dragend'
}

const DEFAULT_ACTION = 'any';
export class MDraggable extends MElementPlugin<MDraggableOptions> {
    public static defaultMountPoint: string = '__mdraggable__';
    public static currentDraggable?: MDraggable;

    constructor(element: HTMLElement, options: MDraggableOptions) {
        super(element, options);
    }

    public cleanupCssClasses(): void {
        this.element.classList.remove(MDraggableClassNames.Dragging);
    }

    public attach(): void {
        this.options.action = this.options.action ? this.options.action : DEFAULT_ACTION;
        this.element.draggable = true;
        this.attachDragImage();

        this.addEventListener('dragend', (event: DragEvent) => this.onDragEnd(event));
        this.addEventListener('dragstart', (event: DragEvent) => this.onDragStart(event));
        this.addEventListener('touchmove', () => {});
    }

    public update(options: MDraggableOptions): void {
        this._options = options;
        this.attachDragImage();

        const dragHandle: HTMLElement = this.element.querySelector('.dragImage') as HTMLElement;
        if (dragHandle) {
            MDOMPlugin.detach(MRemoveUserSelect, this.element);
        } else {
            MDOMPlugin.attachUpdate(MRemoveUserSelect, this.element, true);
        }
    }

    public detach(): void {
        this.element.draggable = false;
        MDOMPlugin.detach(MRemoveUserSelect, this.element);
        this.detachDragImage();
        this.cleanupCssClasses();
        this.removeAllEvents();
    }

    private attachDragImage(): void {
        const dragImage: HTMLElement = this.element.querySelector('.dragImage') as HTMLElement;
        if (dragImage) {
            this.element.removeChild(dragImage);
            this.element.appendChild(dragImage);
            this.element.style.height = `${this.element.offsetHeight - dragImage.offsetHeight}px`;
            this.element.style.overflow = 'hidden';
            dragImage.style.transform = `translateY(${this.element.offsetHeight}px)`;
            dragImage.style.display = 'none';
        }
    }

    private detachDragImage(): void {
        const dragImage: HTMLElement = this.element.querySelector('.dragImage') as HTMLElement;
        if (dragImage) {
            this.element.style.height = '';
            this.element.style.overflow = '';
            dragImage.style.transform = '';
            dragImage.style.display = '';
        }
    }

    private onDragEnd(event: DragEvent): void {
        this.cleanupCssClasses();
        MDraggable.currentDraggable = undefined;
        if (MDroppable.currentHoverDroppable) { MDroppable.currentHoverDroppable.cleanupCssClasses(); }
        MDroppable.currentHoverDroppable = undefined;
        this.dispatchEvent(event, MDraggableEventNames.OnDragEnd);
    }

    private onDragStart(event: DragEvent): void {
        event.stopPropagation();
        clearUserSelection();

        MDraggable.currentDraggable = this;
        this.element.classList.add(MDraggableClassNames.Dragging);
        if (typeof this.options.dragData === 'object') {
            event.dataTransfer.setData('text', JSON.stringify(this.options.dragData));
        } else {
            event.dataTransfer.setData('text', this.options.dragData);
        }

        this.setDragImage(event);
        this.dispatchEvent(event, MDraggableEventNames.OnDragStart);
    }

    private setDragImage(event: DragEvent): void {
        const dragImage: HTMLElement = this.element.querySelector('.dragImage') as HTMLElement;
        if (dragImage) {
            dragImage.style.display = '';
            if (event.dataTransfer.setDragImage) { event.dataTransfer.setDragImage(dragImage, 0, 0); }
            setTimeout(() => {
                dragImage.style.display = 'none';
            });
        }
    }

    private dispatchEvent(event: DragEvent, name: string): void {
        const customEvent: CustomEvent = document.createEvent('CustomEvent');
        const data: any = this.options.dragData ? this.options.dragData : event.dataTransfer.getData('text');
        const dropInfo: MDragInfo = {
            action: this.options.action,
            grouping: this.options.grouping,
            data
        };
        const dropEvent: Event = Object.assign(customEvent, { clientX: event.clientX, clientY: event.clientY }, { dropInfo });

        customEvent.initCustomEvent(name, true, true, event);
        this.element.dispatchEvent(dropEvent);
    }
}

const extractVnodeAttributes: (node: VNode) => MDraggableOptions = (node: VNode) => {
    return {
        action: getVNodeAttributeValue(node, 'action'),
        dragData: getVNodeAttributeValue(node, 'drag-data'),
        grouping: getVNodeAttributeValue(node, 'grouping')
    };
};
const Directive: DirectiveOptions = {
    inserted(element: HTMLElement, binding: VNodeDirective, node: VNode): void {
        MDOMPlugin.attachUpdate(MDraggable, element, extractVnodeAttributes(node));
    },
    update(element: HTMLElement, binding: VNodeDirective, node: VNode): void {
        MDOMPlugin.update(MDraggable, element, extractVnodeAttributes(node));
    },
    componentUpdated(element: HTMLElement, binding: VNodeDirective, node: VNode): void {
        MDOMPlugin.update(MDraggable, element, extractVnodeAttributes(node));
    },
    unbind(element: HTMLElement, binding: VNodeDirective): void {
        MDOMPlugin.detach(MDraggable, element);
    }
};

const DraggablePlugin: PluginObject<any> = {
    install(v, options): void {
        v.directive(DRAGGABLE, Directive);
    }
};

export default DraggablePlugin;
