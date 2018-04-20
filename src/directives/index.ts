import Vue, { PluginObject } from 'vue';

import FileDropPlugin from './file-drop/file-drop';
import PopupPlugin from './popup/popup';
import RippleEffectPlugin from './ripple-effect/ripple-effect';
import ScrollToPlugin from './scroll-to/scroll-to';
import TextAreaAutoHeightPlugin from './textarea-auto-height/textarea-auto-height';
import DraggablePlugin from './draggable/draggable';
import DroppablePlugin from './droppable/droppable';
import SortablePlugin from './sortable/sortable';
import SortableGroupPlugin from './sortable/sortable-group';
import I18nDirectivePlugin from './i18n/i18n';

const DirectivesPlugin: PluginObject<any> = {
    install(v, options): void {
        Vue.use(DraggablePlugin);
        Vue.use(DroppablePlugin);
        Vue.use(FileDropPlugin);
        Vue.use(PopupPlugin);
        Vue.use(RippleEffectPlugin);
        Vue.use(ScrollToPlugin);
        Vue.use(SortablePlugin);
        Vue.use(SortableGroupPlugin);
        Vue.use(TextAreaAutoHeightPlugin);
        Vue.use(I18nDirectivePlugin);
    }
};

export default DirectivesPlugin;
