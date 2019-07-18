import { MOptionItemPredefined } from './option-item-predefined';


export class MOptionItemArchive extends MOptionItemPredefined {
    protected get iconName(): string {
        return 'm-svg__folder-open';
    }

    protected get label(): string {
        return this.$i18n.translate('m-option:archive');
    }
}
