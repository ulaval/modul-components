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

    private get inputMaxWidth(): string | undefined {
        let maxWidth: string | undefined;
        switch (this.maxWidth) {
            case InputMaxWidth.None:
                maxWidth = undefined;
                break;
            case InputMaxWidth.XSmall:
                maxWidth = '72px';
                break;
            case InputMaxWidth.Small:
                maxWidth = '144px';
                break;
            case InputMaxWidth.Regular:
                maxWidth = '288px';
                break;
            case InputMaxWidth.Medium:
                maxWidth = '608px';
                break;
            case InputMaxWidth.Large:
                maxWidth = '800px';
                break;
            default:
                maxWidth = this.maxWidth;
        }
        return maxWidth;
    }

    private get inputWidth(): string | undefined {
        return this.width == 'none' ? undefined : this.width;
    }
}
