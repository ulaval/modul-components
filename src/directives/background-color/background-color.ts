import Vue from 'vue';
import { PluginObject } from 'vue';
import { BACKGROUND_COLOR_NAME } from '../directives-names';

export class MBackgroundColor extends Vue {
    public bind(element: HTMLElement) {
        element.onclick = (ev: MouseEvent) => {
            (ev.target as HTMLElement).style.backgroundColor = 'lime';
        };
    }
}

const BackgroundColorPlugin: PluginObject<any> = {
    install(v, options) {
        v.directive(BACKGROUND_COLOR_NAME, new MBackgroundColor());
    }
};

export default BackgroundColorPlugin;
