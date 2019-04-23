import { Component, Prop } from 'vue-property-decorator';
import { ModulVue } from '../../utils/vue/vue';
import WithRender from './repeater.html';

interface MRepeaterItem { }

interface MRepeaterOperations {
    canAdd: boolean;
    canDelete: boolean;
}

@WithRender
@Component
export class MRepeater extends ModulVue {
    @Prop({
        required: true
    })
    list: MRepeaterItem[];

    @Prop()
    addButtonLabel?: string;

    @Prop()
    deleteButtonLabel?: string;

    @Prop()
    emptyMessage?: string;

    @Prop({
        default: 'ul'
    })
    tag: string;

    @Prop()
    itemKey?: string;

    @Prop({
        default: (): MRepeaterOperations => ({
            canAdd: true,
            canDelete: true
        })
    })
    operations: MRepeaterOperations;

    mounted(): void {
        if (!this.$scopedSlots.row && !this.$scopedSlots.item) {
            throw new Error('MRepeater requires content to be provided through row or item slot.');
        }
    }

    onAddBtnClick(): void {
        this.$emit('add');
    }

    onDeleteBtnClick(index: number): void {
        this.$emit('delete', index);
    }

    getRowKey(item: MRepeaterItem, index: number): unknown | number {
        return this.itemKey ? item[this.itemKey] : index;
    }

    get addBtnLabel(): string {
        return this.addButtonLabel || this.$i18n.translate('m-repeater:add');
    }

    get deleteBtnLabel(): string {
        return this.deleteButtonLabel || this.$i18n.translate('m-repeater:delete');
    }
}

