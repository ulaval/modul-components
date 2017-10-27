import { ModulVue } from '../../utils/vue/vue';
import { PluginObject } from 'vue';
import { Prop, Watch } from 'vue-property-decorator';
import Component from 'vue-class-component';
import { MODAL_NAME } from '../component-names';
import uuid from '../../utils/uuid/uuid';
import WithRender from './modal-window.html?style=../../mixins/base-window/base-window.scss';
import { OpenTrigger, OpenTriggerMixinImpl } from '../../mixins/open-trigger/open-trigger';
import { OpenTriggerHook, OpenTriggerHookMixin } from '../../mixins/open-trigger/open-trigger-hook';
import { MediaQueries, MediaQueriesMixin } from '../../mixins/media-queries/media-queries';

@WithRender
@Component({
    mixins: [OpenTrigger, OpenTriggerHook, MediaQueries]
})
export class MModal extends ModulVue implements OpenTriggerMixinImpl {
    @Prop()
    public open: boolean;

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
}

const ModalPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(MODAL_NAME, MModal);
    }
};

export default ModalPlugin;
