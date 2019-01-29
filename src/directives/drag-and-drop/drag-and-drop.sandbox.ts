import { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';

import { ModulVue } from '../../utils/vue/vue';
import { DRAGGABLE_NAME } from '../directive-names';
import WithRender from './drag-and-drop.sandbox.html';
import DragAndDropPlugin from './drag-and-drop-plugin';

@WithRender
@Component
export class MDraggableSandbox extends ModulVue {
    public dropped: boolean = false;

    public displayDrop(): void {
        this.dropped = true;
        setTimeout(() => this.dropped = !this.dropped, 1000);
    }
}

const DraggableSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.use(DragAndDropPlugin);
        v.component(`m-drag-and-drop-sandbox`, MDraggableSandbox);
    }
};

export default DraggableSandboxPlugin;
