import { PluginObject } from 'vue';

import { OPTION_ITEM_EDIT_NAME } from '../component-names';
import OptionItemIconPlugin from '../icon/icon';
import { MOptionItemPredefined } from './option-item-predefined';

export class MOptionItemEdit extends MOptionItemPredefined {
    protected get iconName(): string {
        return 'm-svg__edit';
    }

    protected get label(): string {
        return this.$i18n.translate('m-option:edit');
    }
}

const OptionItemEditPlugin: PluginObject<any> = {
    install(v, options): void {
        v.use(OptionItemIconPlugin);
        v.component(OPTION_ITEM_EDIT_NAME, MOptionItemEdit);
    }
};

export default OptionItemEditPlugin;
