import { ModulVue } from '../../utils/vue/vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { MediaQueries, MediaQueriesMixin } from '../../mixins/media-queries/media-queries';
import { KeyCode } from '../../utils/keycode/keycode';

export enum InputMaxWidth {
    None = 'none',
    XSmall = 'x-small',
    Small = 'small',
    Regular = 'regular',
    Medium = 'medium',
    Large = 'large'
}

@Component({
    mixins: [MediaQueries]
})
export class InputWidth extends ModulVue {
    @Prop({ default: '100%' })
    public width: string;

    @Prop({ default: InputMaxWidth.Regular })
    public maxWidth: string;

    public internalMaxWidth: string | undefined;

    private get inputMaxWidth(): string | undefined {
        switch (this.maxWidth) {
            case InputMaxWidth.None:
                this.internalMaxWidth = undefined;
                break;
            case InputMaxWidth.XSmall:
                this.internalMaxWidth = '72px';
                break;
            case InputMaxWidth.Small:
                this.internalMaxWidth = '144px';
                break;
            case InputMaxWidth.Regular:
                this.internalMaxWidth = '288px';
                break;
            case InputMaxWidth.Medium:
                this.internalMaxWidth = '608px';
                break;
            case InputMaxWidth.Large:
                this.internalMaxWidth = '800px';
                break;
            default:
                this.internalMaxWidth = this.maxWidth;
        }
        return this.internalMaxWidth;
    }
}
