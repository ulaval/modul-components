import { DirectiveOptions, PluginObject, VNode, VNodeDirective } from 'vue';

import { REMOVE_USER_SELECT_NAME } from '../directive-names';
import { MDOMPlugin, MElementDomPlugin, MountFunction, RefreshFunction } from '../domPlugin';

export class MRemoveUserSelect extends MElementDomPlugin<boolean | undefined> {
    public static defaultMountPoint: string = '__mremoveuserselect__';

    public attach(mount: MountFunction): void {
        if (this.options === undefined) { this._options = true; }
        if (this.options) {
            mount(() => {
                this.addEventListener('onmouseover', (event: Event) => { event.preventDefault(); });

                this.element.style.webkitUserSelect = 'none';
                this.element.style.msUserSelect = 'none';
                this.element.style.userSelect = 'none';
                this.element.style['-moz-user-select'] = 'none';

                // mobile ios will display a gray box over element on touch start.  We don't want that.
                this.element.style.webkitTapHighlightColor = 'rgba(0,0,0,0)';
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
        this.element.style.webkitTapHighlightColor = '';
        this.element.style.userSelect = '';
        this.element.style.msUserSelect = '';
        this.element.style.webkitUserSelect = '';
        this.element.style['-moz-user-select'] = '';
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
        v.directive(REMOVE_USER_SELECT_NAME, Directive);
    }
};

export default RemoveUserSelectPlugin;
