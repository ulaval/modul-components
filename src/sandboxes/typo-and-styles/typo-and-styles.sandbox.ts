import Vue, { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';
import WithRender from './typo-and-styles.sandbox.html';

@WithRender
@Component
export class TypoAndStylesSandbox extends Vue {
}


const TypoAndStylesSandboxPlugin: PluginObject<any> = {
    install(v, options): void {

        v.component('m-typo-and-styles-sandbox', TypoAndStylesSandbox);
    }
};

export default TypoAndStylesSandboxPlugin;
