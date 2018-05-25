import Vue, { PluginObject } from 'vue';

import BadgePlugin from './badge/badge';
import DraggablePlugin from './draggable/draggable';
import DraggableAllowScrollPlugin from './draggable/draggable-allow-scroll';
import DroppablePlugin from './droppable/droppable';
import DroppableGroupPlugin from './droppable/droppable-group';
import FileDropPlugin from './file-drop/file-drop';
import I18nDirectivePlugin from './i18n/i18n';
import PopupPlugin from './popup/popup';
import RippleEffectPlugin from './ripple-effect/ripple-effect';
import ScrollToPlugin from './scroll-to/scroll-to';
import SortablePlugin from './sortable/sortable';
import RemoveUserSelectPlugin from './user-select/remove-user-select';
import LoggerPlugin from '../utils/logger/logger';

const DirectivesPlugin: PluginObject<any> = {
    install(v, options): void {

        if (!v.prototype.$log) {
            Vue.use(LoggerPlugin);
        }

        Vue.use(BadgePlugin);
        Vue.use(DraggablePlugin);
        Vue.use(DraggableAllowScrollPlugin);
        Vue.use(DroppablePlugin);
        Vue.use(DroppableGroupPlugin);
        Vue.use(FileDropPlugin);
        Vue.use(PopupPlugin);
        Vue.use(RemoveUserSelectPlugin);
        Vue.use(RippleEffectPlugin);
        Vue.use(ScrollToPlugin);
        Vue.use(SortablePlugin);
        Vue.use(I18nDirectivePlugin);
    }
};

export default DirectivesPlugin;
