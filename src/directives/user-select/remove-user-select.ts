import { MElementPlugin, MDOMPlugin } from '../domPlugin';
import { DirectiveOptions, VNodeDirective, VNode, PluginObject } from 'vue';
import { REMOVE_USER_SELECT } from '../directive-names';

export class MRemoveUserSelect extends MElementPlugin<boolean> {
    public static defaultMountPoint: string = '__mremoveuserselect__';

    public attach(): void {
        if (this.options) {
            this.element.style.userSelect = 'none';
            this.element.style.webkitUserSelect = 'none';
            this.element.style.msUserSelect = 'none';
        }
    }
    public update(options: string): void {}
    public detach(): void {
        this.element.style.userSelect = '';
        this.element.style.webkitUserSelect = '';
        this.element.style.msUserSelect = '';
    }
}

const Directive: DirectiveOptions = {
    bind(element: HTMLElement, binding: VNodeDirective, node: VNode): void {
        MDOMPlugin.attach(MRemoveUserSelect, element, binding.value);
    },
    update(element: HTMLElement, binding: VNodeDirective, node: VNode): void {
        MDOMPlugin.update(MRemoveUserSelect, element, binding.value);
    },
    unbind(element: HTMLElement, binding: VNodeDirective): void {
        MDOMPlugin.detach(MRemoveUserSelect, element);
    }
};

const RemoveUserSelectPlugin: PluginObject<any> = {
    install(v, options): void {
        v.directive(REMOVE_USER_SELECT, Directive);
    }
};

export default RemoveUserSelectPlugin;
