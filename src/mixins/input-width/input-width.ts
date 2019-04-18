import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { ModulVue } from '../../utils/vue/vue';


export enum InputMaxWidth {
    None = 'none',
    XSmall = 'x-small',
    Small = 'small',
    Regular = 'regular',
    Medium = 'medium',
    Large = 'large'
}

// input reference is minimum mobile width (320px), minus base padding (16px) from both sides.
// $m-min-width - $m-spacing * 2 = regular input width
export enum InputMaxWidthValues {
    XSmall = '60px',
    Small = '136px',
    Regular = '288px',
    Medium = '592px',
    Large = '896px'
}

@Component
export class InputWidth extends ModulVue {
    @Prop({ default: '100%' })
    public width: string;

    @Prop({ default: InputMaxWidth.Regular })
    public maxWidth: InputMaxWidth | string;

    private get inputMaxWidth(): string | undefined {
        let maxWidth: string | undefined;
        switch (this.maxWidth) {
            case InputMaxWidth.None:
                maxWidth = undefined;
                break;
            case InputMaxWidth.XSmall:
                maxWidth = InputMaxWidthValues.XSmall;
                break;
            case InputMaxWidth.Small:
                maxWidth = InputMaxWidthValues.Small;
                break;
            case InputMaxWidth.Regular:
                maxWidth = InputMaxWidthValues.Regular;
                break;
            case InputMaxWidth.Medium:
                maxWidth = InputMaxWidthValues.Medium;
                break;
            case InputMaxWidth.Large:
                maxWidth = InputMaxWidthValues.Large;
                break;
            default:
                maxWidth = this.maxWidth;
        }
        return maxWidth;
    }

    public get inputWidth(): string | undefined {
        return this.width === 'none' ? undefined : this.width;
    }
}
