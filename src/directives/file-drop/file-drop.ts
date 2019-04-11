import { DirectiveOptions, PluginObject, VNode, VNodeDirective } from 'vue';
import FilePlugin, { DEFAULT_STORE_NAME, FileService } from '../../utils/file/file';
import { ModulVue } from '../../utils/vue/vue';
import { FILE_DROP_NAME } from '../directive-names';


interface MFileDropElement extends HTMLElement {
    cleanupMFileDropDirective(): any;
}

const MFileDropDirective: DirectiveOptions = {
    bind(
        el: MFileDropElement,
        binding: VNodeDirective,
        vnode: VNode,
        oldVnode: VNode
    ): void {
        const $file: FileService = (vnode.context as ModulVue).$file;

        const onDragEnterOver: (e: DragEvent) => void = (e: DragEvent) => {
            el.classList.add('m--is-drag-over');
            e.stopPropagation();
            e.preventDefault();
        };

        const onDragLeave: (e: DragEvent) => void = (e: DragEvent) => {
            el.classList.remove('m--is-drag-over');
            e.stopPropagation();
            e.preventDefault();
        };

        const onDrop: (e: DragEvent) => void = (e: DragEvent) => {
            el.classList.remove('m--is-drag-over');
            e.preventDefault();
            $file.add(
                e.dataTransfer!.files,
                binding.value ? binding.value : DEFAULT_STORE_NAME
            );
        };

        const cleanup: () => void = () => {
            el.removeEventListener('dragenter', onDragEnterOver);
            el.removeEventListener('dragover', onDragEnterOver);
            el.removeEventListener('dragleave', onDragLeave);
            el.removeEventListener('drop', onDrop);
        };

        el.addEventListener('dragenter', onDragEnterOver);
        el.addEventListener('dragover', onDragEnterOver);
        el.addEventListener('dragleave', onDragLeave);
        el.addEventListener('drop', onDrop);
        el.cleanupMFileDropDirective = cleanup;
    },
    unbind(
        el: MFileDropElement,
        binding: VNodeDirective,
        vnode: VNode,
        oldVnode: VNode
    ): void {
        el.cleanupMFileDropDirective();
        const $file: FileService = (vnode.context as ModulVue).$file;
        if (!(binding as any).modifiers['keep-store']) {
            $file.destroy(
                binding.value ? binding.value : DEFAULT_STORE_NAME
            );
        }
    }
};

const FileDropPlugin: PluginObject<any> = {
    install(v, options): void {
        v.use(FilePlugin);
        v.directive(FILE_DROP_NAME, MFileDropDirective);
    }
};

export default FileDropPlugin;
