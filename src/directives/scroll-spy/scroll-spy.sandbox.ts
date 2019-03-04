/* tslint:disable:no-console */
import { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';
import { ModulVue } from '../../utils/vue/vue';
import { SCROLL_SPY_NAME } from '../directive-names';
import WithRender from './scroll-spy.sandbox.html?style=./scroll-spy.scss';

@WithRender
@Component
export class MScrollSpySandbox extends ModulVue {

    mounted(): void {
        const elements: NodeListOf<HTMLElement> = document.querySelectorAll('.watch');
        const observer: IntersectionObserver = new IntersectionObserver(this.handleIntersect);
        elements.forEach(element => {
            observer.observe(element);
        });
    }

    handleIntersect(entries: IntersectionObserverEntry[], observer: IntersectionObserverInit): void {
        entries.forEach(entry => {
            console.log(entry);
            if (entry.isIntersecting) {
                console.log(entry.target.id);
            } else {

            }
        });
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
