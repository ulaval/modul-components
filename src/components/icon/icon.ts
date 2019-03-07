import Vue, { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Emit, Prop } from 'vue-property-decorator';
import { ICON_NAME } from '../component-names';
import WithRender from './icon.html?style=./icon.scss';

@WithRender
@Component
export class MIcon extends Vue {
    @Prop({ required: true })
    public name: string;
    @Prop()
    public svgTitle: string;
    @Prop({ default: '20px' })
    public size: string;

    @Prop({ default: false })
    public showNameAsClass: boolean;

    @Emit('click')
    onClick(event: Event): void { }

    @Emit('keydown')
    onKeydown(event: Event): void { }

    private get hasSvgTitle(): boolean {
        return !!this.svgTitle;
    }

    private get spriteId(): string | undefined {
        if (document.getElementById(this.name)) {
            return '#' + this.name;
        } else if (document.getElementById('m-svg__' + this.name)) {
            return '#m-svg__' + this.name;
        } else if (this.name) {
            Vue.prototype.$log.warn('"' + this.name + '" is not a valid svg id. Make sure that the sprite has been loaded via the $svg instance service.');
        }
    }

    private get showNameAsClassInHtml(): string {
        return this.showNameAsClass ? this.name : '';
    }
}

const IconPlugin: PluginObject<any> = {
    install(v, options): void {
        v.prototype.$log.debug(ICON_NAME, 'plugin.install');
        v.component(ICON_NAME, MIcon);
    }
};

export default IconPlugin;
