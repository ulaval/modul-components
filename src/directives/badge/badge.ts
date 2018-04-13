import Vue, { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import WithRender from './badge.html?style=./badge.scss';
import { BADGE } from '../directive-names';

export enum MBadgeState {
    Completed = 'completed',
    Warning = 'warning',
    Error = 'error'
}

@WithRender
@Component
export class MBadge extends Vue {

    @Prop()
    public name: string;
    @Prop({ default: '30px' })
    public size: string;
    @Prop({ default: '16px' })
    public chipSize: string;
    @Prop()
    public svgTitle: string;
    @Prop()
    public disabled: boolean;
    @Prop()
    public waiting: boolean;
    @Prop({
        default: MBadgeState.Completed,
        validator: value =>
            value == MBadgeState.Completed ||
            value == MBadgeState.Warning ||
            value == MBadgeState.Error
    })
    public state: MBadgeState;

    private mounted(): void {
        let id = this.$children[0]['name'];
        let svg = (document.getElementById(id) as HTMLElement).dataset.format;
        console.log(id, svg);
    }

    private onClick(event: Event): void {
        this.$emit('click', event);
        this.$el.blur();
    }

    private onFocus(event: Event): void {
        this.$emit('focus');
    }

    private onBlur(event: Event): void {
        this.$emit('blur');
    }

    private getIcon(): string {
        let icon: string = '';
        switch (this.state) {
            case MBadgeState.Completed:
                icon = 'chip-check';
                break;
            case MBadgeState.Warning:
                icon = 'chip-warning';
                break;
            case MBadgeState.Error:
                icon = 'chip-error';
                break;
            default:
                break;
        }
        return icon;
    }

    private get rightDistance(): string {
        let size = parseInt(this.size, 10);
        let chipSise = parseInt(this.chipSize, 10);
        let realSize = (size / (24 / 18));
        let distance = ((size - realSize) / 2) - (chipSise / 2);
        return distance + 'px';
    }

    private get bottomDistance(): string {
        let chipSise = parseInt(this.chipSize, 10);
        let distance = chipSise * (1 / 4);
        return '-' + distance + 'px';
    }

    private get hasState(): boolean {
        return !!this.state;
    }
}

const BadgePlugin: PluginObject<any> = {
    install(v, options): void {
        console.debug(BADGE, 'plugin.install');
        v.component(BADGE, MBadge);
    }
};

export default BadgePlugin;
