import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

import uuid from '../../utils/uuid/uuid';
import { ModulVue } from '../../utils/vue/vue';
import { OPTION_NAME } from '../component-names';
import I18nPlugin from '../i18n/i18n';
import IconButtonPlugin from '../icon-button/icon-button';
import MOptionItemPlugin from '../option-item/option-item';
import { MPopperPlacement } from '../popper/popper';
import PopupPlugin from '../popup/popup';
import WithRender from './option.html?style=./option.scss';

export abstract class BaseOption extends ModulVue {
}

export interface MOptionInterface {
    hasIcon: boolean;
    checkIcon(el: boolean): void;
    close(): void;
}

export enum MOptionsSkin {
    Light = 'light',
    Dark = 'dark'
}

@WithRender
@Component
export class MOption extends BaseOption implements MOptionInterface {
    @Prop({
        default: MPopperPlacement.Bottom,
        validator: value =>
            value === MPopperPlacement.Bottom ||
            value === MPopperPlacement.BottomEnd ||
            value === MPopperPlacement.BottomStart ||
            value === MPopperPlacement.Left ||
            value === MPopperPlacement.LeftEnd ||
            value === MPopperPlacement.LeftStart ||
            value === MPopperPlacement.Right ||
            value === MPopperPlacement.RightEnd ||
            value === MPopperPlacement.RightStart ||
            value === MPopperPlacement.Top ||
            value === MPopperPlacement.TopEnd ||
            value === MPopperPlacement.TopStart
    })
    public placement: MPopperPlacement;
    @Prop({
        default: MOptionsSkin.Light,
        validator: value =>
            value === MOptionsSkin.Light ||
            value === MOptionsSkin.Dark
    })
    public skin: MOptionsSkin;
    @Prop()
    public openTitle: string;
    @Prop()
    public closeTitle: string;
    @Prop()
    public disabled: boolean;
    @Prop({ default: '44px' })
    public size: string;
    @Prop({ default: true })
    public focusManagement: boolean;

    public hasIcon: boolean = false;
    private open = false;
    private id: string = `mOption-${uuid.generate()}`;

    public checkIcon(icon: boolean): void {
        if (icon) {
            this.hasIcon = true;
        }
    }

    public close(): void {
        this.open = false;
        this.onClose();
    }

    private onOpen(): void {
        this.$emit('open');
    }

    private onClose(): void {
        this.$emit('close');
    }

    private onClick($event: MouseEvent): void {
        this.$emit('click', $event);
    }

    private getOpenTitle(): string {
        return this.openTitle === undefined ? this.$i18n.translate('m-option:open') : this.openTitle;
    }

    private getCloseTitle(): string {
        return this.closeTitle === undefined ? this.$i18n.translate('m-option:close') : this.closeTitle;
    }

    private get propTitle(): string {
        return this.open ? this.getCloseTitle() : this.getOpenTitle();
    }

    private get ariaControls(): string {
        return this.id + '-controls';
    }
}

const OptionPlugin: PluginObject<any> = {
    install(v, options): void {
        v.use(PopupPlugin);
        v.use(I18nPlugin);
        v.use(MOptionItemPlugin);
        v.use(IconButtonPlugin);
        v.component(OPTION_NAME, MOption);
    }
};

export default OptionPlugin;
