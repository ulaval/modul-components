import Vue, { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

import { CHARACTER_COUNT_NAME } from '../component-names';
import WithRender from './character-count.html?style=./character-count.scss';

@WithRender
@Component
export class MCharacterCount extends Vue {

    @Prop()
    public valueLength: number;
    @Prop({ default: Infinity })
    public maxLength: number;
    @Prop({ default: 0 })
    public threshold: number;
    @Prop({ default: true })
    public transition: boolean;

    private get hasCounter(): boolean {
        return this.maxLength > 0 && this.isThresholdValid;
    }

    private get isThresholdValid(): boolean {
        let counterThreshold: number = this.threshold && this.maxLength ?
                                       this.threshold < 0 ? 0 : this.threshold > this.maxLength ?
                                       this.maxLength : this.threshold : 0;
        return this.valueLength >= counterThreshold;
    }
}

const CharacterCountPlugin: PluginObject<any> = {
    install(v, options): void {
        v.prototype.$log.debug(CHARACTER_COUNT_NAME, 'plugin.install');
        v.component(CHARACTER_COUNT_NAME, MCharacterCount);
    }
};

export default CharacterCountPlugin;
