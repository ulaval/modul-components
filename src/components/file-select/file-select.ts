import { ModulVue } from '../../utils/vue/vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import WithRender from './file-select.html?style=./file-select.scss';
import { FILE_SELECT_NAME, BUTTON_NAME } from '../component-names';
import ButtonPlugin, { MButtonSkin, MButtonType, MButtonIconPosition } from '../button/button';
import ValidationMesagePlugin from '../validation-message/validation-message';
import uuid from '../../utils/uuid/uuid';
import { InputState } from '../../mixins/input-state/input-state';

@WithRender
@Component({
    mixins: [
        InputState
    ]
})
export class MFileSelect extends ModulVue {

    @Prop()
    public label: string;
    @Prop({
        default: MButtonSkin.Secondary,
        validator: value =>
            value == MButtonSkin.Primary ||
            value == MButtonSkin.Secondary
    })
    public skin: MButtonSkin;
    @Prop()
    public disabled: boolean;
    @Prop()
    public waiting: boolean;
    @Prop()
    public fullSize: boolean;
    @Prop()
    public iconName: string;
    @Prop({
        default: MButtonIconPosition.Left,
        validator: value =>
            value == MButtonIconPosition.Left ||
            value == MButtonIconPosition.Right
    })
    public iconPosition: MButtonIconPosition;
    @Prop({ default: '12px' })
    public iconSize: string;
    @Prop()
    public multiple: boolean;

    private id: string = `mFileSelect-${uuid.generate()}`;

    private onClick(event: Event): void {
        (this.$refs.inputFile as HTMLElement).click();
        this.$emit('click', event);
        this.$refs['inputFile']['blur']();
    }

    private onFocus(event: Event): void {
        this.$emit('focus');
    }

    private onBlur(event: Event): void {
        this.$emit('blur');
    }

    private processFile(event: Event): void {
        const file = (this.$refs.inputFile as HTMLInputElement).files;
        if (file) {
            this.$file.add(file) ;
        }
        (this.$refs.inputFile as HTMLInputElement).value = '';
    }
}

const FileSelectPlugin: PluginObject<any> = {
    install(v, options): void {
        console.debug(FILE_SELECT_NAME, 'plugin.install');
        v.use(ButtonPlugin);
        v.use(ValidationMesagePlugin);
        v.component(FILE_SELECT_NAME, MFileSelect);
    }
};

export default FileSelectPlugin;
