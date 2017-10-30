import { ModulVue } from '../../utils/vue/vue';
import { PluginObject } from 'vue';
import { Prop } from 'vue-property-decorator';
import Component from 'vue-class-component';
import { MODAL_NAME } from '../component-names';
import WithRender from './modal-window.html?style=../../mixins/base-window/base-window.scss';
import { Portal, PortalMixinImpl } from '../../mixins/portal/portal';

@WithRender
@Component({
    mixins: [Portal]
})
export class MModal extends ModulVue implements PortalMixinImpl {
    @Prop()
    public message: string;

    public handlesFocus(): boolean {
        return true;
    }

    public doCustomPropOpen(value: boolean): boolean {
        return false;
    }

    public hasBackdrop(): boolean {
        return true;
    }

    public getPortalElement(): HTMLElement {
        return this.$refs.article as HTMLElement;
    }

    private onOk(): void {
        this.$emit('ok');
    }

    private onCancel(): void {
        this.$emit('cancel');
    }

    private get hasDefaultSlot(): boolean {
        // todo: header or title?
        return !!this.$slots.default;
    }

    private get hasFooterSlot(): boolean {
        return !!this.$slots.footer;
    }

    private hasMessage(): boolean {
        return !!this.message;
    }
}

const ModalPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(MODAL_NAME, MModal);
    }
};

export default ModalPlugin;
