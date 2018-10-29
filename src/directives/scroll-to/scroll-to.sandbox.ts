import { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';

import { ScrollToDuration } from '../../utils/scroll-to/scroll-to';
import { ModulVue } from '../../utils/vue/vue';
import { SCROLL_TO_NAME } from '../directive-names';
import WithRender from './scroll-to.sandbox.html';

@WithRender
@Component
export class MScrollToSandbox extends ModulVue {

    public offset: string = '-58';
    public speed: ScrollToDuration = ScrollToDuration.Regular;

    scrollToGreenUsingService(): void {
        let _element: HTMLElement = this.$refs.green as HTMLElement;

        this.$scrollTo.goTo(_element, +this.offset, this.speed).then((finalPosition) => {
            alert(`callback at ${finalPosition}`);
        });
    }

    scrollToBottom(): void {
        this.$scrollTo.goToBottom(this.speed);
    }

    scrollToTop(): void {
        this.$scrollTo.goToTop(this.speed);
    }

    getGlobalParameters(): any {

        return {
            speed: this.speed,
            offset: +this.offset
        };
    }

    scrollInOrangeUsingService(): boolean {
        let _container: HTMLElement = this.$refs.orange as HTMLElement;
        let _element: HTMLElement = this.$refs.greenInOrange as HTMLElement;
        // let _element: Element = this.$refs.orange as Element;
        this.$scrollTo.goToInside(_container, _element,0, this.speed);
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
        this.$scrollTo.goToInside(_container, 200 ,0, this.speed);
    }
}

const ScrollToSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.component(`${SCROLL_TO_NAME}-sandbox`, MScrollToSandbox);
    }
};

export default ScrollToSandboxPlugin;
