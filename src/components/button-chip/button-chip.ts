import Vue, { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import WithRender from './button-chip.html?style=./button-chip.scss';
import { BUTTON_CHIP_NAME, ICON_NAME } from '../component-names';
import IconPlugin from '../icon/icon';

@WithRender
@Component
export class MButtonChip extends Vue {

    @Prop({ default: false })
    public active: boolean;

    public get isActive() {
        return !!this.active;
    }

    protected onClick(event: Event): void {
        this.$emit('click', event);
    }

}

const ButtonChipPlugin: PluginObject<any> = {
    install(v, options) {
        console.debug(BUTTON_CHIP_NAME, 'plugin.install');
        v.use(IconPlugin);
        v.component(BUTTON_CHIP_NAME, MButtonChip);
    }
};

export default ButtonChipPlugin;
