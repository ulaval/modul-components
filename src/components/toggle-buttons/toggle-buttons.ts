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

export enum MToggleButtonSkin {
    SQUARED = 'default',
    ROUNDED = 'rounded'
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

    @Prop({
        default: MToggleButtonSkin.SQUARED,
        validator: value =>
            value === MToggleButtonSkin.SQUARED ||
            value === MToggleButtonSkin.ROUNDED
    })
    skin: MToggleButtonSkin;

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

    get skinButtons(): { [key: string]: boolean } {
        return {
            'm--is-default': this.skin === MToggleButtonSkin.SQUARED,
            'm--is-rounded': this.skin === MToggleButtonSkin.ROUNDED
        };
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
