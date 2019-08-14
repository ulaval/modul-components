import { MOptionItemPredefined } from './option-item-predefined';

export class MOptionItemAdd extends MOptionItemPredefined {
    protected get iconName(): string {
        return 'm-svg__add-circle';
    }

    protected get label(): string {
        return this.$i18n.translate('m-option:add');
    }
}
