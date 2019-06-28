import PortalPlugin from 'portal-vue';
import Vue, { PluginObject } from 'vue';
import { BackdropMode } from '../../mixins/portal/portal';
import uuid from '../uuid/uuid';

/**
 * Augment the typings of Vue.js
 */

declare module 'vue/types/vue' {
    interface Vue {
        $modul: Modul;
    }
}

const BACKDROP_ID: string = 'mBackdropID';
const BACKDROP_CLASS_NAME: string = 'm-backdrop';
const BACKDROP_STYLE_TRANSITION: string = 'opacity ease';
const BACKDROP_STYLE_TRANSITION_SLOW_DURATION: number = 600;
const BACKDROP_STYLE_TRANSITION_FAST_DURATION: number = 300;
const BACKDROP_STYLE_POSITION: string = 'fixed';
const BACKDROP_STYLE_POSITION_VALUE: string = '0';
const BACKDROP_STYLE_BACKGROUND: string = '#000';
const BACKDROP_STYLE_OPACITY: string = '0';
const BACKDROP_STYLE_OPACITY_VISIBLE: string = '0.7';
const BACKDROP_STYLE_OPACITY_NOT_VISIBLE: string = '0';

const Z_INDEZ_DEFAULT: number = 100;
const DONE_EVENT_DURATION: number = 100;

interface StackElement {
    stackIndex: number;
    backdropIndex: number | undefined;
    backdropIsFast: boolean;
    scrollId: string | undefined;
}

type StackMap = {
    [key: string]: StackElement
};

export class Modul {
    public htmlEl: HTMLElement = document.querySelector('html') as HTMLElement;
    public bodyEl: HTMLElement = document.querySelector('body') as HTMLElement;
    public event = new Vue();
    public scrollPosition: number = 0;
    public stopScrollPosition: number = 0;
    public scrollDown: boolean = false;
    public scrollUp: boolean = true;

    public backdropElement: HTMLElement | undefined;
    public windowZIndex: number = Z_INDEZ_DEFAULT;

    private windowStack: (string | undefined)[] = [];
    private windowStackMap: StackMap = {};
    private lastScrollPosition: number = 0;
    private doneScrollEvent: any;
    private doneResizeEvent: any;
    private internalScrollActive: boolean = true;

    constructor() {
        this.scrollPosition = window.pageYOffset;
        window.addEventListener('click', (e: MouseEvent) => this.onClick(e));
        window.addEventListener('scroll', (e) => this.onScroll(e));
        window.addEventListener('resize', (e) => this.onResize(e));
    }

    /**
     * @deprecated Don't use this function to emit events between two components
     */
    public updateAfterResize(): void {
        this.event.$emit('updateAfterResize');
    }

    public pushElement(element: HTMLElement, backdropMode: BackdropMode, viewportIsSmall: boolean): string {
        let stackId: string = uuid.generate();
        let backdropIndex: number | undefined = undefined;
        let scrollId: string | undefined = undefined;

        if (backdropMode !== BackdropMode.None) {
            this.scrollActive = false;
            scrollId = uuid.generate();
        }
        if (backdropMode === BackdropMode.BackdropFast || backdropMode === BackdropMode.BackdropSlow) {
            backdropIndex = this.ensureBackdrop(viewportIsSmall);
        }

        let index: number = this.windowStack.push(stackId) - 1;
        this.windowStackMap[stackId] = {
            stackIndex: index,
            backdropIndex: backdropIndex,
            backdropIsFast: backdropMode === BackdropMode.BackdropFast,
            scrollId: scrollId
        };

        this.windowZIndex++;
        element.style.zIndex = String(this.windowZIndex);

        return stackId;
    }

    public popElement(stackId: string): void {
        if (this.peekElement() === stackId) {
            this.windowZIndex--;
            this.windowStack.pop();
        } else {
            this.windowStack[this.windowStackMap[stackId].stackIndex] = undefined;
        }

        while (this.windowStack.length > 0 && this.windowStack[this.windowStack.length - 1] === undefined) {
            this.windowZIndex--;
            this.windowStack.pop();
        }

        let stackElement: StackElement = this.windowStackMap[stackId];

        if (stackElement.backdropIndex || stackElement.scrollId) {
            this.removeBackdrop(!stackElement.backdropIsFast);
        }

        if (this.windowZIndex < Z_INDEZ_DEFAULT) {
            Vue.prototype.$log.warn('$modul: Invalid window ref count');
            this.windowZIndex = Z_INDEZ_DEFAULT;
        }

        delete this.windowStackMap[stackId];
    }

    public peekElement(): string | undefined {
        return this.windowStack.length > 0 ? this.windowStack[this.windowStack.length - 1] : undefined;
    }

    private onClick(event: MouseEvent): void {
        this.event.$emit('click', event);
    }

    private onScroll(event): void {
        if (this.scrollActive) {
            this.scrollPosition = window.pageYOffset;
            if (this.lastScrollPosition > this.scrollPosition) {
                this.scrollUp = true;
                this.scrollDown = false;
            } else {
                this.scrollUp = false;
                this.scrollDown = true;
            }
            this.lastScrollPosition = this.scrollPosition;
            this.event.$emit('scroll', event);

            clearTimeout(this.doneScrollEvent);
            this.doneScrollEvent = setTimeout(() => {
                this.event.$emit('scrollDone', event);
            }, DONE_EVENT_DURATION);

        }
    }

