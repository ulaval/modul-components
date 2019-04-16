import Vue, { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Emit, Prop } from 'vue-property-decorator';
import { CHIP_NAME } from '../component-names';
import IconButtonPlugin from '../icon-button/icon-button';
import WithRender from './chip.html?style=./chip.scss';

@WithRender
@Component
export class MChip extends Vue {
    @Prop()
    public disposable: boolean = false;

    @Emit('closed')
    public close(): void { }
}

const MChipPlugin: PluginObject<any> = {
    install(v, options): void {
        v.prototype.$log.debug(CHIP_NAME, 'plugin.install');
        v.use(IconButtonPlugin);
        v.component(CHIP_NAME, MChip);
    }
};

export default MChipPlugin;
