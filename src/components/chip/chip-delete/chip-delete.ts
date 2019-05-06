import Vue, { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Emit, Prop } from 'vue-property-decorator';
import uuid from '../../../utils/uuid/uuid';
import { CHIP_DELETE_NAME } from '../../component-names';
import WithRender from './chip-delete.html?style=./chip-delete.scss';

@WithRender
@Component
export class MChipDelete extends Vue {
    @Prop()
    disabled: boolean;

    @Emit('click')
    public emitClick(): void { }

    @Emit('delete')
    public emitDelete(): void { }

    public textId: string = `mChipDeleteText-${uuid.generate()}`;

    public onClick(event: Event): void {
        if (this.disabled) {
            return;
        }
        this.emitClick();
        this.emitDelete();
    }
}

const MChipDeletePlugin: PluginObject<any> = {
    install(v, options): void {
        v.prototype.$log.debug(CHIP_DELETE_NAME, 'plugin.install');
        v.component(CHIP_DELETE_NAME, MChipDelete);
    }
};

export default MChipDeletePlugin;
