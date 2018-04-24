import { MElementPlugin, MDOMPlugin, MountFunction, RefreshFunction } from '../domPlugin';
import { DirectiveOptions, VNodeDirective, VNode, PluginObject } from 'vue';
import { REMOVE_USER_SELECT } from '../directive-names';

export class MRemoveUserSelect extends MElementPlugin<boolean | undefined> {
    public static defaultMountPoint: string = '__mremoveuserselect__';

    public attach(mount: MountFunction): void {
        if (this.options === undefined) { this._options = true; }
        if (this.options) {
            mount(() => {
                this.addEventListener('onmouseover', (event: Event) => { event.preventDefault(); });

                this.element.style.webkitUserSelect = 'none';
                this.element.style.msUserSelect = 'none';
                this.element.style.userSelect = 'none';
            });
        }
    }
    public update(options: boolean, refresh: RefreshFunction): void {
        if (options === undefined) { options = true; }
        this._options = options;
        if (this.options) {
            refresh(() => {});
        }
    }
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
        MDOMPlugin.attach(MRemoveUserSelect, element, binding.value);
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
