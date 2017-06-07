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
    public icon: string;
    @Prop()
    public title: string;
    @Prop({ default: '1em' })
    public height: string;
    @Prop({ default: '1em' })
    public width: string;

    private iconContent = '';

    private onClick(event) {
        this.$emit('onClick', event);
    }

    private modifyTitle(svg): string {
        if (this.$props.title) {
            return svg.replace(/<title>[^<]*/, '<title>' + this.$props.title);
        }
        return svg;
    }

    public beforeMount() {
        let vm = this;
        (require as any)(['bundle-loader!../../public/icons/' + vm.$props.icon + '.svg'],
            function(waitForChunk) {
                waitForChunk(function(svg) {
                    vm.iconContent = vm.modifyTitle(svg).replace('viewBox', 'width="' + vm.$props.width + '" height="' + vm.$props.height + '" viewBox');
                });
            }
        );
    }
}

const IconPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(ICON_NAME, MIcon);
    }
};

export default IconPlugin;
