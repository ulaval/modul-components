import Vue, { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Emit, Prop } from 'vue-property-decorator';
import { AVATAR_NAME } from '../component-names';
import IconPlugin from '../icon/icon';
import WithRender from './avatar.html?style=./avatar.scss';

export enum MAvatarSize {
    SMALL = 32,
    MEDIUM = 64,
    LARGE = 192
}

@WithRender
@Component
export class MAvatar extends Vue {

    @Prop({
        default: MAvatarSize.SMALL,
        validator: value =>
            value === MAvatarSize.SMALL ||
            value === MAvatarSize.MEDIUM ||
            value === MAvatarSize.LARGE
    })
    size: MAvatarSize;

    @Prop({ default: false })
    clickable: boolean;

    isFocusVisible: boolean = false;
    isHovered: boolean = false;
    isTouched: boolean = false;
    timeoutContentVisible: number = 0;

    destroy(): void {
        this.resetTouch();
    }

    get sizeStyle(): { [property: string]: string } {
        return {
            width: this.size + 'px',
            height: this.size + 'px'
        };
    }

    get defaultAvatar(): string {
        return this.isSmall ? 'm-svg__profile' : 'm-svg__avatar';
    }

    get isSmall(): boolean {
        return this.size === MAvatarSize.SMALL;
    }

    get tabindex(): number {
        return this.clickable ? 0 : -1;
    }

    get interactionClass(): { [property: string]: boolean } {
        return {
            'm--is-clickable': this.clickable,
            'm--is-focus-visible': this.isFocusVisible
        };
    }

    get showContent(): boolean {
        return this.hover || this.isTouched;
    }

    get isEmptyContentSlot(): boolean {
        return !this.$scopedSlots.content;
    }

    get hover(): boolean {
        return this.isHovered;
    }

    set hover(hover: boolean) {
        this.isHovered = hover;
    }

    focusDisplay(focusVisible: boolean): void {
        this.isFocusVisible = focusVisible;
    }

    onClick(): void {
        if (this.clickable) {
            this.emitClick();
        }
    }

    onTouchend(): void {
        if (this.clickable) {
            if (this.isTouched || this.isEmptyContentSlot) {
                this.resetTouch();
                this.emitTouch();
            } else {
                this.$modul.event.$on('click', this.resetTouch);
                this.isTouched = true;
                this.timeoutContentVisible = window.setTimeout(() => {
                    this.isTouched = false;
                }, 5000);
            }
        }
    }

    private resetTouch(): void {
        this.$modul.event.$off('click', this.resetTouch);
        clearTimeout(this.timeoutContentVisible);
        this.isTouched = false;
    }

    @Emit('touch')
    emitTouch(): void { }

    @Emit('click')
    emitClick(): void { }

}

const AvatarPlugin: PluginObject<any> = {
    install(v): void {
        v.prototype.$log.debug(AVATAR_NAME, 'plugin.install');
        v.use(IconPlugin);
        v.component(AVATAR_NAME, MAvatar);
    }
};

export default AvatarPlugin;
