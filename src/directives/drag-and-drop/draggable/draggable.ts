import { DirectiveOptions, PluginObject, VNode, VNodeDirective } from 'vue';
import { targetIsInput } from '../../../utils/event/event';
import { dragDropDelay, polyFillActive } from '../../../utils/polyfills';
import { clearUserSelection } from '../../../utils/selection/selection';
import { getVNodeAttributeValue } from '../../../utils/vue/directive';
import { dispatchEvent } from '../../../utils/vue/events';
import { DRAGGABLE_NAME } from '../../directive-names';
import { MDOMPlugin, MElementDomPlugin, MountFunction, RefreshFunction } from '../../domPlugin';
import { MSortable } from '../../sortable/sortable';
import RemoveUserSelectPlugin, { MRemoveUserSelect } from '../../user-select/remove-user-select';
import { MDroppable } from '../droppable/droppable';
import { MDraggableAllowScroll } from './draggable-allow-scroll';

export enum MDraggableClassNames {
    DragImage = 'dragImage',
    Draggable = 'm--is-draggable',
    Dragging = 'm--is-dragging',
    Grabbing = 'm--is-grabbing'
}

export interface MDraggableOptions {
    canDrag?: boolean;
    action: string;
    dragData: any;
    grouping?: any;
}

export interface MDragInfo {
    action: string;
    grouping?: string;
    data: any;
}

export interface MDragEvent extends CustomEvent {
    dragInfo: MDragInfo;
}

export enum MDraggableEventNames {
    OnDragStart = 'draggable:dragstart',
    OnDragEnd = 'draggable:dragend'
}

const DEFAULT_ACTION: string = 'any';
export class MDraggable extends MElementDomPlugin<MDraggableOptions> {
    public static defaultMountPoint: string = '__mdraggable__';
    public static currentDraggable?: MDraggable;

    private grabEvents: string[] = ['mousedown', 'touchstart'];
    private cancelGrabEvents: string[] = ['mouseup', 'touchend', 'click', 'touchcancel'];
    private touchUpListener: any = this.doCleanUp.bind(this);
    private intputTouchUpListener: any = this.turnDragOn.bind(this);
    private grabDelay: number | undefined = undefined;
    private touchHasMoved: boolean = false;
    private isMouseInitiatedDrag: boolean = false;

    constructor(element: HTMLElement, options: MDraggableOptions) {
        super(element, options);
    }

    public doCleanUp(): void {
        this.destroyGrabBehavior();
        this.cleanupCssClasses();
        MDraggable.currentDraggable = undefined;
    }