    private onResize(event): void {
        this.event.$emit('resize', event);

        clearTimeout(this.doneResizeEvent);
        this.doneResizeEvent = setTimeout(() => {
            this.event.$emit('resizeDone', event);
        }, DONE_EVENT_DURATION);
    }

    private ensureBackdrop(viewportIsSmall: boolean): number {
        if (!this.backdropElement) {
            let element: HTMLElement = document.createElement('div');
            let id: string = BACKDROP_ID + '-' + uuid.generate();
            element.setAttribute('id', id);
            element.setAttribute('class', BACKDROP_CLASS_NAME);
            element.setAttribute('aria-hidden', 'true');


            // tslint:disable-next-line: deprecation
            element.style.webkitTransition = BACKDROP_STYLE_TRANSITION;
            element.style.transition = BACKDROP_STYLE_TRANSITION;
            element.style.position = BACKDROP_STYLE_POSITION;
            element.style.top = BACKDROP_STYLE_POSITION_VALUE;
            element.style.right = BACKDROP_STYLE_POSITION_VALUE;
            element.style.bottom = BACKDROP_STYLE_POSITION_VALUE;
            element.style.left = BACKDROP_STYLE_POSITION_VALUE;
            element.style.zIndex = String(this.windowZIndex);
            element.style.background = BACKDROP_STYLE_BACKGROUND;
            element.style.opacity = BACKDROP_STYLE_OPACITY;

            this.bodyEl.appendChild(element);

            this.backdropElement = document.querySelector('#' + id) as HTMLElement;
            let duration: string = String(BACKDROP_STYLE_TRANSITION_FAST_DURATION / 1000) + 's';
            // tslint:disable-next-line: deprecation
            this.backdropElement.style.webkitTransitionDuration = duration;
            this.backdropElement.style.transitionDuration = duration;

            setTimeout(() => {
                if (this.backdropElement) {
                    this.backdropElement.style.opacity = BACKDROP_STYLE_OPACITY_VISIBLE;
                }
            }, 5);
        } else {
            this.backdropElement.style.zIndex = String(this.windowZIndex);
        }

        return this.windowZIndex;
    }

    private removeBackdrop(slow: boolean): void {
        let lastBackdropIndex: number | undefined = undefined;
        let lastScrollId: string | undefined = undefined;
        for (let i: number = this.windowStack.length - 1; i >= 0; i--) {
            let stackId: string | undefined = this.windowStack[i];
            if (stackId) {
                if (!lastBackdropIndex && this.windowStackMap[stackId].backdropIndex) {
                    lastBackdropIndex = this.windowStackMap[stackId].backdropIndex;
                }
                if (!lastScrollId && this.windowStackMap[stackId].scrollId) {
                    lastScrollId = this.windowStackMap[stackId].scrollId;
                }
                if (lastBackdropIndex && lastScrollId) {
                    break;
                }
            }
        }

        if (!lastScrollId && lastBackdropIndex) {
            throw new Error('Backdrop should always hide scroll bar');
        }

        if (!lastScrollId && !this.backdropElement) {
            this.scrollActive = true;
        } else if (!lastBackdropIndex) {
            let speed: number = slow ? BACKDROP_STYLE_TRANSITION_SLOW_DURATION : BACKDROP_STYLE_TRANSITION_FAST_DURATION;
            if (this.backdropElement) {
                let duration: string = String(speed / 1000) + 's';
                // tslint:disable-next-line: deprecation
                this.backdropElement.style.webkitTransitionDuration = duration;
                this.backdropElement.style.transitionDuration = duration;

                this.backdropElement.style.opacity = BACKDROP_STYLE_OPACITY_NOT_VISIBLE;
                let b: HTMLElement = this.backdropElement;
                this.backdropElement = undefined;

                if (!lastScrollId) {
                    this.scrollActive = true;
                }

                setTimeout(() => {
                    if (b && b.parentNode) {
                        b.parentNode.removeChild(b);
                    }
                }, speed);
            }
        } else if (this.backdropElement) {
            this.backdropElement.style.zIndex = String(lastBackdropIndex);
        } else {
            throw new Error('backdropElement cannot be null');
        }
    }

    private set scrollActive(scrollActive: boolean) {
        if (scrollActive) {
            this.htmlEl.style.removeProperty('position');
            this.htmlEl.style.removeProperty('top');
            this.htmlEl.style.removeProperty('right');
            this.htmlEl.style.removeProperty('left');
            this.htmlEl.style.removeProperty('bottom');
            this.htmlEl.style.removeProperty('height');
            this.bodyEl.style.removeProperty('margin-top');
            window.scrollTo(0, this.stopScrollPosition);

            if (this.htmlEl.style.length === 0) {
                this.htmlEl.removeAttribute('style');
            }

            if (this.bodyEl.style.length === 0) {
                this.bodyEl.removeAttribute('style');
            }

        } else {
            this.stopScrollPosition = this.scrollPosition;
            this.htmlEl.style.position = 'fixed';
            this.htmlEl.style.top = '0';
            this.htmlEl.style.right = '0';
            this.htmlEl.style.left = '0';
            this.htmlEl.style.bottom = '0';
            this.htmlEl.style.height = '100%';
            this.bodyEl.style.marginTop = `-${this.stopScrollPosition}px`;
        }
        this.internalScrollActive = scrollActive;
    }

    private get scrollActive(): boolean {
        return this.internalScrollActive;
    }
}

const ModulPlugin: PluginObject<any> = {
    install(v, options): void {
        Vue.use(PortalPlugin);
        let modul: Modul = new Modul();
        (v.prototype).$modul = modul;
    }
};

export default ModulPlugin;
