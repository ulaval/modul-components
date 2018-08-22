import { PluginObject } from 'vue';

import { OPTION_ITEM_DELETE_NAME } from '../component-names';
import OptionItemIconPlugin from '../icon/icon';
import { MOptionItemPredefined } from './option-item-predefined';

export class MOptionItemDelete extends MOptionItemPredefined {
    protected get iconName(): string {
        return 'm-svg__delete';
    }

    protected get label(): string {
        return this.$i18n.translate('m-option:delete');
    }
}

const OptionItemDeletePlugin: PluginObject<any> = {
    install(v, options): void {
        v.use(OptionItemIconPlugin);
        v.component(OPTION_ITEM_DELETE_NAME, MOptionItemDelete);
    }
};

export default OptionItemDeletePlugin;
