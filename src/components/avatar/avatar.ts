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
    timeoutContentVisible: any = undefined;

    created(): void {
        document.addEventListener('click', this.onDocumentClick);
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
        return this.isHovered || this.isTouched;
    }

    setHover(hover: boolean): void {
        this.focusDisplay(false);
        this.isHovered = hover;
    }

    focusDisplay(focusVisible: boolean): void {
        this.isFocusVisible = focusVisible;
    }

    onClick(): void {
        this.focusDisplay(false);
        if (this.clickable) {
            this.emitClick();
        }
    }

    onTouchend(): void {
        this.focusDisplay(false);
        if (this.clickable) {
            if (this.isTouched) {
                clearTimeout(this.timeoutContentVisible);
                this.isTouched = false;
                this.emitTouch();
            } else {
                this.isTouched = true;
                this.timeoutContentVisible = setTimeout(() => {
                    this.isTouched = false;
                }, 5000);
            }
        }
    }

    private onDocumentClick(): void {
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
