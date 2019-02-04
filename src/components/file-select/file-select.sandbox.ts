import Vue, { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';
import { FILE_SELECT_NAME } from '../component-names';
import FileSelectPlugin from './file-select';
import WithRender from './file-select.sandbox.html';


@WithRender
@Component
export class MFileSelectSandbox extends Vue {
}

const FileSelectSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.use(FileSelectPlugin);
        v.component(`${FILE_SELECT_NAME}-sandbox`, MFileSelectSandbox);
    }
};

export default FileSelectSandboxPlugin;
