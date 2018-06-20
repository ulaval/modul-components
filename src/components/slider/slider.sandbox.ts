import Vue, { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';

import { SLIDER_NAME } from '../component-names';
import WithRender from './slider.sandbox.html';

@WithRender
@Component
export class MSliderSandbox extends Vue {
}

const SliderSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.component(`${SLIDER_NAME}-sandbox`, MSliderSandbox);
    }
};

export default SliderSandboxPlugin;
