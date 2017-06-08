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
    public isModal: boolean;

    public onBackdropClick(event) {
        if (!this.$props.isModal) {
            this.onClose(event);
        }
    }

    public onClose(event) {
        this.$emit('onClose', event);
    }

    public created() {
        document.body.classList.toggle('m-overflow-hidden');
    }

    public destroyed() {
        document.body.classList.toggle('m-overflow-hidden');
    }
}

const DialogPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(DIALOG_NAME, MDialog);
    }
};

export default DialogPlugin;
