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

    // public windowCount: number = 0;
    // public arrWindow: any = new Array();

    public backdropElement: HTMLElement | undefined;
    // public backdropId: string = '';
    public windowZIndex: number = Z_INDEZ_DEFAULT;
    // public hasBackdrop: boolean = false;
    // public backdropTransitionDuration: string = BACKDROP_STYLE_TRANSITION_DURATION;

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
        this.scrollPosition = window.scrollY;
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

    // public addWindow(windowId): void {
    //     this.windowCount++;
    //     this.windowZIndex++;
    //     if (this.windowCount == 1) {
    //         this.stopScollBody();
    //     }
    //     // this.arrWindow.push({
    //     //     id: windowId,
    //     //     windowPosition: this.windowCount - 1,
    //     //     zIndex: this.windowZIndex
    //     // });
    //     this.setBackdropZIndex();
    // }

    // public deleteWindow(windowId): void {
    //     this.windowCount--;
    //     this.windowZIndex--;
    //     if (this.windowCount == 0) {
    //         this.activeScollBody();
    //         this.removeBackdrop();
    //         this.windowZIndex = Z_INDEZ_DEFAULT;
    //     }
    //     // let windowPosition: number = Number(this.getArrWindowData(windowId)['windowPosition']);
    //     // this.arrWindow.splice(windowPosition, 1);
    //     this.setBackdropZIndex();
    // }

    public updateAfterResize(): void {
        this.event.$emit('updateAfterResize');
    }

    public pushElement(element: HTMLElement): void {
        this.ensureBackdrop();
        this.windowZIndex++;
        element.style.zIndex = String(this.windowZIndex);
    }

    public popElement(element: HTMLElement, slow: boolean = false): void {
        this.windowZIndex--;
        if (this.windowZIndex < Z_INDEZ_DEFAULT) {
            console.warn('$modul: Invalid window ref count');
            this.windowZIndex = Z_INDEZ_DEFAULT;
        }
        if (this.windowZIndex == Z_INDEZ_DEFAULT) {
            this.removeBackdrop(slow);
        }
    }

    private ensureBackdrop(targetElement: HTMLElement = this.bodyEl): void {
        if (!this.backdropElement) {
            this.stopScollBody();

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

            targetElement.appendChild(element);

            this.backdropElement = document.querySelector('#' + id) as HTMLElement;
            let duration: string = String(BACKDROP_STYLE_TRANSITION_FAST_DURATION / 1000) + 's';
            this.backdropElement.style.webkitTransitionDuration = duration;
            this.backdropElement.style.transitionDuration = duration;

            setTimeout(() => {
                if (this.backdropElement) {
                    this.backdropElement.style.opacity = BACKDROP_STYLE_OPACITY_VISIBLE;
                }
            }, 5);
        }
    }

    private removeBackdrop(slow: boolean) {
        console.log('slow:', slow);
        let speed: number = slow ? BACKDROP_STYLE_TRANSITION_SLOW_DURATION : BACKDROP_STYLE_TRANSITION_FAST_DURATION;
        if (this.backdropElement) {
            if (this.backdropElement) {
                let duration: string = String(speed / 1000) + 's';
                this.backdropElement.style.webkitTransitionDuration = duration;
                this.backdropElement.style.transitionDuration = duration;

                this.backdropElement.style.opacity = BACKDROP_STYLE_OPACITY_NOT_VISIBLE;
            }

            setTimeout(() => {
                if (this.backdropElement) {
                    document.body.removeChild(this.backdropElement);
                    this.backdropElement = undefined;

                    this.activeScollBody();
                }
            }, speed);
        }
    }

    // public setBackdropTransitionDuration(transitionDuration: string = BACKDROP_STYLE_TRANSITION_DURATION): void {
    //     // this.backdropTransitionDuration = transitionDuration;
    //     if (this.backdropElement) {
    //         this.backdropElement.style.webkitTransitionDuration = transitionDuration;
    //         this.backdropElement.style.transitionDuration = transitionDuration;
    //     }
    // }

    // public setBackdropOpacity(opacityValue: string): void {

    // }

    private activeScollBody(): void {
        this.htmlEl.style.removeProperty('overflow');
        this.bodyStyle.removeProperty('position');
        this.bodyStyle.removeProperty('top');
        this.bodyStyle.removeProperty('right');
        this.bodyStyle.removeProperty('left');
        this.bodyStyle.removeProperty('overflow');
        window.scrollBy(0, this.stopScrollPosition);
        this.stopScrollPosition = this.scrollPosition;
        if (this.bodyStyle.length == 0) {
            this.bodyEl.removeAttribute('style');
        }
    }

    private stopScollBody(): void {
        this.stopScrollPosition = this.scrollPosition;
        this.bodyStyle.position = 'fixed';
        this.bodyStyle.top = '-' + this.stopScrollPosition + 'px';
        this.bodyStyle.right = '0';
        this.bodyStyle.left = '0';
        this.bodyStyle.bottom = '0'; // Added to fix edge case where showed contents through popper/portal are hidden when page content isn't high enough to stretch the body.
        this.bodyStyle.overflow = 'hidden';
        this.htmlEl.style.overflow = 'hidden';
    }

    // public getArrWindowData(windowId): any {
    //     for (let i = 0; i < this.arrWindow.length; i++) {
    //         if (this.arrWindow[i].id == windowId) {
    //             return this.arrWindow[i];
    //         }
    //     }
    // }

    // public setBackdropStyle(): void {
    //     if (this.backdropElement) {
    //         let styles: any = this.backdropElement.style;
    //         styles.webkitTransition = BACKDROP_STYLE_TRANSITION;
    //         styles.transition = BACKDROP_STYLE_TRANSITION;
    //         styles.webkitTransitionDuration = BACKDROP_STYLE_TRANSITION_OPEN_DURATION;
    //         styles.transitionDuration = BACKDROP_STYLE_TRANSITION_OPEN_DURATION;
    //         styles.position = BACKDROP_STYLE_POSITION;
    //         styles.top = BACKDROP_STYLE_POSITION_VALUE;
    //         styles.right = BACKDROP_STYLE_POSITION_VALUE;
    //         styles.bottom = BACKDROP_STYLE_POSITION_VALUE;
    //         styles.left = BACKDROP_STYLE_POSITION_VALUE;
    //         styles.zIndex = String(this.windowZIndex);
    //         styles.background = BACKDROP_STYLE_BACKGROUND;
    //         styles.opacity = BACKDROP_STYLE_OPACITY;
    //     }
    // }

    // private setBackdropZIndex() {
    //     if (this.backdropElement) {
    //         this.backdropElement.style.zIndex = String(this.windowZIndex);
    //     }
    // }
}

const ModulPlugin: PluginObject<any> = {
    install(v, options) {
        let modul = new Modul();
        (v as any).$modul = modul;
        (v.prototype as any).$modul = modul;
    }
};

export default ModulPlugin;
