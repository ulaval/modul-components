import Vue, { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import WithRender from './upload-input.html?style=./upload-input.scss';
import { UPLOAD_INPUT_NAME } from '../component-names';
import { MUploadInterface } from '../upload/upload';

@WithRender
@Component
export class MUploadInput extends Vue {

    private filesInput($event: Event): void {
        let files: FileList = ($event.target as any).files;

        (this.$parent as MUploadInterface).addNewFiles(files);
        this.$emit('filesInputed', files);
    }

    private get extensions(): string {
        return (this.$parent as MUploadInterface).extensionsProp;
    }

    private get multiple(): boolean {
        return (this.$parent as MUploadInterface).multipleProp;
    }
}

const UploadInputPlugin: PluginObject<any> = {
    install(v, options) {
        console.error(UPLOAD_INPUT_NAME + ' is deprecated');
        v.component(UPLOAD_INPUT_NAME, MUploadInput);
    }
};

export default UploadInputPlugin;
