import Vue from 'vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import WithRender from './upload-input.html?style=./upload-input.scss';
import { UPLOAD_INPUT_NAME } from '../component-names';

@WithRender
@Component
export class MUploadInput extends Vue {

    @Prop({ default: false })
    public multiple: boolean;
    @Prop({ default: () => [] })
    public extensions: string[];

    private fileAPISupport: boolean = false;
    private extensionsProp: string;

    @Watch('extensions')
    public extensionsChange() {
        this.extensionsProp = (!this.extensions[0] || this.extensions[0].trim() == '' || this.extensions[0].trim() == '*') ? '*' : this.extensions.join();
    }

    public created() {
        this.extensionsProp = (!this.extensions[0] || this.extensions[0].trim() == '' || this.extensions[0].trim() == '*') ? '*' : this.extensions.join();
    }

    public mounted() {
        // Check for the various File API support.
        if ((window as any).File && (window as any).FileReader && (window as any).FileList && window.Blob) {
            this.fileAPISupport = true;
        }
    }

    public filesInput($event: Event): void {
        let files: FileList = ($event.target as any).files;
        this.$emit('filesInputed', files);
    }

}

const UploadInputPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(UPLOAD_INPUT_NAME, MUploadInput);
    }
};

export default UploadInputPlugin;
