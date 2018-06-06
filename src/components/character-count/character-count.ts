import Vue, { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

import AccordionTransitionPlugin from '../accordion/accordion-transition';
import { CHARACTER_COUNT_NAME } from '../component-names';
import WithRender from './character-count.html?style=./character-count.scss';

@WithRender
@Component
export class MCharacterCount extends Vue {

    @Prop()
    public valueLength: number;
    @Prop({ required: true, validator: value => {
        if (value === undefined) {
            console.error('character-count component expects prop maxLength to be defined.');
        }

        return value !== undefined;
    }})
    public maxLength: number;
    @Prop({ default: 0 })
    public threshold: number;
    @Prop({ default: true })
    public transition: boolean;

    private get hasCounter(): boolean {
        return this.maxLength > 0 && this.valueLength >= Math.max(0, Math.min(this.threshold, this.maxLength));
    }
}

const CharacterCountPlugin: PluginObject<any> = {
    install(v, options): void {
        v.prototype.$log.debug(CHARACTER_COUNT_NAME, 'plugin.install');
        v.use(AccordionTransitionPlugin);
        v.component(CHARACTER_COUNT_NAME, MCharacterCount);
    }
};

export default CharacterCountPlugin;
