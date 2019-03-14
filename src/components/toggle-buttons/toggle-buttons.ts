import Vue, { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Emit, Model, Prop } from 'vue-property-decorator';
import ButtonPlugin, { MButtonSkin } from '../button/button';
import { TOGGLE_BUTTONS_NAME } from '../component-names';
import WithRender from './toggle-buttons.html?style=./toggle-buttons.scss';

export interface MToggleButton {
    id: string;
    title: string;
    pressed?: boolean;
}

@WithRender
@Component
export class MToggleButtons extends Vue {
    @Model('change')
    @Prop({ default: () => [] })
    buttons: MToggleButton[];

    @Prop({ default: true })
    multiple: boolean;

    @Prop({ default: false })
    disabled: boolean;

    public toggle(button: MToggleButton): void {
        this.$emit('change', this.buttons.map(b => b.id !== button.id ?
            this.multiple ? b : { ...b, pressed: false } :
            { ...b, pressed: !b.pressed }
        ));

        this.onClick({ ...button, pressed: !button.pressed });
    }

    @Emit('click')
    private onClick(button: MToggleButton): void { }

    public getSkin(button: MToggleButton): string {
        return !button.pressed ? MButtonSkin.Secondary : MButtonSkin.Primary;
    }
}

const ToggleButtonsPlugin: PluginObject<any> = {
    install(v, options): void {
        v.prototype.$log.debug(TOGGLE_BUTTONS_NAME, 'plugin.install');
        v.use(ButtonPlugin);
        v.component(TOGGLE_BUTTONS_NAME, MToggleButtons);
    }
};

export default ToggleButtonsPlugin;
