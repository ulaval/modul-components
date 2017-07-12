import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

export interface DialogPropsMixin {
    id: string;
    open: boolean;
    closeOnBackdrop: boolean;
    title: string;
    className: string;
}

@Component
export class DialogProps extends Vue implements DialogPropsMixin {

    @Prop({ default: 'mDialog' })
    public id: string;
    @Prop({ default: false })
    public open: boolean;
    @Prop()
    public closeOnBackdrop: boolean;
    @Prop({ default: '' })
    public title: string;
    @Prop()
    public className: string;

    private get hasDefaultSlots(): boolean {
        return !!this.$slots.default;
    }
    private get hasHeaderSlot(): boolean {
        return !!this.$slots.header;
    }

    private get hasFooterSlot(): boolean {
        return !!this.$slots.footer;
    }

    private get hasContentSlot(): boolean {
        return !!this.$slots.content;
    }
}
