import Vue, { PluginObject } from 'vue';

import LoggerPlugin from '../utils/logger/logger';
import BadgePlugin from './badge/badge';

import FileDropPlugin from './file-drop/file-drop';
import I18nDirectivePlugin from './i18n/i18n';
import PopupPlugin from './popup/popup';
import RippleEffectPlugin from './ripple-effect/ripple-effect';
import ScrollToPlugin from './scroll-to/scroll-to';
import SortablePlugin from './sortable/sortable';
import TextareaAutoHeightPlugin from './textarea-auto-height/textarea-auto-height';
import RemoveUserSelectPlugin from './user-select/remove-user-select';
import DragAndDropPlugin from './drag-and-drop/drag-and-drop-plugin';

const DirectivesPlugin: PluginObject<any> = {
    install(v, options): void {
        if (!v.prototype.$log) {
            Vue.use(LoggerPlugin);
        }

        v.prototype.$log.error('DirectivesPlugin will be deprecated in modul v.1.0, directive should now be installed separately');

        Vue.use(BadgePlugin);
        Vue.use(DragAndDropPlugin);
        Vue.use(FileDropPlugin);
        Vue.use(PopupPlugin);
        Vue.use(RemoveUserSelectPlugin);
        Vue.use(RippleEffectPlugin);
        Vue.use(ScrollToPlugin);
        Vue.use(SortablePlugin);
        Vue.use(TextareaAutoHeightPlugin);
        Vue.use(I18nDirectivePlugin);
    }
};

export default DirectivesPlugin;
