import { MOptionItemPredefined } from './option-item-predefined';


export class MOptionItemDelete extends MOptionItemPredefined {
    protected get iconName(): string {
        return 'm-svg__delete';
    }

    protected get label(): string {
        return this.$i18n.translate('m-option:delete');
    }
}

