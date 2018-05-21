import Vue, { PluginObject } from 'vue';
import Component from 'vue-class-component';
import WithRender from './{{file}}.html';
import { Prop } from 'vue-property-decorator';
import { {{constant}} } from '../component-names';

@WithRender
@Component
export class {{class}} extends Vue {
    @Prop()
    public prop1: any;
}

const {{plugin}}Plugin: PluginObject<any> = {
    install(v, options): void {
        v.prototype.$log.debug({{constant}}, 'plugin.install');
        v.component({{constant}}, {{class}});
    }
};

export default {{plugin}}Plugin;
