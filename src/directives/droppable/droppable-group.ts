import { MElementPlugin, MDOMPlugin } from '../domPlugin';
import { DirectiveOptions, VNodeDirective, VNode, PluginObject } from 'vue';
import { DROPPABLE_GROUP } from '../directive-names';

export class MDroppableGroup extends MElementPlugin<string> {
    public static defaultMountPoint: string = '__mdroppablegroup__';

    public attach(): void {}
    public update(options: string): void {
        this._options = options;
    }
    public detach(): void {}
}

const Directive: DirectiveOptions = {
    bind(element: HTMLElement, binding: VNodeDirective, node: VNode): void {
        MDOMPlugin.attach(MDroppableGroup, element, binding.value);
    },
    update(element: HTMLElement, binding: VNodeDirective, node: VNode): void {
        MDOMPlugin.update(MDroppableGroup, element, binding.value);
    },
    unbind(element: HTMLElement, binding: VNodeDirective): void {
        MDOMPlugin.detach(MDroppableGroup, element);
    }
};

const DroppableGroupPlugin: PluginObject<any> = {
    install(v, options): void {
        v.directive(DROPPABLE_GROUP, Directive);
    }
};

export default DroppableGroupPlugin;
