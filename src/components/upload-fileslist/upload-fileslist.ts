import Vue, { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import WithRender from './upload-fileslist.html?style=./upload-fileslist.scss';
import { UPLOAD_FILESLIST_NAME } from '../component-names';
import { MUploadInterface, GlobalFileList } from '../upload/upload';

@WithRender
@Component
export class MUploadFileslist extends Vue {

    private removeFile(index: number): void {
        (this.$parent as MUploadInterface).globalFileList.splice(index, 1);
    }

    private get fileList(): GlobalFileList[] {
        return (this.$parent as MUploadInterface).globalFileList;
    }

    private get showImage(): boolean {
        return (this.$parent as MUploadInterface).showImageProp;
    }
}

const UploadFileslistPlugin: PluginObject<any> = {
    install(v, options) {
        console.error(UPLOAD_FILESLIST_NAME + ' is deprecated');
        v.component(UPLOAD_FILESLIST_NAME, MUploadFileslist);
    }
};

export default UploadFileslistPlugin;
