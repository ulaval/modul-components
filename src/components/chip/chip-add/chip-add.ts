import Vue, { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Emit, Prop } from 'vue-property-decorator';
import { CHIP_ADD_NAME } from '../../component-names';
import WithRender from './chip-add.html?style=./chip-add.scss';

@WithRender
@Component
export class MChipAdd extends Vue {
    @Prop()
    disabled: boolean;

    @Prop({ default: true })
    icon: boolean;

    @Emit('click')
    public clickEvent(): void { }

    @Emit('add')
    public addEvent(): void { }

    public onClick(event: Event): void {
        if (this.disabled) {
            return;
        }
        this.clickEvent();
        this.addEvent();
        (this.$el as HTMLElement).blur();
    }
}

const MChipAddPlugin: PluginObject<any> = {
    install(v, options): void {
        v.prototype.$log.debug(CHIP_ADD_NAME, 'plugin.install');
        v.component(CHIP_ADD_NAME, MChipAdd);
    }
};

export default MChipAddPlugin;
