import Vue from 'vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import WithRender from './upload.html?style=./upload.scss';
import { UPLOAD_NAME } from '../component-names';

@WithRender
@Component
export class MUpload extends Vue {

    @Prop({ default: true })
    public multiple: boolean;

    // Initialize data for v-model to work
    public files: any[] = [];

    private fileAPISupport: boolean = false;

    public beforeCreate() {
        // Check for the various File API support.
        if ((window as any).File && (window as any).FileReader && (window as any).FileList && window.Blob) {
            this.fileAPISupport = true;
        }
    }

    public get filesSelected() {
        return this.files;
    }

    public filesChange($event: Event) {
        let fileList: FileList = ($event.target as any).files as FileList;
    }

    // public handleFileSelect(evt) {
    //     let files = evt.target.files; // FileList object

    //     // files is a FileList of File objects. List some properties.
    //     let output = [];
    //     for (let file in files) {
    //         output.push('<li><strong>', escape(file.name), '</strong> (', file.type || 'n/a', ') - ',
    //                 f.size, ' bytes, last modified: ',
    //                 f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : 'n/a',
    //                 '</li>');
    //     }
    //     document.getElementById('list').innerHTML = '<ul>' + output.join('') + '</ul>';
    // }

    // document.getElementById('files').addEventListener('change', handleFileSelect, false);
}

const UploadPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(UPLOAD_NAME, MUpload);
    }
};

export default UploadPlugin;
