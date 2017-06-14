import Vue from 'vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import WithRender from './dialog.html?style=./dialog.scss';
import { DIALOG_NAME } from '../component-names';

@WithRender
@Component
export class MDialog extends Vue {
    @Prop({ default: true })
    private isModal: boolean;

    private componentName: string = DIALOG_NAME;

    private onBackdropClick(event): void {
        if (!this.$props.isModal) {
            this.onClose(event);
        }
    }

    private onClose(event): void {
        this.$emit('onClose', event);
    }

    private created(): void {
        document.body.classList.toggle('m-overflow-hidden');
    }

    private destroyed(): void {
        document.body.classList.toggle('m-overflow-hidden');
    }

    private get hasTitle(): boolean {
        return !!this.$slots['title'];
    }
}

const DialogPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(DIALOG_NAME, MDialog);
    }
};

export default DialogPlugin;
