import Vue, { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import WithRender from './badge.html?style=./badge.scss';
import { BADGE_NAME } from '../component-names';
import IconPlugin from '../icon/icon';
import SpinnerPlugin from '../spinner/spinner';

@WithRender
@Component
export class MBadge extends Vue {

    @Prop()
    public disabled: boolean;
    @Prop()
    public waiting: boolean;

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
}

const BadgePlugin: PluginObject<any> = {
    install(v, options): void {
        console.debug(BADGE_NAME, 'plugin.install');
        v.use(IconPlugin);
        v.component(BADGE_NAME, MBadge);
    }
};

export default BadgePlugin;
