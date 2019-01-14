import Vue, { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';
import { toArray } from '../../utils/enum/enum';
import { ICON_BUTTON_NAME } from '../component-names';
import { MIconButtonSkin } from './icon-button';
import WithRender from './icon-button.sandbox.html';

@WithRender
@Component
export class MIconButtonSandbox extends Vue {
    private buttonSize: string = '44px';
    private iconSize: string = '20px';
    private iconButtonSkin: MIconButtonSkin = MIconButtonSkin.Dark;
    private mIconButtonSkin = MIconButtonSkin;

    get iconButtonSkinAsArray(): { key: string | number, value: string }[] {
        return toArray(MIconButtonSkin);
    }
}

const IconButtonSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.component(`${ICON_BUTTON_NAME}-sandbox`, MIconButtonSandbox);
    }
};

export default IconButtonSandboxPlugin;
