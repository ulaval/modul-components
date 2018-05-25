import Vue, { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';

import { FILE_UPLOAD_NAME } from '../component-names';
import WithRender from './file-upload.sandbox.html';

@WithRender
@Component
export class MFileUploadSandbox extends Vue {
}

const FileUploadSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.component(`${FILE_UPLOAD_NAME}-sandbox`, MFileUploadSandbox);
    }
};

export default FileUploadSandboxPlugin;
