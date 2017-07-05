import Vue from 'vue';
import Component from 'vue-class-component';
import uuid from '../../utils/uuid/uuid';

const DATA_BACKDROP_Z_INDEX: string = 'data-m-backdrop-z-index';
const DATA_BACKDROP_ID: string = 'data-m-backdrop-id';

export interface BackdropMixin {
    backdropZIndex: string;
    createBackdrop: Function;
    changeBackdropZIndex: Function;
    removeBackdrop: Function;
    setBackdropStyle: Function;
    getDataBackdropID: Function;
    setDataBackdropZIndex: Function;
    getDataBackdropZIndex: Function;
    getElementBackdrop: Function;
}

@Component
export class Backdrop extends Vue implements BackdropMixin {
    public elementBody: HTMLElement = document.body;
    public elementBackdrop: HTMLElement;
    public backdropZIndex: string = '100';
    public backdropId: string;

    public createBackdrop(targetElement: HTMLElement): void {
        this.elementBackdrop = document.createElement('div');
        this.backdropId = 'mBackdropId-' + uuid.generate();
        this.elementBackdrop.setAttribute('id', this.backdropId);
        this.elementBackdrop.setAttribute('class', 'm-dialog-backdrop');
        this.elementBackdrop.setAttribute('aria-hidden', 'true');
        this.elementBody.setAttribute(DATA_BACKDROP_ID, this.backdropId);
        this.setDataBackdropZIndex(this.backdropZIndex);
        this.setBackdropStyle();
        targetElement.appendChild(this.elementBackdrop);
        setTimeout(() => {
            this.getElementBackdrop().style.opacity = '0.7';
        }, 2);
    }

    public changeBackdropZIndex(value: number): void {
        let zIndex: number = this.getDataBackdropZIndex();
        this.setDataBackdropZIndex(String(zIndex + value));
        this.getElementBackdrop().style.zIndex = String(zIndex + value);
    }

    public removeBackdrop() {
        this.getElementBackdrop().remove();
        this.elementBody.removeAttribute(DATA_BACKDROP_Z_INDEX);
        this.elementBody.removeAttribute(DATA_BACKDROP_ID);
    }

    public setBackdropStyle(): void {
        this.elementBackdrop.style.position = 'fixed';
        this.elementBackdrop.style.zIndex = this.backdropZIndex;
        this.elementBackdrop.style.transition = 'opacity 0.3s ease';
        this.elementBackdrop.style.top = '0';
        this.elementBackdrop.style.right = '0';
        this.elementBackdrop.style.bottom = '0';
        this.elementBackdrop.style.left = '0';
        this.elementBackdrop.style.background = '#000';
        this.elementBackdrop.style.opacity = '0';
    }

    public getDataBackdropID(): string {
        return String(this.elementBody.getAttribute(DATA_BACKDROP_ID));
    }

    public setDataBackdropZIndex(value: string): void {
        this.elementBody.setAttribute(DATA_BACKDROP_Z_INDEX, value);
    }

    public getDataBackdropZIndex(): number {
        return Number(this.elementBody.getAttribute(DATA_BACKDROP_Z_INDEX));
    }

    public getElementBackdrop(): HTMLElement {
        return document.querySelector('#' + this.getDataBackdropID()) as HTMLElement;
    }
}
