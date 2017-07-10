import { PluginObject } from 'vue';
import uuid from '../../utils/uuid/uuid';

const BACKDROP_ID: string = 'mBackdropID';
const BACKDROP_CLASS_NAME: string = 'm-backdrop';
const BACKDROP_STYLE_TRANSITION: string = 'opacity 0.3s ease';
const BACKDROP_STYLE_POSITION: string = 'fixed';
const BACKDROP_STYLE_POSITION_VALUE: string = '0';
const BACKDROP_STYLE_BACKGROUND: string = '#000';
const BACKDROP_STYLE_OPACITY_VISIBLE: string = '0.7';
const BACKDROP_STYLE_OPACITY: string = '0';
const Z_INDEZ_DEFAULT: number = 100;

export class MWindow {
    public bodyElement: HTMLElement = document.body;
    public bodyStyle: any = this.bodyElement.style;
    public scrollPosition: number = 0;

    public windowCount: number = 0;
    public arrWindow: any = new Array();

    public backdropElement: HTMLElement;
    public backdropId: string = '';
    public windowZIndex: number = Z_INDEZ_DEFAULT;

    public addWindow(windowId): void {
        this.windowCount++;
        this.windowZIndex++;
        if (this.windowCount == 1) {
            this.stopScollBody();
        }
        this.arrWindow.push({
            id: windowId,
            windowPosition: this.windowCount - 1,
            zIndex: this.windowZIndex
        });
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
        let windowPosition: number = Number(this.getArrWindowData(windowId)['windowPosition']);
        this.arrWindow.splice(windowPosition, 1);
        this.setBackdropZIndex();
    }

    public createBackdrop(targetElement: HTMLElement = this.bodyElement): void {
        if (this.backdropId == '') {
            this.backdropElement = document.createElement('div');
            this.backdropId = BACKDROP_ID + '-' + uuid.generate();
            this.backdropElement.setAttribute('id', this.backdropId);
            this.backdropElement.setAttribute('class', BACKDROP_CLASS_NAME);
            this.backdropElement.setAttribute('aria-hidden', 'true');
            this.setBackdropStyle();
            targetElement.appendChild(this.backdropElement);
            this.backdropElement = document.querySelector('#' + this.backdropId) as HTMLElement;
            setTimeout(() => {
                this.backdropElement.style.opacity = BACKDROP_STYLE_OPACITY_VISIBLE;
            }, 2);
        }
    }

    public removeBackdrop() {
        this.backdropId = '';
        this.backdropElement.remove();
    }

    public activeScollBody(): void {
        this.bodyStyle.removeProperty('position');
        this.bodyStyle.removeProperty('top');
        this.bodyStyle.removeProperty('right');
        this.bodyStyle.removeProperty('left');
        this.bodyStyle.removeProperty('overflow');
        window.scrollBy(0, this.scrollPosition);
        if (this.bodyStyle.length == 0) {
            this.bodyElement.removeAttribute('style');
        }
    }

    public stopScollBody(): void {
        this.setScrollPosition();
        this.bodyStyle.position = 'fixed';
        this.bodyStyle.top = '-' + this.scrollPosition + 'px';
        this.bodyStyle.right = '0';
        this.bodyStyle.left = '0';
        this.bodyStyle.overflow = 'hidden';
    }

    public getArrWindowData(windowId): any {
        for (let i = 0; i < this.arrWindow.length; i++) {
            if (this.arrWindow[i].id == windowId) {
                return this.arrWindow[i];
            }
        }
    }

    public setScrollPosition() {
        this.scrollPosition = this.bodyElement.scrollTop;
    }

    public setBackdropStyle(): void {
        let styles: any = this.backdropElement.style;
        styles.webkitTransition = BACKDROP_STYLE_TRANSITION;
        styles.transition = BACKDROP_STYLE_TRANSITION;
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
