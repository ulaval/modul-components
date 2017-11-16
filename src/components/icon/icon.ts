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
    public size: string;

    protected beforeMount(): void {
        if (!document.getElementById(this.name)) {
            console.warn( '"' + this.name + '" is not a valid svg id. Make sure that the sprite has been loaded via the $svg instance service.');
        }
    }

    private get hasSvgTitle(): boolean {
        return !!this.svgTitle;
    }

    private get spriteId(): string {
        return '#' + this.name;
    }

    private onClick(event): void {
        this.$emit('click', event);
    }
}

const IconPlugin: PluginObject<any> = {
    install(v, options) {
        console.debug(ICON_NAME, 'plugin.install');
        v.component(ICON_NAME, MIcon);
    }
};

export default IconPlugin;
