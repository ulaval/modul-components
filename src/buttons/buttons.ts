import { PluginObject } from 'Vue';
import { ButtonComponent, BUTTON_NAME } from './button';

const buttons: PluginObject<any> = {
    install(v, options) {
        v.component(BUTTON_NAME, ButtonComponent);
    }
};

export default buttons;
