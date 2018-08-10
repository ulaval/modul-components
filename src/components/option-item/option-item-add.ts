import { PluginObject } from 'vue';

import { OPTION_ITEM_ADD_NAME } from '../component-names';
import OptionItemIconPlugin from '../icon/icon';
import { MOptionItemPredefined } from './option-item-predefined';

export class MOptionItemAdd extends MOptionItemPredefined {
    protected get iconName(): string {
        return 'm-svg__add';
    }

    protected get label(): string {
        return this.$i18n.translate('m-option:add');
    }
}

const OptionItemAddPlugin: PluginObject<any> = {
    install(v, options): void {
        v.use(OptionItemIconPlugin);
        v.component(OPTION_ITEM_ADD_NAME, MOptionItemAdd);
    }
};

export default OptionItemAddPlugin;
