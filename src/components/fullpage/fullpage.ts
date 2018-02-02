import { PluginObject } from 'vue';
import { ModulVue } from '../../utils/vue/vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { FULLPAGE_NAME } from '../component-names';
import { Portal, PortalMixin, PortalMixinImpl } from '../../mixins/portal/portal';
import WithRender from './fullpage.html?style=./fullpage.scss';
import { log } from 'util';

export enum MSidebarOrigin {
    Bottom = 'bottom'
}

@WithRender
@Component({
    mixins: [Portal]
})
export class MFullpage extends ModulVue implements PortalMixinImpl {

    @Prop({
        default: MSidebarOrigin.Bottom,
        validator: value =>
            value == MSidebarOrigin.Bottom
    })
    public origin: MSidebarOrigin;

    @Prop({ default: true })
    public closeButton: boolean;
    @Prop({ default: true })
    public menuButton: boolean;
    @Prop({ default: true })
    public center: boolean;

    @Prop({ default: true })
    public focusManagement: boolean;

    public get popupBody(): any {
        return (this.$refs.article as Element).querySelector('.m-popup__body');
    }

    public handlesFocus(): boolean {
        return this.focusManagement;
    }

    public doCustomPropOpen(value: boolean): boolean {
        return false;
    }

    public get hasMenuButton(): boolean {
        return this.menuButton;
    }

    public get isCentered(): boolean {
        return this.center;
    }

    public hasBackdrop(): boolean {
        return false;
    }

    public menageScroll(): boolean {
        return true;
    }

    public getPortalElement(): HTMLElement {
        return this.$refs.article as HTMLElement;
    }

    private closeDialog(): void {
        this.as<PortalMixin>().tryClose();
    }

    private menu(event): void {
        this.$emit('open-menu', event);
        console.log('menu clicked');
    }

}

const FullpagePlugin: PluginObject<any> = {
    install(v, options) {
        v.component(FULLPAGE_NAME, MFullpage);
    }
};

export default FullpagePlugin;
