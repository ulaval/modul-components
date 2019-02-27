import { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';
import { ModulVue } from '../vue/vue';
import ScrollToPlugin, { ScrollToDuration } from './scroll-to';
import WithRender from './scroll-to-service.sandbox.html';


@WithRender
@Component
export class MScrollToServivceSandbox extends ModulVue {

    public offset: string = '0';
    public speed: ScrollToDuration = ScrollToDuration.Regular;
    scrollToGreenUsingService(): void {
        let _element: HTMLElement = this.$refs.green as HTMLElement;

        this.$scrollTo.goTo(_element, +this.offset, this.speed);
    }

    scrollToBottom(): void {
        this.$scrollTo.goToBottom(this.speed);
    }

    scrollToTop(): void {
        this.$scrollTo.goToTop(this.speed);
    }

    scrollInOrangeUsingService(): boolean {
        let _container: HTMLElement = this.$refs.orange as HTMLElement;
        let _element: HTMLElement = this.$refs.greenInOrange as HTMLElement;
        // let _element: Element = this.$refs.orange as Element;
        this.$scrollTo.goToInside(_container, _element, 0, this.speed);
        return false;
    }

    scrollInToTopOrangeUsingService(): void {
        let _container: HTMLElement = this.$refs.orange as HTMLElement;
        this.$scrollTo.goToTopInside(_container, this.speed);
    }

    scrollInToBottomOrangeUsingService(): void {
        let _container: HTMLElement = this.$refs.orange as HTMLElement;
        this.$scrollTo.goToBottomInside(_container, this.speed);
    }

    scrollInToDown200InOrangeUsingService(): void {
        let _container: HTMLElement = this.$refs.orange as HTMLElement;
        this.$scrollTo.goToInside(_container, 200, 0, this.speed);
    }

    scrollToTextArea(): void {
        // Aller au haut de la page
        let conteneur: HTMLElement | null = document.querySelector('.m-overlay__body');
        let element: HTMLElement | null = document.querySelector('.scroll-to-me-on-save');
        if (conteneur && element) {
            this.$scrollTo.goToInside(conteneur, element, +this.offset, this.speed);
        }

    }
}

const ScrollToSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.use(ScrollToPlugin);
        v.component('m-scroll-to-service-sandbox', MScrollToServivceSandbox);
    }
};

export default ScrollToSandboxPlugin;
