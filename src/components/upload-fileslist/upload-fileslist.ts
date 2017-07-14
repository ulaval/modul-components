import Vue from 'vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import WithRender from './upload-fileslist.html?style=./upload-fileslist.scss';
import { UPLOAD_FILESLIST_NAME } from '../component-names';
import { MUploadInterface, GlobalFileList } from '../upload/upload';

@WithRender
@Component
export class MUploadFileslist extends Vue {
    public get fileList(): GlobalFileList[] {
        return (this.$parent as MUploadInterface).globalFileList;
    }

    public removeFile(index: number): void {
        (this.$parent as MUploadInterface).globalFileList.splice(index, 1);
    }
}

const UploadFileslistPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(UPLOAD_FILESLIST_NAME, MUploadFileslist);
    }
};

export default UploadFileslistPlugin;
