import 'flag-icon-css/css/flag-icon.min.css';
import Vue, { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Emit, Prop } from 'vue-property-decorator';
import { ModulVue } from '../../utils/vue/vue';
import { FLAG_NAME } from '../component-names';
import WithRender from './flag.html?style=./flag.scss';

@WithRender
@Component
export class MFlag extends ModulVue {
    @Prop({ required: true })
    public iso: string;
    @Prop()
    public title: string;
    @Prop({ default: '20px' })
    public size: string;
    @Prop({ default: false })
    public squared: boolean;

    @Emit('click')
    onClick(event: Event): void { }

    @Emit('keydown')
    onKeydown(event: Event): void { }

    private get hasTitle(): boolean {
        return !!this.title;
    }

    private get height(): string {
        return this.size;
    }

    private get width(): string {
        return ((parseInt(this.size, 10) * 4) / 3) + 'px';
    }

    private get spriteId(): string | undefined {
        if (document.getElementById('m-svg__flag-' + this.iso)) {
            return '#m-svg__flag-' + this.iso;
        } else if (this.iso) {
            Vue.prototype.$log.warn('"' + this.iso + '" is not a valid iso country. Make sure that the sprite has been loaded via the $svg instance service.');
        }
    }

}

const FlagPlugin: PluginObject<any> = {
    install(v): void {
        v.prototype.$log.debug(FLAG_NAME, 'plugin.install');
        v.component(FLAG_NAME, MFlag);
    }
};

export default FlagPlugin;
