import Vue, { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Emit, Prop } from 'vue-property-decorator';
import { CHIP_DELETE_NAME } from '../../component-names';
import WithRender from './chip-delete.html?style=./chip-delete.scss';

@WithRender
@Component
export class MChipDelete extends Vue {
    @Prop()
    disabled: boolean;

    @Emit('click')
    public clickEvent(): void { }

    @Emit('delete')
    public deleteEvent(): void { }

    public onClick(event: Event): void {
        if (this.disabled) {
            return;
        }
        this.clickEvent();
        this.deleteEvent();
    }
}

const MChipDeletePlugin: PluginObject<any> = {
    install(v, options): void {
        v.prototype.$log.debug(CHIP_DELETE_NAME, 'plugin.install');
        v.component(CHIP_DELETE_NAME, MChipDelete);
    }
};

export default MChipDeletePlugin;
