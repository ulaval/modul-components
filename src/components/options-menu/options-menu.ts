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

    @Watch('open')
    private openChanged(value): void {
        this.isOpen = value;
    }

    private mounted(): void {
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

    private onShow(): void {
        this.isOpen = true;
        this.$emit('show');
    }

    private onHide(): void {
        this.isOpen = false;
        this.$emit('hide');
    }

    private onItemClick(): void {
        this.isOpen = false;
    }

    private animEnter(element, done) {
        this.$refs['menu']['style']['transitionProperty'] = 'margin-top, opacity';
        this.$refs['menu']['style']['transitionDuration'] = '0.3s';
        this.$refs['menu']['style']['marginTop'] = '0';
        this.$refs['menu']['style']['opacity'] = '0';
        this.$refs['menu']['style']['zIndex'] = '10';
        done();
    }

    private animAfterEnter(element) {
        Vue.nextTick(() => {
            this.$refs['menu']['style']['marginTop'] = '-20px';
            this.$refs['menu']['style']['opacity'] = '1';
        });
    }
}

const MenuPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(OPTIONS_MENU_NAME, MOptionsMenu);
    }
};

export default MenuPlugin;
