import { ModulVue } from '../../utils/vue/vue';
import { PluginObject } from 'vue';
import { Prop, Watch } from 'vue-property-decorator';
import Component from 'vue-class-component';
import { MODAL_NAME } from '../component-names';
import uuid from '../../utils/uuid/uuid';
import WithRender from './modal-window.html?style=../../mixins/base-window/base-window.scss';
import { OpenTrigger, OpenTriggerMixinImpl } from '../../mixins/open-trigger/open-trigger';
import { OpenTriggerHook, OpenTriggerHookMixin } from '../../mixins/open-trigger/open-trigger-hook';
import { MediaQueries, MediaQueriesMixin } from '../../mixins/media-queries/media-queries';

// const TRANSITION_DURATION: number = 300;
// const TRANSITION_DURATION_LONG: number = 600;

@WithRender
@Component({
    mixins: [OpenTrigger, OpenTriggerHook, MediaQueries]
})
export class MModal extends ModulVue implements OpenTriggerMixinImpl {
    @Prop()
    public open: boolean;

    // @Prop({ default: false })
    // public disabled: boolean;

    // @Prop({ default: 'mDialog' })
    // public id: string;

    // private portalTargetEl: HTMLElement;
    // private internalOpen: boolean = false;
    // private propId: string = '';

    // public getPortalTargetElement(): HTMLElement {
    //     return this.portalTargetEl;
    // }

    // protected beforeMount(): void {
    //     this.propId = this.id + '-' + uuid.generate();
    //     let element: HTMLElement = document.createElement('div');
    //     element.setAttribute('id', this.propId);
    //     document.body.appendChild(element);
    // }

    // protected mounted(): void {
    //     this.portalTargetEl = document.getElementById(this.propId) as HTMLElement;
    // }

    // protected beforeDestroy(): void {
    //     document.body.removeChild(this.portalTargetEl);
    // }

    // public get propOpen(): boolean {
    //     return (this.open === undefined ? this.internalOpen : this.open) && !this.disabled;
    // }

    // public set propOpen(value: boolean) {
    //     if (value != this.internalOpen) {
    //         if (value) {
    //             if (this.portalTargetEl) {
    //                 this.$modul.pushElement(this.portalTargetEl);
    //                 this.portalTargetEl.style.position = 'absolute';

    //                 setTimeout(() => {
    //                     this.setFastFocusToElement(this.$refs.article as HTMLElement);
    //                 }, this.transitionDuration);
    //             }

    //             if (value != this.internalOpen) {
    //                 this.$emit('open');
    //             }
    //         } else {
    //             if (this.portalTargetEl) {
    //                 this.$modul.popElement(this.portalTargetEl, true);

    //                 setTimeout(() => {
    //                     // $emit update:open has been launched, animation already occurs

    //                     this.portalTargetEl.style.position = '';
    //                     let trigger: HTMLElement | undefined = this.as<OpenTriggerHookMixin>().triggerHook;
    //                     if (trigger) {
    //                         this.setFastFocusToElement(trigger);
    //                     }
    //                 }, this.transitionDuration);
    //             }
    //             if (value != this.internalOpen) {
    //                 // really closing, reset focus
    //                 this.$emit('close');
    //             }
    //         }
    //     }
    //     this.internalOpen = value;
    //     this.$emit('update:open', value);
    // }

    // @Watch('open')
    // private openChanged(open: boolean): void {
    //     this.propOpen = open;
    // }

    public handlesFocus(): boolean {
        return true;
    }

    public doCustomPropOpen(value: boolean): void {
        // nothing
    }

    public hasBackdrop(): boolean {
        return true;
    }

    public getPortalElement(): HTMLElement {
        return this.$refs.article as HTMLElement;
    }

    // private setFastFocusToElement(el: HTMLElement): void {
    //     el.setAttribute('tabindex', '0');
    //     el.focus();
    //     el.blur();
    //     el.removeAttribute('tabindex');
    // }

    // private get transitionDuration(): number {
    //     return this.as<MediaQueriesMixin>().isMqMaxS ? TRANSITION_DURATION_LONG : TRANSITION_DURATION;
    // }

    private onOk(): void {
        // this.propOpen = false;
        this.$emit('ok');
    }

    private onCancel(): void {
        // this.propOpen = false;
        this.$emit('cancel');
    }

    private get hasDefaultSlot(): boolean {
        // todo: header or title?
        return !!this.$slots.default;
    }

    private get hasFooterSlot(): boolean {
        return !!this.$slots.footer;
    }
}

const ModalPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(MODAL_NAME, MModal);
    }
};

export default ModalPlugin;
