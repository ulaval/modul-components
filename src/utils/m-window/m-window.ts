import Vue, { PluginObject } from 'vue';
import uuid from '../../utils/uuid/uuid';

const BACKDROP_ID: string = 'mBackdropID';
const BACKDROP_CLASS_NAME: string = 'm-backdrop';
const BACKDROP_STYLE_TRANSITION: string = 'opacity ease';
const BACKDROP_STYLE_TRANSITION_DURATION: string = '0.3s';
const BACKDROP_STYLE_POSITION: string = 'fixed';
const BACKDROP_STYLE_POSITION_VALUE: string = '0';
const BACKDROP_STYLE_BACKGROUND: string = '#000';
const BACKDROP_STYLE_OPACITY: string = '0';
const BACKDROP_STYLE_OPACITY_VISIBLE: string = '0.7';

const Z_INDEZ_DEFAULT: number = 100;

export class MWindow {
    public bodyEl: HTMLElement = document.body;
    public bodyStyle: any = this.bodyEl.style;
    public htmlEl: HTMLElement = document.querySelector('html') as HTMLElement;
    public scrollPosition: number = 0;
    public event = new Vue();
    public scrollDown: boolean = false;
    public scrollUp: boolean = true;

    public windowCount: number = 0;
    // public arrWindow: any = new Array();

    public backdropElement: HTMLElement;
    public backdropId: string = '';
    public windowZIndex: number = Z_INDEZ_DEFAULT;
    public hasBackdrop: boolean = false;
    private backdropTransitionDuration: string = BACKDROP_STYLE_TRANSITION_DURATION;

    private scrollLastPosition: number = 0;

    constructor() {
        window.addEventListener('click', (e: MouseEvent) => this.onClick(e));
        window.addEventListener('scroll', (e) => this.onScroll(e));
        window.addEventListener('resize', (e) => this.onRisize(e));
    }

    public onClick(event: MouseEvent): void {
        this.event.$emit('click', event);
    }

    public onRisize(event): void {
        this.event.$emit('resize', event);
    }

    public elementIsClick(element: HTMLElement, eventTarget: HTMLElement): boolean {
        return element.contains(eventTarget);
    }

    public onScroll(event): void {
        this.setScrollPosition();
        if (this.scrollLastPosition > this.scrollPosition) {
            this.scrollUp = true;
            this.scrollDown = false;
        } else {
            this.scrollUp = false;
            this.scrollDown = true;
        }
        this.scrollLastPosition = this.scrollPosition;
        this.event.$emit('scroll', event);
    }

    public addWindow(windowId): void {
        this.windowCount++;
        this.windowZIndex++;
        if (this.windowCount == 1) {
            this.stopScollBody();
        }
        // this.arrWindow.push({
        //     id: windowId,
        //     windowPosition: this.windowCount - 1,
        //     zIndex: this.windowZIndex
        // });
        this.setBackdropZIndex();
    }

    public deleteWindow(windowId): void {
        this.windowCount--;
        this.windowZIndex--;
        if (this.windowCount == 0) {
            this.activeScollBody();
            this.removeBackdrop();
            this.windowZIndex = Z_INDEZ_DEFAULT;
        }
        // let windowPosition: number = Number(this.getArrWindowData(windowId)['windowPosition']);
        // this.arrWindow.splice(windowPosition, 1);
        this.setBackdropZIndex();
    }

    public createBackdrop(targetElement: HTMLElement = this.bodyEl): void {
        if (!this.hasBackdrop) {
            this.hasBackdrop = true;
            this.backdropElement = document.createElement('div');
            this.backdropId = BACKDROP_ID + '-' + uuid.generate();
            this.backdropElement.setAttribute('id', this.backdropId);
            this.backdropElement.setAttribute('class', BACKDROP_CLASS_NAME);
            this.backdropElement.setAttribute('aria-hidden', 'true');
            this.setBackdropStyle();
            targetElement.appendChild(this.backdropElement);
            this.backdropElement = document.querySelector('#' + this.backdropId) as HTMLElement;
            setTimeout(() => {
                this.setBackdropOpacity(BACKDROP_STYLE_OPACITY_VISIBLE);
            }, 2);
        }
    }

    public removeBackdrop() {
        if (this.hasBackdrop) {
            document.body.removeChild(this.backdropElement);
            this.hasBackdrop = false;
        }
    }

    public setBackdropTransitionDuration(transitionDuration: string = BACKDROP_STYLE_TRANSITION_DURATION): void {
        this.backdropTransitionDuration = transitionDuration;
        this.backdropElement.style.webkitTransitionDuration = transitionDuration;
        this.backdropElement.style.transitionDuration = transitionDuration;
    }

    public setBackdropOpacity(opacityValue: string): void {
        this.backdropElement.style.opacity = opacityValue;
    }

    public activeScollBody(): void {
        this.bodyStyle.removeProperty('position');
        this.bodyStyle.removeProperty('top');
        this.bodyStyle.removeProperty('right');
        this.bodyStyle.removeProperty('left');
        this.bodyStyle.removeProperty('overflow');
        this.htmlEl.style.removeProperty('overflow');
        window.scrollBy(0, this.scrollPosition);
        if (this.bodyStyle.length == 0) {
            this.bodyEl.removeAttribute('style');
        }
    }

    public stopScollBody(): void {
        this.setScrollPosition();
        this.bodyStyle.position = 'fixed';
        this.bodyStyle.top = '-' + this.scrollPosition + 'px';
        this.bodyStyle.right = '0';
        this.bodyStyle.left = '0';
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

    public setScrollPosition() {
        this.scrollPosition = window.pageYOffset;
    }

    public setBackdropStyle(): void {
        let styles: any = this.backdropElement.style;
        styles.webkitTransition = BACKDROP_STYLE_TRANSITION;
        styles.transition = BACKDROP_STYLE_TRANSITION;
        styles.webkitTransitionDuration = this.backdropTransitionDuration;
        styles.transitionDuration = this.backdropTransitionDuration;
        styles.position = BACKDROP_STYLE_POSITION;
        styles.top = BACKDROP_STYLE_POSITION_VALUE;
        styles.right = BACKDROP_STYLE_POSITION_VALUE;
        styles.bottom = BACKDROP_STYLE_POSITION_VALUE;
        styles.left = BACKDROP_STYLE_POSITION_VALUE;
        styles.zIndex = String(this.windowZIndex);
        styles.background = BACKDROP_STYLE_BACKGROUND;
        styles.opacity = BACKDROP_STYLE_OPACITY;
    }

    public setBackdropZIndex() {
        if (this.backdropElement) {
            this.backdropElement.style.zIndex = String(this.windowZIndex);
        }
    }
}

const MMWindowPlugin: PluginObject<any> = {
    install(v, options) {
        let mWindow = new MWindow();
        (v as any).$mWindow = mWindow;
        (v.prototype as any).$mWindow = mWindow;
    }
};

export default MMWindowPlugin;
