import Vue from 'vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import WithRender from './limit-text.html?style=./limit-text.scss';
import { LIMIT_TEXT_NAME } from '../component-names';

export const MODE_LOADING: string = 'loading';
export const MODE_PROCESSING: string = 'processing';

@WithRender
@Component
export class MLimitText extends Vue {
    @Prop({ default: MODE_PROCESSING })
    public mode: string;

    public componentName = LIMIT_TEXT_NAME;

}

const LimitTextPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(LIMIT_TEXT_NAME, MLimitText);
    }
};

export default LimitTextPlugin;
