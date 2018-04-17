import { MElementPlugin, MDOMPlugin } from '../domPlugin';
import { DirectiveOptions, VNodeDirective, VNode, PluginObject } from 'vue';
import { REMOVE_USER_SELECT } from '../directive-names';

export class MRemoveUserSelect extends MElementPlugin<boolean> {
    public static defaultMountPoint: string = '__mremoveuserselect__';

    public attach(): void {
        if (this.options) {
            if (typeof this.element.onselectstart != 'undefined') {
                this.addEventListener('onselectstart', () => { return false; });
            } else {
                this.addEventListener('onmousedown', () => { return false; });
            }

            this.element.style.webkitUserSelect = 'none';
            this.element.style.msUserSelect = 'none';
            this.element.style.userSelect = 'none';
        }
    }
    public update(options: string): void {}
    public detach(): void {
        this.removeAllEvents();
        this.element.style.userSelect = '';
        this.element.style.msUserSelect = '';
        this.element.style.webkitUserSelect = '';
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
