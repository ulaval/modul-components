import Vue from 'vue';
import { ModulVue } from '../../src/utils/vue/vue';
import Component from 'vue-class-component';
import { Watch } from 'vue-property-decorator';

import WithRender from './viewer.html';

@WithRender
@Component
export class Viewer extends ModulVue {
    public tag: string = '';
    private test: boolean = false;
    private test2: string | undefined = undefined;

    public mounted(): void {
        this.buildTag();

        setInterval(() => {
            this.test2 = 'completed';
            this.test = true;
        }, 3000);
    }

    @Watch('$route')
    private buildTag(): void {
        this.tag = `<${this.$route.meta}></${this.$route.meta}>`;
    }

    private onFilesReady(files): void {
        files.forEach(f => {
            this.$file.upload(f.uid, {
                url: 'http://localhost:8082/upload'
            });
        });
    }

    private onFileUploadCancel(file): void {
        this.$file.cancelUpload(file.uid);
    }

    private onFilesUploadCompleted(files): void {
        // Do something with uploaded files !
    }
}
