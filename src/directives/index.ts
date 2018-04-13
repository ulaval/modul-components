import Vue, { PluginObject } from 'vue';

import BadgePlugin from './badge/badge';
import DraggablePlugin from './draggable/draggable';
import DroppablePlugin from './droppable/droppable';
import FileDropPlugin from './file-drop/file-drop';
import PopupPlugin from './popup/popup';
import RippleEffectPlugin from './ripple-effect/ripple-effect';
import ScrollToPlugin from './scroll-to/scroll-to';
import SortablePlugin from './sortable/sortable';
import SortableGroupPlugin from './sortable/sortable-group';
import TextAreaAutoHeightPlugin from './textarea-auto-height/textarea-auto-height';

const DirectivesPlugin: PluginObject<any> = {
    install(v, options): void {
        Vue.use(BadgePlugin);
        Vue.use(DraggablePlugin);
        Vue.use(DroppablePlugin);
        Vue.use(FileDropPlugin);
        Vue.use(PopupPlugin);
        Vue.use(RippleEffectPlugin);
        Vue.use(ScrollToPlugin);
        Vue.use(SortablePlugin);
        Vue.use(SortableGroupPlugin);
        Vue.use(TextAreaAutoHeightPlugin);
    }
};

export default DirectivesPlugin;
