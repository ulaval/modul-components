import Vue, { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import WithRender from './template.html?style=./template.scss';
import { TEMPLATE_NAME } from '../component-names';
import { MediaQueries, MediaQueriesMixin } from '../../mixins/media-queries';

@WithRender
@Component({
    mixins: [
        MediaQueries
    ]
})
export class Mtemplate extends Vue {
    @Prop()
    public title: string;

    private mounted(): void {
        console.log(this.$slots);
    }

    public get hasColumn(): boolean {
        return !!this.$slots['column'];
    }

    public get hasFooter(): boolean {
        return !!this.$slots['footer'];
    }
}

const Template: PluginObject<any> = {
    install(v, options) {
        v.component(TEMPLATE_NAME, Mtemplate);
    }
};

export default Template;
