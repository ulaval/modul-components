/* tslint:disable:no-console */
import { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';
import { ModulVue } from '../../utils/vue/vue';
import { SCROLL_SPY_NAME } from '../directive-names';
import WithRender from './scroll-spy.sandbox.html?style=./scroll-spy.scss';

const options: IntersectionObserverInit = {
    root: document.querySelector('.observeElement'),
    rootMargin: '0px',
    threshold: 1.0
};

@WithRender
@Component
export class MScrollSpySandbox extends ModulVue {

    mounted(): void {
        const observer: any = new IntersectionObserver(this.handleIntersect, options);
        observer.observe(this.$el);
    }

    handleIntersect(entries: IntersectionObserverEntry[], observer: IntersectionObserverInit): void {
        console.log(entries);
        entries.forEach(entry => {
            console.log(observer);
            console.log(entry);
            if (entry.isIntersecting) {
                console.log('DEDANS');
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
