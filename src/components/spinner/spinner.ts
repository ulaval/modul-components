import Vue from 'vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import WithRender from './spinner.html?style=./spinner.scss';
import { SPINNER_NAME } from '../component-names';

export const MODE_LOADING: string = 'loading';
export const MODE_PROCESSING: string = 'processing';

@WithRender
@Component
export class MSpinner extends Vue {
    @Prop({ default: MODE_PROCESSING })
    public mode: string;

    public componentName = SPINNER_NAME;

}

const SpinnerPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(SPINNER_NAME, MSpinner);
    }
};

export default SpinnerPlugin;
