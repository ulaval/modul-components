import { DirectiveOptions, PluginObject } from 'vue';
import { SCROLL_SPY_NAME } from '../directive-names';


const MScrollSpy: DirectiveOptions = {


};

const ScrollSpyPlugin: PluginObject<any> = {
    install(v, options): void {
        v.use(ScrollSpyPlugin);
        v.directive(SCROLL_SPY_NAME, MScrollSpy);
    }
};

export default ScrollSpyPlugin;
