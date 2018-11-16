import Vue, { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Emit, Prop } from 'vue-property-decorator';
import { TITLE_NAME } from '../component-names';
import WithRender from './title.html?style=./title.scss';

export enum MTitleLevel {
    H1 = 1,
    H2 = 2,
    H3 = 3,
    H4 = 4,
    H5 = 5,
    H6 = 6
}

export enum MTitleSkin {
    H1 = 'h1',
    H2 = 'h2',
    H3 = 'h3',
    H4 = 'h4',
    H5 = 'h5',
    H6 = 'h6'
}

@WithRender
@Component
export class MTitle extends Vue {

    @Prop({
        default: MTitleLevel.H2,
        validator: value =>
            value === MTitleLevel.H1 ||
            value === MTitleLevel.H2 ||
            value === MTitleLevel.H3 ||
            value === MTitleLevel.H4 ||
            value === MTitleLevel.H5 ||
            value === MTitleLevel.H6
    })
    public level: MTitleLevel;

    @Prop({
        validator: value =>
            value === MTitleSkin.H1 ||
            value === MTitleSkin.H2 ||
            value === MTitleSkin.H3 ||
            value === MTitleSkin.H4 ||
            value === MTitleSkin.H5 ||
            value === MTitleSkin.H6
    })
    public skin: MTitleSkin;

    @Prop({ default: true })
    public margin: boolean;

    @Prop()
    public border: boolean;

    @Emit('click')
    onClick(event: Event): void {
        this.$emit('click', event);
    }

    private get componentSkin(): string {
        return this.skin === undefined ? ('h' + this.level) : this.skin;
    }
}

const TitlePlugin: PluginObject<any> = {
    install(v, options): void {
        v.prototype.$log.debug(TITLE_NAME, 'plugin.install');
        v.component(TITLE_NAME, MTitle);
    }
};

export default TitlePlugin;
