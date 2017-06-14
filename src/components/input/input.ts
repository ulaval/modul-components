import Vue from 'vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import WithRender from './input.html?style=./input.scss';
import { INPUT_NAME } from '../component-names';

@WithRender
@Component
export class MInput extends Vue {

    @Prop({ default: 'text' })
    public value: string;

    public componentName: string = INPUT_NAME;
}

const InputPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(INPUT_NAME, MInput);
    }
};

export default InputPlugin;
