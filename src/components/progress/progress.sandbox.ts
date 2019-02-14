import Vue, { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';

import { ModulVue } from '../../utils/vue/vue';
import { PROGRESS_NAME } from '../component-names';
import WithRender from './progress.sandbox.html';
import ProgressPlugin from './progress';

const DEFAULT_COUNT: number = 5 * 1000;

@WithRender
@Component
export class MProgressSandbox extends ModulVue {

    count: number = 0;
    interval: number;

    protected mounted(): void {
        this.interval = window.setInterval(() => {
            this.count += 100;
        }, 100);
    }

    get Count(): number {
        if (this.count >= DEFAULT_COUNT) {
            clearInterval(this.interval);
        }
        return Math.round(this.count / DEFAULT_COUNT * 100);
    }

}

const ProgressSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.use(ProgressPlugin);
        v.component(`${PROGRESS_NAME}-sandbox`, MProgressSandbox);
    }
};

export default ProgressSandboxPlugin;
