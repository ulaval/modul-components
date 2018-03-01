import Component from 'vue-class-component';
import { Watch } from 'vue-property-decorator';

import { ModulVue } from '../../src/utils/vue/vue';
import WithRender from './viewer.html';

@WithRender
@Component
export class Viewer extends ModulVue {
    public tag: string = '';

    public mounted(): void {
        this.buildTag();
    }

    private onFilesReady(files): void {
        files.forEach(f => {
            const fd = new FormData();
            fd.append('file', f.file);
            this.$file.upload(f.uid, {
                url: 'http://localhost:8989/upload',
                config: {
                    data: fd
                }
            });
        });
    }

    private onFileUploadCancel(file): void {
        this.$file.cancelUpload(file.uid);
    }

    private onFilesUploadCompleted(files): void {
        // Do something with uploaded files !
    }

    @Watch('$route')
    private buildTag(): void {
        this.tag = `<${this.$route.meta}></${this.$route.meta}>`;
    }
}
