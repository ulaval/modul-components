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
    ) {
        const $file: FileService = (vnode.context as ModulVue).$file;

        const onDragEnterOver = (e: DragEvent) => {
            e.stopPropagation();
            e.preventDefault();
        };

        const onDrop = (e: DragEvent) => {
            $file.add(e.dataTransfer.files);
        };

        const cleanup = () => {
            el.removeEventListener('dragenter', onDragEnterOver);
            el.removeEventListener('dragover', onDragEnterOver);
            el.removeEventListener('drop', onDrop);
        };

        el.addEventListener('dragenter', onDragEnterOver);
        el.addEventListener('dragover', onDragEnterOver);
        el.addEventListener('drop', onDrop);
        el.cleanupMFileDropDirective = cleanup;
    },
    unbind(
        el: MFileDropElement,
        binding: VNodeDirective,
        vnode: VNode,
        oldVnode: VNode
    ) {
        el.cleanupMFileDropDirective();
        const $file: FileService = (vnode.context as ModulVue).$file;
        $file.clear();
    }
};

const FileDropPlugin: PluginObject<any> = {
    install(v, options) {
        v.directive(FILE_DROP_NAME, MFileDropDirective);
    }
};

export default FileDropPlugin;
