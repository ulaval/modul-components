import { DirectiveOptions, PluginObject, VNodeDirective } from 'vue';
import { mousePositionElement } from '../../../utils/mouse/mouse';
import { polyFillActive } from '../../../utils/polyfills';
import { DRAGGABLE_ALLOW_SCROLL_NAME } from '../../directive-names';
import { MDOMPlugin, MElementDomPlugin, MountFunction, RefreshFunction } from '../../domPlugin';
import { CancelableScrollTo, ScrollTo, ScrollToDuration } from '../../scroll-to/scroll-to-lib';


export enum MDraggableAllowScrollDirection {
    Top = 'top',
    Bottom = 'bottom'
}

export interface MDraggableAllowScrollOptions {
    allowScroll: boolean;
    scrollDirection: MDraggableAllowScrollDirection;
}

// Naive implementation for a single use case: allow autoscroll on a fixed element that appears at the absolute top of the viewport.
// Furthermore, the user must be dragging something for it to work.
export class MDraggableAllowScroll extends MElementDomPlugin<MDraggableAllowScrollOptions> {
    public static currentDraggableScroll?: MDraggableAllowScroll;
    public static defaultMountPoint: string = '__mdraggableallowscroll__';

    private activeScroll: CancelableScrollTo | undefined;

    public attach(mount: MountFunction): void {
        if (polyFillActive.dragDrop) { return; }
        // This is cheesy but we only need to fix the scrolling behavior if the polyfill is not active.
        // The polyfill already includes a scroll behavior for mobile devices.  However, it doesn't allow to enable the scrolling behavior for desktops.
        this.cleanUpOptions();
        if (this.options.allowScroll) {
            mount(() => {
                this.addEventListener('dragover', (event: DragEvent) => this.handleScroll(event));
            });
        }
    }

    public update(options: MDraggableAllowScrollOptions, refresh: RefreshFunction): void {
        this.cleanUpOptions();
        if (this.options.allowScroll) {
            refresh(() => this._options = options);
        }
    }

    public detach(): void {
        this.doCleanUp();
    }

    public doCleanUp(): void {
        this.element.style.display = '';
        this.cancelScroll();
    }

    private cleanUpOptions(): void {
        if (this._options === undefined) { this._options = { allowScroll: true, scrollDirection: MDraggableAllowScrollDirection.Top }; }
        if (this._options.allowScroll === undefined) { this._options.allowScroll = true; }
        if (this._options.scrollDirection === undefined) { this._options.scrollDirection = MDraggableAllowScrollDirection.Top; }
    }

    private handleScroll(event: DragEvent): void {
        const watchMouseMove: (event: MouseEvent) => void = (event: MouseEvent) => {
            if ((!this.shouldScroll(event) && this.activeScroll) || MDraggableAllowScroll.currentDraggableScroll !== this) {
                if (this.activeScroll) {
                    this.cancelScroll();
                }
                document.removeEventListener('dragover', watchMouseMove);
            } else if (!this.activeScroll) { this.activateScroll(); }
        };

        if (this.shouldScroll(event) && window.getComputedStyle(this.element).position === 'fixed') {
            if (MDraggableAllowScroll.currentDraggableScroll && MDraggableAllowScroll.currentDraggableScroll !== this) {
                MDraggableAllowScroll.currentDraggableScroll.doCleanUp();
                MDraggableAllowScroll.currentDraggableScroll = undefined;
                return;
            }

            MDraggableAllowScroll.currentDraggableScroll = this;
            document.addEventListener('dragover', watchMouseMove);
        }
    }

    private shouldScroll(event: MouseEvent): boolean {
        const scrollThreshold: number = this.element.offsetHeight;

        switch (this.options.scrollDirection) {
            case MDraggableAllowScrollDirection.Top: return event.clientY < scrollThreshold;
            case MDraggableAllowScrollDirection.Bottom: return mousePositionElement(event, this.element).y >= this.element.offsetHeight - scrollThreshold;
            default: throw new Error(`Unhandled value for scrollDirection: ${this.options.scrollDirection}`);
        }
    }

    private activateScroll(): void {
        switch (this.options.scrollDirection) {
            case MDraggableAllowScrollDirection.Top:

                // tslint:disable-next-line: deprecation
                this.activeScroll = new ScrollTo().scrollToTop(document.documentElement, ScrollToDuration.Slower);
                break;
            case MDraggableAllowScrollDirection.Bottom:
                // tslint:disable-next-line: deprecation
                this.activeScroll = new ScrollTo().scrollToBottom(document.documentElement, ScrollToDuration.Slower);
                break;
            default: throw new Error(`Unhandled value for scrollDirection: ${this.options.scrollDirection}`);
        }
    }

    private cancelScroll(): void {
        if (this.activeScroll) {
            this.activeScroll.cancel();
            this.activeScroll = undefined;
            this.doCleanUp();
        }
    }
}

const extractOptions: (binding: VNodeDirective) => MDraggableAllowScrollOptions = (binding: VNodeDirective) => {
    return {
        allowScroll: binding.value as boolean,
        scrollDirection: binding.arg as MDraggableAllowScrollDirection
    };
};

const Directive: DirectiveOptions = {
    inserted(element: HTMLElement, binding: VNodeDirective): void {
        MDOMPlugin.attach(MDraggableAllowScroll, element, extractOptions(binding));
    },
    update(element: HTMLElement, binding: VNodeDirective): void {
        MDOMPlugin.attach(MDraggableAllowScroll, element, extractOptions(binding));
    },
    unbind(element: HTMLElement): void {
        MDOMPlugin.detach(MDraggableAllowScroll, element);
    }
};

const DraggableAllowScrollPlugin: PluginObject<any> = {
    install(v): void {
        v.directive(DRAGGABLE_ALLOW_SCROLL_NAME, Directive);
    }
};

export default DraggableAllowScrollPlugin;
