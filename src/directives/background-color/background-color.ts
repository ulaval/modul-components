import Vue, { DirectiveOptions } from 'vue';
import { PluginObject } from 'vue';
import { BACKGROUND_COLOR_NAME } from '../directive-names';

const MBackgroundColor: DirectiveOptions = {
    bind(element: HTMLElement) {
        element.onclick = (ev: MouseEvent) => {
            (ev.target as HTMLElement).style.backgroundColor = 'lime';
        };
    }
};

const BackgroundColorPlugin: PluginObject<any> = {
    install(v, options) {
        v.directive(BACKGROUND_COLOR_NAME, MBackgroundColor);
    }
};

export default BackgroundColorPlugin;
