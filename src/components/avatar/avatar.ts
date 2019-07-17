import Vue, { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { AVATAR_NAME } from '../component-names';
import IconPlugin from '../icon/icon';
import WithRender from './avatar.html?style=./avatar.scss';

const SMALL_AVATAR_SIZE: number = 32;

@WithRender
@Component
export class MAvatar extends Vue {

    @Prop({ default: SMALL_AVATAR_SIZE })
    pixelSize: number;

    @Prop({ default: false })
    clickable: boolean;

    hover: boolean = false;

    get sizeStyle(): { [property: string]: string } {
        return {
            width: this.pixelSize + 'px',
            height: this.pixelSize + 'px'
        };
    }

    get defaultAvatar(): string {
        return this.isSmall ? 'm-svg__profile' : 'm-svg__avatar';
    }

    get isSmall(): boolean {
        return this.pixelSize <= SMALL_AVATAR_SIZE;
    }

    mouseOver(): void {
        this.hover = true;
    }

    mouseLeave(): void {
        this.hover = false;
    }

    click(): void {
        if (this.clickable) {
            this.$emit('click');
        }
    }

}

const AvatarPlugin: PluginObject<any> = {
    install(v, options): void {
        v.prototype.$log.debug(AVATAR_NAME, 'plugin.install');
        v.use(IconPlugin);
        v.component(AVATAR_NAME, MAvatar);
    }
};

export default AvatarPlugin;
