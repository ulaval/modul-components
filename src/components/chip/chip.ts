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
    public emitClick(): void { }

    @Emit('add')
    public emitAdd(): void { }

    @Emit('delete')
    public emitDelete(): void { }

    public get isModeAdd(): boolean {
        return this.mode === MChipMode.Add;
    }

    public get isModeDelete(): boolean {
        return this.mode === MChipMode.Delete;
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
