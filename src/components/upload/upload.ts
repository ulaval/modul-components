import Vue from 'vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import WithRender from './upload.html?style=./upload.scss';
import { UPLOAD_NAME } from '../component-names';
import Upload from 'element-ui';

@WithRender
@Component
export class MUpload extends Vue {
    public fileList: Object[] = [{ name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100' }, { name: 'food2.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100' }];
    private componentName: string = UPLOAD_NAME;

    public handleRemove(file, fileList) {
        console.log(file, fileList);
    }
    public handlePreview(file) {
        console.log(file);
    }
}

const UploadPlugin: PluginObject<any> = {
    install(v, options) {
        v.use(Upload);
        v.component(UPLOAD_NAME, MUpload);
    }
};

export default UploadPlugin;
