import { DirectiveOptions, PluginObject, VNode, VNodeDirective } from 'vue';

import { DROPPABLE_GROUP_NAME } from '../../directive-names';
import { MDOMPlugin, MElementDomPlugin, MountFunction, RefreshFunction } from '../../domPlugin';

export class MDroppableGroup extends MElementDomPlugin<string> {
    public static defaultMountPoint: string = '__mdroppablegroup__';

    public attach(mount: MountFunction): void {
        if (this.options) {
            mount(() => { });
        }
    }
    public update(options: string, refresh: RefreshFunction): void {
        if (options) {
            refresh(() => this._options = options);
        }
    }
    public detach(): void { }
}

const Directive: DirectiveOptions = {
    bind(element: HTMLElement, binding: VNodeDirective, node: VNode): void {
        MDOMPlugin.attach(MDroppableGroup, element, binding.value);
    },
    update(element: HTMLElement, binding: VNodeDirective, node: VNode): void {
        MDOMPlugin.attach(MDroppableGroup, element, binding.value);
    },
    unbind(element: HTMLElement, binding: VNodeDirective): void {
        MDOMPlugin.detach(MDroppableGroup, element);
    }
};

const DroppableGroupPlugin: PluginObject<any> = {
    install(v, options): void {
        v.directive(DROPPABLE_GROUP_NAME, Directive);
    }
};

export default DroppableGroupPlugin;