    public attach(mount: MountFunction): void {
        this.attachDragImage();
        if (this.options.canDrag === undefined) { this.options.canDrag = true; }
        if (this.options.canDrag) {
            mount(() => {
                this.doCleanUp();
                this.element.classList.add(MDraggableClassNames.Draggable);

                this.options.action = this.options.action ? this.options.action : DEFAULT_ACTION;
                this.turnDragOn();
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
        this.destroyGrabBehavior();
        this.cleanupCssClasses();
        this.removeAllEvents();
    }

    public onDragStart(event: DragEvent): void {
        // On some mobile devices dragStart will be triggered even though user has not moved / dragged yet.  We want to avoid that.
        if (polyFillActive.dragDrop && (!this.touchHasMoved && !this.isMouseInitiatedDrag)) {
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();
            return;
        }

        event.stopPropagation();
        this.doCleanUp();
        clearUserSelection();

        MDraggable.currentDraggable = this;
        this.element.classList.add(MDraggableClassNames.Dragging);
        if (typeof this.options.dragData === 'object') {
            event.dataTransfer!.setData('application/json', JSON.stringify(this.options.dragData));
        } else {
            event.dataTransfer!.setData('text', this.options.dragData);
        }

        this.setEventDragImage(event);
        this.dispatchEvent(event, MDraggableEventNames.OnDragStart);
    }

    public onDragEnd(event: DragEvent): void {
        event.stopPropagation();
        this.doCleanUp();

        // Fix for IE / Edge.  clientX / clientY don't appear to be out of element on dragLeave.
        // We can't detect whether we're leaving de droppable for real therefore we have to force leave onDragEnd.
        if (MDroppable.currentHoverDroppable) { MDroppable.currentHoverDroppable.leaveDroppable(event); }
        if (MSortable.activeSortContainer) { MSortable.activeSortContainer.doCleanUp(); }
        if (MSortable.fromSortContainer) { MSortable.fromSortContainer.doCleanUp(); }
        if (MDraggableAllowScroll.currentDraggableScroll) { MDraggableAllowScroll.currentDraggableScroll.doCleanUp(); }

        this.dispatchEvent(event, MDraggableEventNames.OnDragEnd);

        const dragImage: HTMLElement = this.element.querySelector(`.${MDraggableClassNames.DragImage}`) as HTMLElement;
        if (dragImage) { dragImage.hidden = true; }
    }

    private setupGrabBehavior(): void {
        this.destroyGrabBehavior();
        this.grabEvents.forEach(eventName => this.removeEventListener(eventName));
        this.grabEvents.forEach(eventName => this.addEventListener(eventName, (event: MouseEvent) => {
            if (targetIsInput(this.element, event) || (this.draggableHasHandle(this.element) && !this.isHandleUsedToDrag(event))) {
                this.turnDragOff();
                this.cancelGrabEvents.forEach(eventName => document.addEventListener(eventName, this.intputTouchUpListener));
            } else if (this.targetIsGrabbable(event)) {
                this.cancelGrabEvents.forEach(eventName => document.addEventListener(eventName, this.touchUpListener));
                this.grabDelay = window.setTimeout(() => {
                    if (!MDraggable.currentDraggable && this.grabDelay) {
                        this.element.classList.add(MDraggableClassNames.Grabbing);
                        this.forceCursorRefresh();
                    }
                }, polyFillActive.dragDrop && !this.isMouseInitiatedDrag ? dragDropDelay : 0);
            }
        }));
    }

    private turnDragOn(): void {
        this.element.draggable = true;

        this.addEventListener('dragend', (event: DragEvent) => this.onDragEnd(event));
        this.addEventListener('dragstart', (event: DragEvent) => this.onDragStart(event));
        this.addEventListener('touchmove', () => this.touchHasMoved = true, true); // here is it important to use capture on devices that supports mouse + touch events.
        this.addEventListener('mousedown', () => { this.isMouseInitiatedDrag = true; }, true);
        this.setupGrabBehavior();
        MDOMPlugin.attach(MRemoveUserSelect, this.element, true);
    }

    private turnDragOff(): void {
        this.element.draggable = false;

        this.removeEventListener('dragend');
        this.removeEventListener('dragstart');
        this.removeEventListener('touchmove');
        this.removeEventListener('mousedown');
        this.destroyGrabBehavior();
        MDOMPlugin.detach(MRemoveUserSelect, this.element);
    }

    private targetIsGrabbable(event: Event): boolean {
        // We can't call event.preventDefault or event.stopPropagation here for the drag to be handled correctly on mobile devices.
        // So we make sure that the draggable affected by the dragEvent is the closest draggable parent of the event target.
        // We don't apply the "grabbing" style on mouse down when target correspond to a link or a button, it just looks weird.

        const draggable: MDraggable | undefined = MDOMPlugin.getRecursive(MDraggable, event.target as HTMLElement);
        if (!draggable || draggable !== this) { return false; }

        let recursiveElement: HTMLElement | null = event.target as HTMLElement | null;
        const noGrabTags: string[] = ['A', 'BUTTON'];
        let targetGrabbable: boolean = true;
        while (recursiveElement && targetGrabbable && recursiveElement !== draggable.element) {
            if (noGrabTags.find(tag => tag === recursiveElement!.tagName)) {
                targetGrabbable = false;
            }

            recursiveElement = recursiveElement.parentElement;
        }

        return targetGrabbable;
    }

    private destroyGrabBehavior(): void {
        this.touchHasMoved = false;
        this.isMouseInitiatedDrag = false;

        this.forceCursorRefresh();
        if (this.grabDelay) { window.clearTimeout(this.grabDelay); this.grabDelay = undefined; }
        this.cancelGrabEvents.forEach(eventName => document.removeEventListener(eventName, this.touchUpListener));
        this.cancelGrabEvents.forEach(eventName => document.removeEventListener(eventName, this.intputTouchUpListener));
    }

    private forceCursorRefresh(): void {
        // Hack to force cursor refresh.
        (this.element.style as any).webkitUserDrag = 'none';
        (this.element.style as any).webkitUserDrag = '';
    }

    private attachDragImage(): void {
        const dragImage: HTMLElement = this.element.querySelector(`.${MDraggableClassNames.DragImage}`) as HTMLElement;
        // We use this property to know if the dragImage was handled or not.
        const dragImagePluginName: string = '__mdraggableimage__';
        if (dragImage && !dragImage[dragImagePluginName]) {
            const offsetWidth: number = dragImage.offsetWidth;

            requestAnimationFrame(() => {
                const origin: number = -9999;
                dragImage.style.left = `${origin}px`;
                dragImage.style.top = `${origin}px`;
                dragImage.style.position = 'absolute';
                dragImage.style.overflow = 'hidden';
                dragImage.style.zIndex = '1';
                dragImage.hidden = true;
                dragImage[dragImagePluginName] = true;
            });
        }
    }

    private setEventDragImage(event: DragEvent): void {
        const dragImage: HTMLElement | null = this.element.querySelector(`.${MDraggableClassNames.DragImage}`) as HTMLElement;
        if (dragImage && event.dataTransfer!.setDragImage) {
            dragImage.hidden = false;
            if (polyFillActive.dragDrop) {
                event.dataTransfer!.setDragImage(dragImage, 0, 0);
            } else {
                event.dataTransfer!.setDragImage(dragImage, this.calculateHorizontalCenterOffset(dragImage), this.calculateVerticalCenterOffset(dragImage));
            }
        }
    }

    private calculateHorizontalCenterOffset(dragImage: HTMLElement): number {
        const dragImageWidth: string | null = window.getComputedStyle(dragImage).width;
        return dragImageWidth ? parseInt(dragImageWidth, 10) / 2 : 0;
    }

    private calculateVerticalCenterOffset(dragImage: HTMLElement): number {
        const dragImageHeight: string | null = window.getComputedStyle(dragImage).height;
        return dragImageHeight ? parseInt(dragImageHeight, 10) / 2 : 0;
    }

    private dispatchEvent(event: DragEvent, name: string): void {
        const data: any = this.options.dragData ? this.options.dragData : event.dataTransfer!.getData('text');
        const dragInfo: MDragInfo = {
            action: this.options.action,
            grouping: this.options.grouping,
            data
        };
        const customEvent: CustomEvent = document.createEvent('CustomEvent');
        customEvent.initCustomEvent(name, true, true, Object.assign(event, { dragInfo }));
        (customEvent as any).dragInfo = dragInfo;
        dispatchEvent(this.element, name, customEvent);
    }

    private cleanupCssClasses(): void {
        this.element.classList.remove(MDraggableClassNames.Dragging);
        this.element.classList.remove(MDraggableClassNames.Grabbing);
    }

    private draggableHasHandle(element: HTMLElement): boolean {
        return element.getElementsByClassName('drag-handle').length > 0;
    }

    private isHandleUsedToDrag(event: MouseEvent): boolean {
        const dragHandle: HTMLElement | null = this.element.querySelector('.drag-handle');
        if (dragHandle) {
            return dragHandle.classList.contains('drag-handle') && dragHandle.contains(event.target as Node);
        } else {
            return false;
        }
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
        v.use(RemoveUserSelectPlugin);
        v.directive(DRAGGABLE_NAME, Directive);
    }
};

export default DraggablePlugin;
