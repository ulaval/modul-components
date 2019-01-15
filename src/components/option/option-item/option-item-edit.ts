import { MOptionItemPredefined } from './option-item-predefined';


export class MOptionItemEdit extends MOptionItemPredefined {
    protected get iconName(): string {
        return 'm-svg__edit';
    }

    protected get label(): string {
        return this.$i18n.translate('m-option:edit');
    }
}

