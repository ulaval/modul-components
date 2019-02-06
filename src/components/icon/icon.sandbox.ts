import Vue, { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';
import BadgePlugin from '../../directives/badge/badge';
import { ICON_NAME } from '../component-names';
import IconFilePlugin from '../icon-file/icon-file';
import IconPlugin from './icon';
import WithRender from './icon.sandbox.html';


@WithRender
@Component
export class MIconSandbox extends Vue {
}

const IconSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.use(IconPlugin);
        v.use(IconFilePlugin);
        v.use(BadgePlugin);
        v.component(`${ICON_NAME}-sandbox`, MIconSandbox);
    }
};

export default IconSandboxPlugin;
