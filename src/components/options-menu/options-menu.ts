import Vue from 'vue';
import { ModulVue } from '../../utils/vue/vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import WithRender from './options-menu.html?style=./options-menu.scss';
import { OPTIONS_MENU_NAME } from '../component-names';
import { MediaQueries } from '../../mixins/media-queries/media-queries';

@WithRender
@Component({
    mixins: [
        MediaQueries
    ]
})
export class MOptionsMenu extends ModulVue {

    @Prop({ default: 'click' })
    public trigger: string;
    @Prop({ default: () => ({ placement: 'bottom' }) })
    public options: any;
    @Prop({ default: false })
    public disabled: boolean;
    @Prop({ default: false })
    public open: boolean;

    public isScreenMaxS: boolean;

    private isOpen: boolean = this.open;

    private fullWidth: number;
    private fullHeight: number;

    protected mounted(): void {
        let containsIcon: boolean = false;
        let containsText: boolean = false;
        this.$children[0].$children.forEach((child) => {
            if (child.$refs['m-options-menu-item']) {
                if (child['hasIcon']) containsIcon = true;
                if (child['hasSlot']) containsText = true;
            }
        });
        // add classes for padding right of icon or left of text
        if (containsIcon ? !containsText : containsText) {
            this.$children[0].$children.forEach((child) => {
                if (child.$refs['m-options-menu-item']) {
                    if (!containsIcon) {
                        child.$refs['icon']['className'] += ' is-empty';
                    } else {
                        child.$refs['text']['className'] += ' is-empty';
                    }
                }
            });
        }
    }

    @Watch('open')
    private openChanged(value): void {
        this.isOpen = value;
    }

    private onShow(): void {
        this.isOpen = true;
        this.$emit('show');
    }

    private onHide(): void {
        this.isOpen = false;
        this.$emit('hide');
    }

    private onEnter(el: HTMLElement, done) {
        if (!this.fullHeight && !this.fullWidth) {
            this.fullWidth = el.clientWidth;
            this.fullHeight = el.clientHeight;
            this.$refs['menu']['style']['position'] = 'absolute';
            this.$refs['menu']['style']['width'] = this.fullWidth + 'px';
            this.$refs['menu']['style']['height'] = this.fullHeight + 'px';
        }
        el.style.transitionProperty = 'margin-top, opacity, width, height';
        el.style.transitionDuration = '0.3s';
        el.style.marginTop = '20px';
        el.style.opacity = '0';
        el.style.width = '0';
        el.style.height = '0';
        done();
    }

    private onAfterEnter(el: HTMLElement) {
        Vue.nextTick(() => {
            el.style.marginTop = '0';
            el.style.opacity = '1';
            el.style.width = this.fullWidth + 'px';
            el.style.height = this.fullHeight + 'px';
        });
    }
}

const MenuPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(OPTIONS_MENU_NAME, MOptionsMenu);
    }
};

export default MenuPlugin;
