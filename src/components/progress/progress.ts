import { ModulVue } from '../../utils/vue/vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import WithRender from './progress.html?style=./progress.scss';
import { PROGRESS_NAME } from '../component-names';
import INDETERMINATE_ANIMATION_TEMPLATE from './progressSpinnerAnimation';

export enum MProgressState {
    Completed = 'completed',
    InProgress = 'in-progress',
    Error = 'error'
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
        default: MProgressState.InProgress,
        validator: value =>
            value == MProgressState.Completed ||
            value == MProgressState.InProgress ||
            value == MProgressState.Error
    })
    public state: MProgressState;

    private mode: string;
    private styleTag;

    protected mounted(): void {
        this.attachStyleTag();
    }

    @Watch('diameter')
    private setAttachStyleTag(): void {
        this.attachStyleTag();
    }

    private getAnimationCSS() {
        return INDETERMINATE_ANIMATION_TEMPLATE
            .replace(/START_VALUE/g, `${0.95 * this.circleCircumference}`)
            .replace(/END_VALUE/g, `${0.2 * this.circleCircumference}`)
            .replace(/DIAMETER/g, `${this.diameter}`);
    }

    private attachStyleTag() {

        if (!this.styleTag) {
            this.styleTag = document.getElementById('m-progress-spinner-styles');
        }

        if (!this.styleTag) {
            this.styleTag = document.createElement('style');

            this.styleTag.id = 'm-progress-spinner-styles';
            document.head.appendChild(this.styleTag);
        }

        if (this.styleTag && this.styleTag.sheet) {
            this.styleTag.sheet.insertRule(this.getAnimationCSS(), 0);
        }

    }

    private get propSize() {
        return this.circle ? undefined : this.size + 'px';
    }

    private get radiusSize() {
        return this.circle ? undefined : this.size / 2 + 'px';
    }

    private get styleObject() {
        return {
            height: this.propSize,
            borderRadius: this.radiusSize
        };
    }

    private get stringValue(): string | undefined {
        if (!this.indeterminate) {
            if (this.value < 0) {
                return undefined;
            } else if (this.value > 100) {
                return '100%';
            } else {
                return this.value + '%';
            }
        } else {
            return undefined;
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

    private get isDeterminate() {
        if (this.circle === false) {
            this.mode = 'determinate';
        }
        return this.circle === false;
    }

    private get isIndeterminate() {
        if (this.circle === true) {
            this.mode = 'indeterminate';
        }
        return this.circle === true;
    }

    // Todo Not working
    // private get isIE() {
    //     if (!this.$isServer) {
    //         return (navigator.userAgent.toLowerCase() as any).includes('trident');
    //     }
    //     return false;
    // }

    private get progressClasses() {
        let animationClass = 'm-progress-spinner-indeterminate';

        // if (this.isIE) {
        //     animationClass += '-fallback';
        // }

        return {
            [animationClass]: true,
            ['m-' + this.mode]: true
        };
    }

    private get svgViewbox() {
        return `0 0 ${this.diameter} ${this.diameter}`;
    }

    private get svgStyles() {
        const circleSize = `${this.diameter}px`;

        return {
            width: circleSize,
            height: circleSize
        };
    }

    private get circleStyles() {
        return {
            'stroke-dashoffset': this.circleStrokeDashOffset,
            'stroke-dasharray': this.circleStrokeDashArray,
            'stroke-width': this.circleStrokeWidth,
            'animation-name': 'm-progress-spinner-stroke-rotate-' + this.diameter
        };
    }

    private get backgroundCircleStyles() {
        return {
            'stroke-dasharray': this.circleStrokeDashArray,
            'stroke-width': this.circleStrokeWidth,
            'animation-name': 'm-progress-spinner-stroke-rotate-' + this.diameter
        };
    }

    private get circleRadius() {
        return (this.diameter - this.stroke) / 2;
    }

    private get circleStrokeWidth() {
        return this.stroke + 'px';
    }

    private get circleCircumference() {
        return 2 * Math.PI * this.circleRadius;
    }

    private get circleStrokeDashArray() {
        return this.circleCircumference + 'px';
    }

    private get circleStrokeDashOffset() {
        if (!this.indeterminate) {
            return this.circleCircumference * (100 - this.numberValue) / 100 + 'px';
        } else if (this.indeterminate) {
            return this.circleCircumference * 0.2 + 'px';
        }
        return undefined;
    }

}

const ProgressPlugin: PluginObject<any> = {
    install(v, options) {
        console.debug(PROGRESS_NAME, 'plugin.install');
        v.component(PROGRESS_NAME, MProgress);
    }
};

export default ProgressPlugin;
