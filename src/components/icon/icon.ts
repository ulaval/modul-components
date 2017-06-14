import Vue from 'vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import WithRender from './icon.html?style=./icon.scss';
import { ICON_NAME } from '../component-names';

@WithRender
@Component
export class MIcon extends Vue {
    @Prop({ default: 'default' })
    public name: string;
    @Prop()
    public svgTitle: string;
    @Prop({ default: '100%' })
    public width: string;
    @Prop({ default: '100%' })
    public height: string;

    private componentName = ICON_NAME;

    private propsWidth: string;
    private propsHeight: string;
    private propsSvgTitle: string;
    private iconContent = '';

    private beforeMount(): void {
        let vm = this;
        this.propsSvgTitle = this.$props.svgTitle;
        this.propsWidth = this.$props.width;
        this.propsHeight = this.$props.height;
        (require as any)(['bundle-loader!../../assets/icons/' + vm.$props.name + '.svg'], waitForChunk => {
            waitForChunk(svg => {
                this.iconContent = this.modifyTitle(svg).replace('viewBox', 'width="' + this.propsWidth + '" height="' + this.propsHeight + '" viewBox');
            });
        });
    }

    private onClick(event): void {
        this.$emit('onClick', event);
    }

    private modifyTitle(svg): string {
        if (this.$props.svgTitle) {
            return svg.replace(/<title>[^<]*/, '<title>' + this.$props.svgTitle);
        }
        return svg;
    }

    private get hasSvgTitle(): boolean {
        return !!this.propsSvgTitle;
    }
}

const IconPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(ICON_NAME, MIcon);
    }
};

export default IconPlugin;
