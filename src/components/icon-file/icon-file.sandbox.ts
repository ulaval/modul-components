import Vue, { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';
import BadgePlugin from '../../directives/badge/badge';
import { ICON_FILE_NAME } from '../component-names';
import IconFilePlugin from './icon-file';
import WithRender from './icon-file.sandbox.html';


@WithRender
@Component
export class MIconFileSandbox extends Vue {
}

const IconFileSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.use(IconFilePlugin);
        v.use(BadgePlugin);
        v.component(`${ICON_FILE_NAME}-sandbox`, MIconFileSandbox);
    }
};

export default IconFileSandboxPlugin;
