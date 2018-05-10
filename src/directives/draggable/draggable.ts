import { DirectiveOptions, PluginObject, VNode, VNodeDirective } from 'vue';

import { clearUserSelection } from '../../utils/selection/selection';
import { dispatchEvent, getVNodeAttributeValue } from '../../utils/vue/directive';
import { DRAGGABLE_NAME } from '../directive-names';
import { MDOMPlugin, MElementDomPlugin, MountFunction, RefreshFunction } from '../domPlugin';
import { MDroppable } from '../droppable/droppable';
import { MRemoveUserSelect } from '../user-select/remove-user-select';
import { MDraggableAllowScroll } from './draggable-allow-scroll';

export enum MDraggableClassNames {
    Draggable = 'm--is-draggable',
    Dragging = 'm--is-dragging',
    Grabbing = 'm--is-grabbing'
}

export interface MDraggableOptions {
    canDrag: any;
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
export class MDraggable extends MElementDomPlugin<MDraggableOptions> {
    public static defaultMountPoint: string = '__mdraggable__';
    public static currentDraggable?: MDraggable;

    constructor(element: HTMLElement, options: MDraggableOptions) {
        super(element, options);
    }

    public cleanupCssClasses(): void {
        this.element.classList.remove(MDraggableClassNames.Dragging);
        this.element.classList.remove(MDraggableClassNames.Grabbing);
    }

    public attach(mount: MountFunction): void {
        this.attachDragImage();
        if (this.options.canDrag === undefined) { this.options.canDrag = true; }
        if (this.options.canDrag) {
            mount(() => {
                this.element.classList.add(MDraggableClassNames.Draggable);

                this.options.action = this.options.action ? this.options.action : DEFAULT_ACTION;
                this.element.draggable = true;

                this.addEventListener('dragend', (event: DragEvent) => this.onDragEnd(event));
                this.addEventListener('dragstart', (event: DragEvent) => this.onDragStart(event));
                this.addEventListener('mousedown', (event: DragEvent) => this.element.classList.add(MDraggableClassNames.Grabbing));
                this.addEventListener('mouseup', (event: DragEvent) => this.cleanupCssClasses());
                this.addEventListener('touchmove', () => {});
                MDOMPlugin.attach(MRemoveUserSelect, this.element, true);
            });
        }
    }

    public update(options: MDraggableOptions, refresh: RefreshFunction): void {
        if (options.canDrag === undefined) { options.canDrag = true; }
        this._options = options;
        if (this.options.canDrag) {
            refresh(() => {
                this.options.action = this.options.action ? this.options.action : DEFAULT_ACTION;
                this.attachDragImage();
            });
        }
    }

    public detach(): void {
        this.element.draggable = false;
        MDOMPlugin.detach(MRemoveUserSelect, this.element);
        this.element.classList.remove(MDraggableClassNames.Draggable);
        this.cleanupCssClasses();
        this.removeAllEvents();
    }

    private attachDragImage(): void {
        const dragImage: HTMLElement = this.element.querySelector('.dragImage') as HTMLElement;
        if (dragImage) {
            const origin: number = -9999;
            dragImage.style.left = `${origin}px`;
            dragImage.style.top = `${origin}px`;
            const computedWidth: string | null = window.getComputedStyle(dragImage).width;
            dragImage.style.width = computedWidth && computedWidth !== 'auto' ? window.getComputedStyle(dragImage).width : '100%';
            dragImage.style.position = 'absolute';
            dragImage.style.overflow = 'hidden';
            dragImage.style.zIndex = '1';
            dragImage.hidden = true;
        }
    }

    private onDragEnd(event: DragEvent): void {
        event.stopPropagation();
        this.cleanupCssClasses();
        MDraggable.currentDraggable = undefined;

        // Fix for IE / Edge.  clientX / clientY don't appear to be out of element on dragLeave.
        // We can't detect whether we're leaving de droppable for real therefore we have to force leave onDragEnd.
        if (MDroppable.currentHoverDroppable) { MDroppable.currentHoverDroppable.leaveDroppable(event); }
        if (MDraggableAllowScroll.currentDraggableScroll) { MDraggableAllowScroll.currentDraggableScroll.doCleanUp(); }
        this.dispatchEvent(event, MDraggableEventNames.OnDragEnd);

        const dragImage: HTMLElement = this.element.querySelector('.dragImage') as HTMLElement;
        if (dragImage) { dragImage.hidden = true; }
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
        if (dragImage && event.dataTransfer.setDragImage) {
            dragImage.hidden = false;
            event.dataTransfer.setDragImage(dragImage, 0, 0);
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
        dispatchEvent(this.element, name, dropEvent);
    }
}

const extractVnodeAttributes: (binding: VNodeDirective, node: VNode) => MDraggableOptions = (binding: VNodeDirective, node: VNode) => {
    return {
        canDrag: binding.value,
        action: getVNodeAttributeValue(node, 'action'),
        dragData: getVNodeAttributeValue(node, 'drag-data'),
        grouping: getVNodeAttributeValue(node, 'grouping')
    };
};
const Directive: DirectiveOptions = {
    inserted(element: HTMLElement, binding: VNodeDirective, node: VNode): void {
        MDOMPlugin.attach(MDraggable, element, extractVnodeAttributes(binding, node));
    },
    update(element: HTMLElement, binding: VNodeDirective, node: VNode): void {
        MDOMPlugin.attach(MDraggable, element, extractVnodeAttributes(binding, node));
    },
    unbind(element: HTMLElement, binding: VNodeDirective): void {
        MDOMPlugin.detach(MDraggable, element);
    }
};

const DraggablePlugin: PluginObject<any> = {
    install(v, options): void {
        v.directive(DRAGGABLE_NAME, Directive);
    }
};

export default DraggablePlugin;
