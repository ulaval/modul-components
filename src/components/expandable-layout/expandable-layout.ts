import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { ModulVue } from '../../utils/vue/vue';
import { EXPANDABLE_LAYOUT_NAME } from '../component-names';
import WithRender from './expandable-layout.html?style=./expandable-layout.scss';

export enum MExpandableLayoutPanelPosition {
    Left = 'left',
    Right = 'right'
}
@WithRender
@Component
export class MExpandableLayout extends ModulVue {
    @Prop({
        default: false
    })
    public open: boolean;

    @Prop({
        default: MExpandableLayoutPanelPosition.Left,
        validator: value =>
            value === MExpandableLayoutPanelPosition.Left ||
            value === MExpandableLayoutPanelPosition.Right
    })
    public panelPosition: MExpandableLayoutPanelPosition;

    @Prop({ default: '320px' })
    panelWidth: string;

    @Prop({ default: 'auto' })
    panelHeight: string;

    get panelPositionClass(): string {
        return `m--has-${this.panelPosition}-panel`;
    }

    get panelStyle(): { [prop: string]: string } {
        return {
            width: this.open ? this.panelWidth : '0',
            height: this.panelHeight
        };
    }

    get panelContentStyle(): { width: string } {
        return {
            width: this.panelWidth
        };
    }
}

const ExpandableLayoutPlugin: PluginObject<any> = {
    install(v, options): void {
        v.component(EXPANDABLE_LAYOUT_NAME, MExpandableLayout);
    }
};

export default ExpandableLayoutPlugin;
