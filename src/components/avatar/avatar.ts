import Vue, { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { AVATAR_NAME } from '../component-names';
import IconPlugin from '../icon/icon';
import WithRender from './avatar.html?style=./avatar.scss';

export enum MAvatarShape {
    CIRCLE = 'circle',
    SQUARE = 'square'
}

@WithRender
@Component
export class MAvatar extends Vue {

    @Prop({ default: MAvatarShape.CIRCLE })
    shape: MAvatarShape;

    @Prop({ required: true })
    size: string;

    @Prop({ default: false })
    clickable: boolean;

    hover: boolean = false;


    get sizeStyle(): { [property: string]: string } {
        return {
            width: this.size,
            height: this.size
        };
    }

    get avatarClass(): { [property: string]: boolean } {
        return {
            'm--is-circle': this.shape === MAvatarShape.CIRCLE,
            'm--is-clickable': this.clickable
        };
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
