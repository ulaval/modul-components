import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import { ModulVue } from '../../utils/vue/vue';
import { PROGRESS_NAME } from '../component-names';
import WithRender from './progress.html?style=./progress.scss';
import INDETERMINATE_ANIMATION_TEMPLATE from './progressSpinnerAnimation';


export enum MProgressState {
    Completed = 'completed',
    InProgress = 'in-progress',
    Error = 'error'
}

export enum MProgressSkin {
    Default = 'default',
    Monochrome = 'monochrome'
}

@WithRender
@Component
export class MProgress extends ModulVue {
    @Prop()
    public value: number;
    @Prop()
    public indeterminate: boolean;
    @Prop({ default: 6 })
    public size: number;
    @Prop()
    public circle: boolean;
    @Prop({ default: 50 })
    public diameter: number;
    @Prop({ default: 4 })
    public stroke: number;
    @Prop({
        validator: value =>
            value === MProgressState.Completed ||
            value === MProgressState.InProgress ||
            value === MProgressState.Error
    })
    public state: MProgressState;
    @Prop({ default: true })
    public borderRadius: boolean;
    @Prop({ default: MProgressSkin.Default })
    public skin: MProgressSkin;

    private mode: string;
    private styleTag: HTMLElement | null;

    protected mounted(): void {
        this.attachStyleTag();
    }

    @Watch('diameter')
    private setAttachStyleTag(): void {
        this.attachStyleTag();
    }

    private attachStyleTag(): void {

        if (!this.styleTag) {
            this.styleTag = document.getElementById('m-progress-spinner-styles');
        }

        if (!this.styleTag) {
            this.styleTag = document.createElement('style');

            this.styleTag.id = 'm-progress-spinner-styles';
            document.head.appendChild(this.styleTag);
        }

        if (this.styleTag && (this.styleTag as any).sheet) {
            (this.styleTag as any).sheet.insertRule(this.animationCSS, 0);
        }

    }

    private get animationCSS(): string {
        return INDETERMINATE_ANIMATION_TEMPLATE
            .replace(/START_VALUE/g, `${0.95 * this.circleCircumference}`)
            .replace(/END_VALUE/g, `${0.2 * this.circleCircumference}`)
            .replace(/DIAMETER/g, `${this.diameter}`);
    }

    private get propSize(): string {
        return this.circle ? '100%' : this.size + 'px';
    }

    private get propState(): MProgressState {
        return this.state ? this.state : this.value >= 100 ? MProgressState.Completed : MProgressState.InProgress;
    }

    private get radiusSize(): string {
        return this.circle || !this.borderRadius ? 'initial' : this.size / 2 + 'px';
    }

    private get styleObject(): { [name: string]: string } {
        return {
            height: this.propSize,
            borderRadius: this.radiusSize
        };
    }

    private get barStyleObject(): { [name: string]: string } {
        return this.value >= 100 ? {
            width: this.stringValue,
            borderRadius: this.radiusSize
        } : {
            width: this.stringValue,
            'border-bottom-left-radius': this.radiusSize,
            'border-top-left-radius': this.radiusSize
        };
    }

    private get stringValue(): string {
        if (!this.indeterminate) {
            if (this.value < 0) {
                return '0%';
            } else if (this.value > 100) {
                return '100%';
            } else if (this.value !== undefined) {
                return this.value + '%';
            } else {
                return '0%';
            }
        } else {
            return '0%';
        }
    }

    private get numberValue(): number {
        if (!this.indeterminate) {
            if (this.value < 0) {
                return 0;
            } else if (this.value > 100) {
                return 100;
            } else {
                return this.value;
            }
        } else {
            return 0;
        }
    }

    private get isDeterminate(): boolean {
        if (this.circle === false) {
            this.mode = 'determinate';
        }
        return this.circle === false;
    }

    private get isIndeterminate(): boolean {
        if (this.circle === true) {
            this.mode = 'indeterminate';
        }
        return this.circle === true;
    }

    // Todo Not working
    // private get isIE(): boolean {
    //     if (!this.$isServer) {
    //         return (navigator.userAgent.toLowerCase() as any).includes('trident');
    //     }
    //     return false;
    // }

    private get progressClasses(): { [name: string]: boolean } {
        let animationClass: string = 'm-progress-spinner-indeterminate';

        // if (this.isIE) {
        //     animationClass += '-fallback';
        // }

        return {
            [animationClass]: true,
            ['m-' + this.mode]: true
        };
    }

    private get svgViewbox(): string {
        return `0 0 ${this.diameter} ${this.diameter}`;
    }

    private get svgStyles(): { [name: string]: string } {
        const circleSize: string = `${this.diameter}px`;

        return {
            width: circleSize,
            height: circleSize
        };
    }

    private get circleStyles(): { [name: string]: number | string } {
        return {
            'stroke-dashoffset': this.circleStrokeDashOffset,
            'stroke-dasharray': this.circleStrokeDashArray,
            'stroke-width': this.circleStrokeWidth,
            'animation-name': 'm-progress-spinner-stroke-rotate-' + this.diameter
        };
    }

    private get backgroundCircleStyles(): { [name: string]: string } {
        return {
            'stroke-dasharray': this.circleStrokeDashArray,
            'stroke-width': this.circleStrokeWidth,
            'animation-name': 'm-progress-spinner-stroke-rotate-' + this.diameter
        };
    }

    private get circleRadius(): number {
        return (this.diameter - this.stroke) / 2;
    }

    private get circleStrokeWidth(): string {
        return this.stroke + 'px';
    }

    private get circleCircumference(): number {
        return 2 * Math.PI * this.circleRadius;
    }

    private get circleStrokeDashArray(): string {
        return this.circleCircumference + 'px';
    }

    private get circleStrokeDashOffset(): string {
        if (!this.indeterminate) {
            return this.circleCircumference * (100 - this.numberValue) / 100 + 'px';
        } else if (this.indeterminate) {
            return this.circleCircumference * 0.2 + 'px';
        }
        return '0px';
    }

    private get isMonochrome(): boolean {
        return this.skin === MProgressSkin.Monochrome;
    }
}

const ProgressPlugin: PluginObject<any> = {
    install(v, options): void {

        v.component(PROGRESS_NAME, MProgress);
    }
};

export default ProgressPlugin;
