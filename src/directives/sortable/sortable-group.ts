import { MElementPlugin, MDOMPlugin } from '../domPlugin';
import { DirectiveOptions, VNodeDirective, VNode, PluginObject } from 'vue';
import { SORTABLE_GROUP_NAME } from '../directive-names';

export class MSortableGroup extends MElementPlugin<string> {
    public static defaultMountPoint: string = '__msortablegroup__';

    public attach(): void {}
    public update(options: string): void {
        this._options = options;
    }
    public detach(): void {}
}

const Directive: DirectiveOptions = {
    bind(element: HTMLElement, binding: VNodeDirective, node: VNode): void {
        MDOMPlugin.attach(MSortableGroup, element, binding.value);
    },
    update(element: HTMLElement, binding: VNodeDirective, node: VNode): void {
        MDOMPlugin.update(MSortableGroup, element, binding.value);
    },
    unbind(element: HTMLElement, binding: VNodeDirective): void {
        MDOMPlugin.detach(MSortableGroup, element);
    }
};

const SortableGroupPlugin: PluginObject<any> = {
    install(v, options): void {
        v.directive(SORTABLE_GROUP_NAME, Directive);
    }
};

export default SortableGroupPlugin;
