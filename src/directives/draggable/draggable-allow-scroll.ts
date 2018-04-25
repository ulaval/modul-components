import { DirectiveOptions, PluginObject, VNode, VNodeDirective } from 'vue';

import { isInElement } from '../../utils/mouse/mouse';
import { polyFillActive } from '../../utils/polyfills';
import { DRAGGABLE_ALLOW_SCROLL_NAME } from '../directive-names';
import { MDOMPlugin, MElementDomPlugin, MountFunction, RefreshFunction } from '../domPlugin';

export class MDraggableAllowScroll extends MElementDomPlugin<boolean> {
    public static currentDraggableScroll?: MDraggableAllowScroll;
    public static defaultMountPoint: string = '__mdraggableallowscroll__';

    public attach(mount: MountFunction): void {
        if (window.getComputedStyle(this.element).position !== 'fixed') {
            console.error(`Directive v-${DRAGGABLE_ALLOW_SCROLL_NAME} expected element to have position: fixed.`);
            return;
        }

        // This is cheesy but we only need to fix the scrolling behavior if the polyfill is not active.
        // The polyfill already includes a scroll behavior for mobile devices.  However, it doesn't allow to enable the scrolling behavior for desktops.
        if (polyFillActive.dragDrop) { return; }

        if (this._options === undefined) { this._options = true; }
        mount(() => {
            this.addEventListener('dragover', (event: DragEvent) => this.handleScroll(event));
            this.addEventListener('dragleave', (event: DragEvent) => this.dragLeave(event));
        });
    }

    public update(options: boolean, refresh: RefreshFunction): void {
        if (options === undefined) { options = true; }
        refresh(() => this._options = options);
    }

    public detach(): void {}

    public doCleanUp(): void {
        if (MDraggableAllowScroll.currentDraggableScroll) { MDraggableAllowScroll.currentDraggableScroll = undefined; }
        this.element.style.top = '';
        this.element.style.width = '';
        this.element.style.height = '';
        this.element.style.position = '';
        document.removeEventListener('scroll', this.scrollCallback);
    }

    private dragLeave(event: DragEvent): void {
        if (!isInElement(event, this.element)) {
            this.doCleanUp();
        }
    }

    private handleScroll(event: DragEvent): void {
        const scrollThreshold: number = 20;
        if (event.clientY < scrollThreshold) {
            MDraggableAllowScroll.currentDraggableScroll = this;
            this.element.style.height = `${this.element.offsetHeight}px`;
            this.element.style.width = `${this.element.offsetWidth}px`;
            this.element.style.top = `${window.pageYOffset}px`;
            this.element.style.position = 'absolute';

            document.addEventListener('scroll', this.scrollCallback);
        } else {
            this.doCleanUp();
        }
    }

    private scrollCallback: () => void = () => {
        this.element.style.top = `${window.pageYOffset}px`;
    }
}

const Directive: DirectiveOptions = {
    inserted(element: HTMLElement, binding: VNodeDirective, node: VNode): void {
        MDOMPlugin.attach(MDraggableAllowScroll, element, binding.value);
    },
    update(element: HTMLElement, binding: VNodeDirective, node: VNode): void {
        MDOMPlugin.attach(MDraggableAllowScroll, element, binding.value);
    },
    unbind(element: HTMLElement, binding: VNodeDirective): void {
        MDOMPlugin.detach(MDraggableAllowScroll, element);
    }
};

const DraggableAllowScrollPlugin: PluginObject<any> = {
    install(v, options): void {
        v.directive(DRAGGABLE_ALLOW_SCROLL_NAME, Directive);
    }
};

export default DraggableAllowScrollPlugin;
