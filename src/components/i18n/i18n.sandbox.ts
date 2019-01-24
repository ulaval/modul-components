import Vue, { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';
import { I18N_NAME } from '../component-names';
import I18nPlugin from './i18n';
import WithRender from './i18n.sandbox.html';


@WithRender
@Component
export class MI18nSandbox extends Vue {
}

const I18nSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.use(I18nPlugin);
        v.component(`${I18N_NAME}-sandbox`, MI18nSandbox);
    }
};

export default I18nSandboxPlugin;
