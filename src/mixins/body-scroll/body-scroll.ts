import Vue from 'vue';
import Component from 'vue-class-component';

const DATA_WINDOW_COUNT: string = 'data-m-window-count';

export interface BodyScrollMixin {
    activeScollBody: Function;
    stopScollBody: Function;
    addWindow: Function;
    setDataWindowCount: Function;
    getDataWindowCount: Function;
    removeDataWindowCount: Function;
}

@Component
export class BodyScroll extends Vue implements BodyScrollMixin {
    public elementBody: HTMLElement = document.body;
    public scollPosition: number = 0;

    public activeScollBody(): void {
        this.elementBody.style.removeProperty('position');
        this.elementBody.style.removeProperty('top');
        this.elementBody.style.removeProperty('right');
        this.elementBody.style.removeProperty('left');
        this.elementBody.style.removeProperty('overflow');
        window.scrollBy(0, this.scollPosition);
    }

    public stopScollBody(): void {
        this.scollPosition = this.elementBody.scrollTop;
        this.elementBody.style.position = 'fixed';
        this.elementBody.style.top = '-' + this.scollPosition + 'px';
        this.elementBody.style.right = '0';
        this.elementBody.style.left = '0';
        this.elementBody.style.overflow = 'hidden';
    }

    public addWindow(value: number): void {
        this.setDataWindowCount(String(this.getDataWindowCount() + 1));
    }

    public setDataWindowCount(value: string): void {
        this.elementBody.setAttribute(DATA_WINDOW_COUNT, value);
    }

    public getDataWindowCount(): number {
        return Number(this.elementBody.getAttribute(DATA_WINDOW_COUNT));
    }

    public removeDataWindowCount(): void {
        this.elementBody.removeAttribute(DATA_WINDOW_COUNT);
    }
}
