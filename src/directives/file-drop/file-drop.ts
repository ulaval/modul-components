import { DirectiveOptions, VNodeDirective, VNode, PluginObject } from 'vue';
import { ModulVue } from '../../utils/vue/vue';
import { FileService } from '../../utils/file/file';
import { FILE_DROP_NAME } from '../directive-names';

interface MFileDropElement extends HTMLElement {
    cleanupMFileDropDirective();
}

const MFileDropDirective: DirectiveOptions = {
    bind(
        el: MFileDropElement,
        binding: VNodeDirective,
        vnode: VNode,
        oldVnode: VNode
    ): void {
        const $file: FileService = (vnode.context as ModulVue).$file;

        const onDragEnterOver = (e: DragEvent) => {
            el.classList.add('m--is-drag-over');
            e.stopPropagation();
            e.preventDefault();
        };

        const onDragLeave = (e: DragEvent) => {
            el.classList.remove('m--is-drag-over');
            e.stopPropagation();
            e.preventDefault();
        };

        const onDrop = (e: DragEvent) => {
            el.classList.remove('m--is-drag-over');
            e.preventDefault();
            $file.add(e.dataTransfer.files);
        };

        const cleanup = () => {
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
        $file.clear();
    }
};

const FileDropPlugin: PluginObject<any> = {
    install(v, options): void {
        v.directive(FILE_DROP_NAME, MFileDropDirective);
    }
};

export default FileDropPlugin;
