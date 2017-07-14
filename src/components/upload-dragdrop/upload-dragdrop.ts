import Vue from 'vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import WithRender from './upload-dragdrop.html?style=./upload-dragdrop.scss';
import { UPLOAD_DRAGDROP_NAME } from '../component-names';
import { MUploadInterface } from '../upload/upload';

@WithRender
@Component
export class MUploadDragdrop extends Vue {
    private dragOver: boolean = false;

    public filesDrop($event: DragEvent): void {
        $event.stopPropagation();
        $event.preventDefault();
        this.dragOver = false;

        let files: FileList = $event.dataTransfer.files;

        (this.$parent as MUploadInterface).filesdroped(files);
        this.$emit('filesDroped', files);
    }
}

const UploadDragdropPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(UPLOAD_DRAGDROP_NAME, MUploadDragdrop);
    }
};

export default UploadDragdropPlugin;
