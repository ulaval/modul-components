import { DirectiveOptions, PluginObject, VNode, VNodeDirective } from 'vue';

import { polyFillActive } from '../../utils/polyfills';
import { DRAGGABLE_ALLOW_SCROLL_NAME } from '../directive-names';
import { MDOMPlugin, MElementDomPlugin, MountFunction, RefreshFunction } from '../domPlugin';
import { ScrollTo } from '../scroll-to/scroll-to-lib';
import { CancelableScrollTo, ScrollToDuration } from './../scroll-to/scroll-to-lib';

interface ScrollPosition { left: number; top: number; }

// Naive implementation for a single use case: allow autoscroll on a fixed element that appears at the absolute top of the viewport.
// Furthermore, the user must be dragging something for it to work.
export class MDraggableAllowScroll extends MElementDomPlugin<boolean> {
    public static currentDraggableScroll?: MDraggableAllowScroll;
    public static defaultMountPoint: string = '__mdraggableallowscroll__';

    private activeScroll: CancelableScrollTo | undefined;

    public attach(mount: MountFunction): void {
        // This is cheesy but we only need to fix the scrolling behavior if the polyfill is not active.
        // The polyfill already includes a scroll behavior for mobile devices.  However, it doesn't allow to enable the scrolling behavior for desktops.
        if (polyFillActive.dragDrop) { return; }

        if (this._options === undefined) { this._options = true; }
        mount(() => {
            this.addEventListener('dragover', (event: DragEvent) => this.handleScroll(event));
        });
    }

    public update(options: boolean, refresh: RefreshFunction): void {
        if (options === undefined) { options = true; }
        refresh(() => this._options = options);
    }

    public detach(): void {
        this.doCleanUp();
    }

    public doCleanUp(): void {
        this.element.style.display = '';
        this.cancelScroll();
    }

    private handleScroll(event: DragEvent): void {
        const scrollThreshold: number = 20;

        const watchMouseMove: (event: MouseEvent) => void = (event: MouseEvent) => {
            if (event.clientY >= scrollThreshold && this.activeScroll) {
                if (this.activeScroll) {
                    document.removeEventListener('dragover', watchMouseMove);
                    this.cancelScroll();
                }
            } else if (!this.activeScroll) {
                this.activeScroll = new ScrollTo().scrollToTop(document.documentElement, ScrollToDuration.Slower);
            }
        };

        if (event.clientY < scrollThreshold && window.getComputedStyle(this.element).position === 'fixed') {
            MDraggableAllowScroll.currentDraggableScroll = this;
            document.addEventListener('dragover', watchMouseMove);
        }
    }

    private cancelScroll(): void {
        if (this.activeScroll) {
            this.activeScroll.cancel();
            this.activeScroll = undefined;
            this.doCleanUp();
        }
    }

    private getViewportScrollPosition(): ScrollPosition {
        const doc: HTMLElement = document.documentElement;
        const left: number = doc.scrollLeft - (doc.clientLeft || 0);
        const top: number = doc.scrollTop - (doc.clientTop || 0);
        return { left, top };
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
