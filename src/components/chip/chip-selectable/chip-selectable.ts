import Vue, { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Emit, Prop } from 'vue-property-decorator';
import { CHIP_SELECTABLE_NAME } from '../../component-names';
import WithRender from './chip-selectable.html?style=./chip-selectable.scss';

@WithRender
@Component
export class MChipSelectable extends Vue {
    @Prop()
    disabled: boolean;

    @Prop()
    selected: boolean;

    @Emit('click')
    public emitClick(): void { }

    public onClick(event: Event): void {
        if (this.disabled) {
            return;
        }
        this.emitClick();
        (this.$el as HTMLElement).blur();
    }

    get hiddenText(): string {
        return this.$i18n.translate(this.selected ? 'chip:deselect' : 'chip:select');
    }
}

const MChipSelectablePlugin: PluginObject<any> = {
    install(v, options): void {
        v.prototype.$log.debug(CHIP_SELECTABLE_NAME, 'plugin.install');
        v.component(CHIP_SELECTABLE_NAME, MChipSelectable);
    }
};

export default MChipSelectablePlugin;
