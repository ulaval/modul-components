import { DirectiveOptions, VNodeDirective, VNode, PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { BADGE } from '../directive-names';

// export enum MBadgeState {
//     Completed = 'completed',
//     Warning = 'warning',
//     Error = 'error'
// }

// export class MBadge extends Vue {

//     private mounted(): void {
//         let id = this.$children[0]['name'];
//         let svg = (document.getElementById(id) as HTMLElement).dataset.format;
//         console.log(id, svg);
//     }
//
    // private onClick(event: Event): void {
    //     this.$emit('click', event);
    //     this.$el.blur();
    // }

    // private onFocus(event: Event): void {
    //     this.$emit('focus');
    // }

    // private onBlur(event: Event): void {
    //     this.$emit('blur');
    // }

    // private getIcon(): string {
    //     let icon: string = '';
    //     switch (this.state) {
    //         case MBadgeState.Completed:
    //             icon = 'chip-check';
    //             break;
    //         case MBadgeState.Warning:
    //             icon = 'chip-warning';
    //             break;
    //         case MBadgeState.Error:
    //             icon = 'chip-error';
    //             break;
    //         default:
    //             break;
    //     }
    //     return icon;
    // }

    // private get rightDistance(): string {
    //     let size = parseInt(this.size, 10);
    //     let chipSise = parseInt(this.chipSize, 10);
    //     let realSize = (size / (24 / 18));
    //     let distance = ((size - realSize) / 2) - (chipSise / 2);
    //     return distance + 'px';
    // }

    // private get bottomDistance(): string {
    //     let chipSise = parseInt(this.chipSize, 10);
    //     let distance = chipSise * (1 / 4);
    //     return '-' + distance + 'px';
    // }

    // private get hasState(): boolean {
    //     return !!this.state;
    // }
// }

const MBadgeDirective: DirectiveOptions = {
    bind(
        el: HTMLElement,
        binding: VNodeDirective,
        vnode: VNode,
        oldVnode: VNode
    ): void {

        el.style.position = 'fixed';
        // const $file: FileService = (vnode.context as ModulVue).$file;

        // const onDragEnterOver = (e: DragEvent) => {
        //     el.classList.add('m--is-drag-over');
        //     e.stopPropagation();
        //     e.preventDefault();
        // };

        // const onDragLeave = (e: DragEvent) => {
        //     el.classList.remove('m--is-drag-over');
        //     e.stopPropagation();
        //     e.preventDefault();
        // };

        // const onDrop = (e: DragEvent) => {
        //     el.classList.remove('m--is-drag-over');
        //     e.preventDefault();
        //     $file.add(
        //         e.dataTransfer.files,
        //         binding.value ? binding.value : DEFAULT_STORE_NAME
        //     );
        // };

        // const cleanup = () => {
        //     el.removeEventListener('dragenter', onDragEnterOver);
        //     el.removeEventListener('dragover', onDragEnterOver);
        //     el.removeEventListener('dragleave', onDragLeave);
        //     el.removeEventListener('drop', onDrop);
        // };

        // el.addEventListener('dragenter', onDragEnterOver);
        // el.addEventListener('dragover', onDragEnterOver);
        // el.addEventListener('dragleave', onDragLeave);
        // el.addEventListener('drop', onDrop);
        // el.cleanupMFileDropDirective = cleanup;
    },
    unbind(
        // el: MFileDropElement,
        // binding: VNodeDirective,
        // vnode: VNode,
        // oldVnode: VNode
    ): void {
        // el.cleanupMFileDropDirective();
        // const $file: FileService = (vnode.context as ModulVue).$file;
        // if (!binding.modifiers['keep-store']) {
        //     $file.destroy(
        //         binding.value ? binding.value : DEFAULT_STORE_NAME
        //     );
        // }
    }
};

const BadgePlugin: PluginObject<any> = {
    install(v, options): void {
        v.directive(BADGE, MBadgeDirective);
    }
};

export default BadgePlugin;
