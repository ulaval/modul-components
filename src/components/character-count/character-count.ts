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
    @Prop()
    public maxLength?: number;
    @Prop({ default: 0 })
    public threshold: number;
    @Prop({ default: true })
    public transition: boolean;

    private get hasCounter(): boolean {
        // tslint:disable-next-line:no-console
        console.log(this.isThresholdValid);
        return this.maxLength && this.maxLength > 0 ? this.isThresholdValid : false;
    }

    private get isThresholdValid(): boolean {
        let counterPourcentage: number = this.maxLength ? (this.valueLength / this.maxLength) * 100 : 100;
        // tslint:disable-next-line:no-console
        console.log(counterPourcentage);

        return counterPourcentage >= this.threshold ? true : false;
    }
}

const CharacterCountPlugin: PluginObject<any> = {
    install(v, options): void {
        v.prototype.$log.debug(CHARACTER_COUNT_NAME, 'plugin.install');
        v.component(CHARACTER_COUNT_NAME, MCharacterCount);
    }
};

export default CharacterCountPlugin;
