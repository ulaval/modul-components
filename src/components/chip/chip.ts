import Vue, { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Emit, Prop } from 'vue-property-decorator';
import { CHIP_NAME } from '../component-names';
import IconButtonPlugin from '../icon-button/icon-button';
import WithRender from './chip.html';

export enum MChipMode {
    Add = 'add',
    Delete = 'delete'
}

@WithRender
@Component
export class MChip extends Vue {
    @Prop()
    disabled: boolean;

    @Prop({
        default: MChipMode.Add,
        validator: value =>
            value === MChipMode.Add ||
            value === MChipMode.Delete
    })
    mode: MChipMode;

    @Emit('click')
    public onClick(): void { }

    @Emit('add')
    public onAdd(): void { }

    @Emit('delete')
    public onDelete(): void { }

    public get isModeAdd(): boolean {
        return this.mode === MChipMode.Add;
    }
}

const MChipPlugin: PluginObject<any> = {
    install(v, options): void {
        v.prototype.$log.debug(CHIP_NAME, 'plugin.install');
        v.use(IconButtonPlugin);
        v.component(CHIP_NAME, MChip);
    }
};

export default MChipPlugin;
