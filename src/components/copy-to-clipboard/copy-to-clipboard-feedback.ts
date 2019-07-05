import { VNode } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { ModulVue } from '../../utils/vue/vue';
import { MToastPosition, MToastTimeout } from '../toast/toast';

@Component
export class MCopyToClipboardFeedback extends ModulVue {
    @Prop()
    message: string;

    @Prop({
        default: MToastPosition.BottomRight
    })
    position: MToastPosition;

    @Prop({
        default: MToastTimeout.xshort
    })
    timeout: MToastTimeout;

    render(): VNode {
        if (this.$scopedSlots && this.$scopedSlots.default) {
            return this.$scopedSlots.default({
                showToast: () => this.showToast()
            }) as any;
        } else {
            throw new Error('copy-to-clipboard expects a default scoped slot.');
        }
    }

    showToast(): void {
        this.$toast.show({
            text: this.message ? this.message : this.$i18n.translate('m-copy-to-clipboard:copied'),
            position: this.position,
            timeout: this.timeout
        });
    }
}

