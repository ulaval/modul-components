import Vue, { PluginObject } from 'vue';

import DraggablePlugin from './draggable/draggable';
import DraggableAllowScrollPlugin from './draggable/draggable-allow-scroll';
import DroppablePlugin from './droppable/droppable';
import DroppableGroupPlugin from './droppable/droppable-group';
import FileDropPlugin from './file-drop/file-drop';
import PopupPlugin from './popup/popup';
import RippleEffectPlugin from './ripple-effect/ripple-effect';
import ScrollToPlugin from './scroll-to/scroll-to';
import SortablePlugin from './sortable/sortable';
import TextAreaAutoHeightPlugin from './textarea-auto-height/textarea-auto-height';
import RemoveUserSelectPlugin from './user-select/remove-user-select';
import I18nDirectivePlugin from './i18n/i18n';

const DirectivesPlugin: PluginObject<any> = {
    install(v, options): void {
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
        Vue.use(TextAreaAutoHeightPlugin);
        Vue.use(I18nDirectivePlugin);
    }
};

export default DirectivesPlugin;
