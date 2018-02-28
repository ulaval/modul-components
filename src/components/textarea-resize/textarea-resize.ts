import { ModulVue } from '../../utils/vue/vue';
import { PluginObject } from 'vue';
import { Prop, Watch } from 'vue-property-decorator';
import Component from 'vue-class-component';
import WithRender from './textarea-resize.html?style=./textarea-resize.scss';
import { TEXTAREA_RESIZE_NAME } from '../component-names';
import { InputManagement } from '../../mixins/input-management/input-management';

@WithRender
@Component({
    mixins: [InputManagement]
})
export class MTextareaResize extends ModulVue {
    @Prop()
    public disabled: boolean;

    private textareaHeight: string;

    public resize(): void {
        this.adjustHeight();
    }

    protected mounted(): void {
        this.adjustHeight();
    }

    @Watch('value')
    private valueChanged(): void {
        this.adjustHeight();
    }

    private adjustHeight(): void {
        let el: HTMLTextAreaElement = (this.$refs.input as HTMLTextAreaElement);
        el.style.height = 'auto';
        if (el.value && el.scrollHeight != 0) {
            el.style.height = el.scrollHeight + 'px';
        }
    }
}

const TextareaResizePlugin: PluginObject<any> = {
    install(v, options): void {
        console.warn(TEXTAREA_RESIZE_NAME + ' is not ready for production');
        v.component(TEXTAREA_RESIZE_NAME, MTextareaResize);
    }
};

export default TextareaResizePlugin;
