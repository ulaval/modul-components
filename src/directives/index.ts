import Vue, { PluginObject } from 'vue';

import FileDropPlugin from './file-drop/file-drop';
import PopupPlugin from './popup/popup';
import RippleEffectPlugin from './ripple-effect/ripple-effect';
import ScrollToPlugin from './scroll-to/scroll-to';
import TextAreaAutoHeightPlugin from './textarea-auto-height/textarea-auto-height';
import DraggablePlugin from './draggable/draggable';
import DroppablePlugin from './droppable/droppable';
import SortablePlugin from './sortable/sortable';
import RemoveUserSelectPlugin from './user-select/remove-user-select';
import DroppableGroupPlugin from './droppable/droppable-group';
import DraggableAllowScrollPlugin from './draggable/draggable-allow-scroll';

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
    }
};

export default DirectivesPlugin;
