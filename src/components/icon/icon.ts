import Vue from 'vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import WithRender from './icon.html?style=./icon.scss';
import { ICON_NAME } from '../component-names';

@WithRender
@Component
export class MIcon extends Vue {
    @Prop({ required: true })
    public icon: string
    @Prop({ default: '1em' })
    public height: string
    @Prop({ default: '1em' })
    public width: string
    @Prop({ default: () => 0 })
    public onClick: any

    private iconContent = '';

    public beforeMount() {
        var vm = this;
        (require as any)(['bundle-loader!../../public/' + vm.$props.icon + '.svg'],
            function (waitForChunk) {
                waitForChunk(function (svg) {
                    vm.iconContent = svg.replace('viewBox', 'width="' + vm.$props.width + '" height="' + vm.$props.height + '" viewBox');
                })
            }
        )
    }
}

const IconPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(ICON_NAME, MIcon);
    }
};

export default IconPlugin;
