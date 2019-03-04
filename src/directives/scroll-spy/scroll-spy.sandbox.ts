/* tslint:disable:no-console */
import { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';
import { ModulVue } from '../../utils/vue/vue';
import { SCROLL_SPY_NAME } from '../directive-names';
import WithRender from './scroll-spy.sandbox.html?style=./scroll-spy.scss';

const map: Map<string, boolean> = new Map<string, boolean>();
@WithRender
@Component
export class MScrollSpySandbox extends ModulVue {

    currentID: string = '';

    mounted(): void {
        const elements: NodeListOf<HTMLElement> = document.querySelectorAll('.watch');
        const observer: IntersectionObserver = new IntersectionObserver(this.handleIntersect);
        elements.forEach(element => {
            observer.observe(element);
            map.set(element.id, false);
        });
    }

    handleIntersect(entries: IntersectionObserverEntry[]): void {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                map.set(entry.target.id, entry.isIntersecting);
            } else {
                map.set(entry.target.id, entry.isIntersecting);
            }
        });
        this.searchFirstCurrent();
    }

    searchFirstCurrent(): void {
        let elementFound: Boolean = false;
        map.forEach((value: boolean, key: string) => {
            if (value && !elementFound) {
                this.currentID = key;
                elementFound = true;
            }
        });
    }

    isCurrent(id: string): boolean {
        return id === this.currentID;
    }

    scrolling(event: Event): void {
        let myId: any = (event.target as HTMLElement).getAttribute('href');
        let htmlElement: HTMLElement | null = this.$el.querySelector(myId);
        if (htmlElement) {
            this.$scrollTo.goTo(htmlElement, 0);
        }
    }
}

const ScrollSpySandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.component(`${SCROLL_SPY_NAME}-sandbox`, MScrollSpySandbox);
    }
};

export default ScrollSpySandboxPlugin;
