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
    @Prop({ default: '1em' })
    public height: string;
    @Prop({ default: '1em' })
    public width: string;

    private iconContent = '';

    public beforeMount() {
        let vm = this;
        (require as any)(['bundle-loader!../../assets/icons/' + vm.$props.name + '.svg'], waitForChunk => {
            waitForChunk(svg => {
                this.iconContent = this.modifyTitle(svg).replace('viewBox', 'width="' + this.$props.width + '" height="' + this.$props.height + '" viewBox');
            });
        });
    }

    private onClick(event) {
        this.$emit('onClick', event);
    }

    private modifyTitle(svg): string {
        if (this.$props.svgTitle) {
            return svg.replace(/<title>[^<]*/, '<title>' + this.$props.svgTitle);
        }
        return svg;
    }
}

const IconPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(ICON_NAME, MIcon);
    }
};

export default IconPlugin;
