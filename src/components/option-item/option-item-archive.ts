import { PluginObject } from 'vue';

import { OPTION_ITEM_ARCHIVE_NAME } from '../component-names';
import OptionItemIconPlugin from '../icon/icon';
import { MOptionItemPredefined } from './option-item-predefined';

export class MOptionItemArchive extends MOptionItemPredefined {
    protected get iconName(): string {
        return 'm-svg__archive';
    }

    protected get label(): string {
        return this.$i18n.translate('m-option:archive');
    }
}

const OptionItemArchivePlugin: PluginObject<any> = {
    install(v, options): void {
        v.use(OptionItemIconPlugin);
        v.component(OPTION_ITEM_ARCHIVE_NAME, MOptionItemArchive);
    }
};

export default OptionItemArchivePlugin;
