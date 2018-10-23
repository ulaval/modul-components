import { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';

import { ScrollToEasing, ScrollToSpeed } from '../../utils/scroll-to/scroll-to';
import { ModulVue } from '../../utils/vue/vue';
import { SCROLL_TO_NAME } from '../directive-names';
import WithRender from './scroll-to.sandbox.html';

@WithRender
@Component
export class MScrollToSandbox extends ModulVue {

    public offset: string = '-58';
    public speed: ScrollToSpeed = ScrollToSpeed.Regular;
    public easing: ScrollToEasing = ScrollToEasing.Linear;

    scrollToGreenUsingService(): void {
        let _element: Element = this.$refs.green as Element;

        this.$scrollTo.goTo(_element, +this.offset, this.speed, this.easing).then((finalPosition) => {
            alert(`callback at ${finalPosition}`);
        });
    }

    scrollToBottom(): void {
        this.$scrollTo.goToBottom(this.speed, this.easing);
    }

    scrollToTop(): void {
        this.$scrollTo.goToTop(this.speed, this.easing);
    }

    getGlobalParameters(): any {

        return {
            speed: this.speed,
            easing: this.easing,
            offset: +this.offset
        };
    }

    scrollInOrangeUsingService(): void {
        // let _element: Element = this.$refs.orange as Element;
        this.$scrollTo.goToBottom(ScrollToSpeed.Slow, ScrollToEasing.EaseOutCubic);
    }
}

const ScrollToSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.component(`${SCROLL_TO_NAME}-sandbox`, MScrollToSandbox);
    }
};

export default ScrollToSandboxPlugin;
