import { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';
import { ScrollToDuration } from '../../utils/scroll-to/scroll-to';
import { ModulVue } from '../../utils/vue/vue';
import { SCROLL_TO_NAME } from '../directive-names';
import WithRender from './scroll-to.sandbox.html';


@WithRender
@Component
export class MScrollToSandbox extends ModulVue {

    public offset: string = '0';
    public speed: ScrollToDuration = ScrollToDuration.Regular;

    getGlobalParameters(): any {

        return {
            speed: this.speed,
            offset: +this.offset
        };
    }
}

const ScrollToSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.component(`${SCROLL_TO_NAME}-sandbox`, MScrollToSandbox);
    }
};

export default ScrollToSandboxPlugin;
