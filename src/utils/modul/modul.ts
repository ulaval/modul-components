import Vue, { PluginObject } from 'vue';
import uuid from '../../utils/uuid/uuid';

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
const DONE_EVENT_DURATION: number = 250;

export class Modul {
    public bodyEl: HTMLElement = document.body || document.documentElement;
    public bodyStyle: any = this.bodyEl.style;
    public htmlEl: HTMLElement = document.querySelector('html') as HTMLElement;
    public event = new Vue();
    public scrollPosition: number = 0;
    public stopScrollPosition: number = 0;
    public scrollDown: boolean = false;
    public scrollUp: boolean = true;

    public backdropElement: HTMLElement | undefined;
    public windowZIndex: number = Z_INDEZ_DEFAULT;

    private backdropIndex: number[] = [];
    private windowStack: HTMLElement[] = [];
    private lastScrollPosition: number = 0;
    private doneScrollEvent: any;
    private doneResizeEvent: any;

    constructor() {
        this.scrollPosition = window.scrollY;
        window.addEventListener('click', (e: MouseEvent) => this.onClick(e));
        window.addEventListener('scroll', (e) => this.onScroll(e));
        window.addEventListener('resize', (e) => this.onResize(e));
    }

    public onClick(event: MouseEvent): void {
        this.event.$emit('click', event);
    }

    public onScroll(event): void {
        this.scrollPosition = window.scrollY == undefined ? document.documentElement.scrollTop : window.scrollY;
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

    public onResize(event): void {
        this.event.$emit('resize', event);

        clearTimeout(this.doneResizeEvent);
        this.doneResizeEvent = setTimeout(() => {
            this.event.$emit('resizeDone', event);
        }, DONE_EVENT_DURATION);
    }

    public updateAfterResize(): void {
        this.event.$emit('updateAfterResize');
    }

    public pushElement(element: HTMLElement, withBackdrop: boolean, viewportIsSmall: boolean): void {
        if (withBackdrop) {
            this.ensureBackdrop(viewportIsSmall);
        }
        this.windowStack.push(element);
        this.windowZIndex++;
        element.style.zIndex = String(this.windowZIndex);
    }

    public popElement(element: HTMLElement, withBackdrop: boolean, slow: boolean): void {
        this.windowZIndex--;
        this.windowStack.pop();
        if (this.windowZIndex < Z_INDEZ_DEFAULT) {
            console.warn('$modul: Invalid window ref count');
            this.windowZIndex = Z_INDEZ_DEFAULT;
        }
        if (withBackdrop) {
            this.removeBackdrop(slow);
        }
    }

    public peekElement(): HTMLElement | undefined {
        return this.windowStack.length > 0 ? this.windowStack[this.windowStack.length - 1] : undefined;
    }

    private ensureBackdrop(viewportIsSmall: boolean): void {
        if (!this.backdropElement) {
            this.stopScollBody(viewportIsSmall);

            let element: HTMLElement = document.createElement('div');
            let id: string = BACKDROP_ID + '-' + uuid.generate();
            element.setAttribute('id', id);
            element.setAttribute('class', BACKDROP_CLASS_NAME);
            element.setAttribute('aria-hidden', 'true');

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
            this.backdropElement.style.webkitTransitionDuration = duration;
            this.backdropElement.style.transitionDuration = duration;

            setTimeout(() => {
                if (this.backdropElement) {
                    this.backdropElement.style.opacity = BACKDROP_STYLE_OPACITY_VISIBLE;
                }
            }, 5);
        } else {
            this.backdropIndex.push(Number(this.backdropElement.style.zIndex));
            this.backdropElement.style.zIndex = String(this.windowZIndex);
        }
    }

    private removeBackdrop(slow: boolean) {
        if (this.backdropIndex.length == 0) {
            let speed: number = slow ? BACKDROP_STYLE_TRANSITION_SLOW_DURATION : BACKDROP_STYLE_TRANSITION_FAST_DURATION;
            if (this.backdropElement) {
                let duration: string = String(speed / 1000) + 's';
                this.backdropElement.style.webkitTransitionDuration = duration;
                this.backdropElement.style.transitionDuration = duration;

                this.backdropElement.style.opacity = BACKDROP_STYLE_OPACITY_NOT_VISIBLE;

                setTimeout(() => {
                    if (this.backdropElement) {
                        document.body.removeChild(this.backdropElement);
                        this.backdropElement = undefined;

                        this.activeScollBody();
                    }
                }, speed);
            }
        } else if (this.backdropElement) {
            let lastIndex: string = String(this.backdropIndex.pop());
            this.backdropElement.style.zIndex = lastIndex;
        }
    }

    private activeScollBody(): void {
        this.htmlEl.style.removeProperty('overflow');
        this.bodyStyle.removeProperty('position');
        this.bodyStyle.removeProperty('top');
        this.bodyStyle.removeProperty('right');
        this.bodyStyle.removeProperty('left');
        this.bodyStyle.removeProperty('buttom');
        this.bodyStyle.removeProperty('overflow');
        window.scrollBy(0, this.stopScrollPosition);
        this.stopScrollPosition = this.scrollPosition;
        if (this.bodyStyle.length == 0) {
            this.bodyEl.removeAttribute('style');
        }
    }

    private stopScollBody(viewportIsSmall: boolean): void {
        this.stopScrollPosition = this.scrollPosition;
        // if (viewportIsSmall) {
        this.bodyStyle.position = 'fixed';
        // }
        this.bodyStyle.top = '-' + this.stopScrollPosition + 'px';
        this.bodyStyle.right = '0';
        this.bodyStyle.left = '0';
        this.bodyStyle.bottom = '0'; // Added to fix edge case where showed contents through popper/portal are hidden when page content isn't high enough to stretch the body.
        this.bodyStyle.overflow = 'hidden';
        this.htmlEl.style.overflow = 'hidden';
    }
}

const ModulPlugin: PluginObject<any> = {
    install(v, options) {
        let modul = new Modul();
        (v as any).$modul = modul;
        (v.prototype as any).$modul = modul;
    }
};

export default ModulPlugin;
