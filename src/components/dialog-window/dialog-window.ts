import { ModulVue } from '../../utils/vue/vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import WithRender from './dialog-window.html?style=../../mixins/base-window/base-window.scss';
import { Prop, Watch } from 'vue-property-decorator';
import { DIALOG_NAME } from '../component-names';
import { OpenTrigger, OpenTriggerMixinImpl } from '../../mixins/open-trigger/open-trigger';
import { OpenTriggerHook, OpenTriggerHookMixin } from '../../mixins/open-trigger/open-trigger-hook';
import { MediaQueries, MediaQueriesMixin } from '../../mixins/media-queries/media-queries';
import uuid from '../../utils/uuid/uuid';

const TRANSITION_DURATION: number = 300;
const TRANSITION_DURATION_LONG: number = 600;

export enum MDialogSize {
    FullSize = 'full-size',
    Large = 'large',
    Default = 'default',
    Small = 'small'
}

@WithRender
@Component({
    mixins: [OpenTrigger, OpenTriggerHook, MediaQueries]
})
export class MDialog extends ModulVue implements OpenTriggerMixinImpl {
    @Prop({
        default: MDialogSize.Default,
        validator: value =>
            value == MDialogSize.Default ||
            value == MDialogSize.FullSize ||
            value == MDialogSize.Large ||
            value == MDialogSize.Small
    })
    public size: string;

    @Prop()
    public open: boolean;

    @Prop({ default: false })
    public disabled: boolean;

    @Prop({ default: 'mDialog' })
    public id: string;

    @Prop({ default: true })
    public closeOnBackdrop: boolean;

    @Prop()
    public title: string;

    private portalTargetEl: HTMLElement;
    private internalOpen: boolean = false;
    private propId: string = '';

    public getPortalTargetElement(): HTMLElement {
        return this.portalTargetEl;
    }

    protected beforeMount(): void {
        this.propId = this.id + '-' + uuid.generate();
        let element: HTMLElement = document.createElement('div');
        element.setAttribute('id', this.propId);
        document.body.appendChild(element);
    }

    protected mounted(): void {
        this.portalTargetEl = document.getElementById(this.propId) as HTMLElement;
    }

    protected beforeDestroy(): void {
        document.body.removeChild(this.portalTargetEl);
    }

    public get propOpen(): boolean {
        return (this.open === undefined ? this.internalOpen : this.open) && !this.disabled;
    }

    public set propOpen(value: boolean) {
        if (value != this.internalOpen) {
            if (value) {
                if (this.portalTargetEl) {
                    this.$modul.pushElement(this.portalTargetEl);
                    this.portalTargetEl.style.position = 'absolute';

                    setTimeout(() => {
                        this.setFastFocusToElement(this.$refs.article as HTMLElement);
                    }, this.transitionDuration);
                }

                if (value != this.internalOpen) {
                    this.$emit('open');
                }
            } else {
                if (this.portalTargetEl) {
                    this.$modul.popElement(this.portalTargetEl, true);

                    setTimeout(() => {
                        // $emit update:open has been launched, animation already occurs

                        this.portalTargetEl.style.position = '';
                        let trigger: HTMLElement | undefined = this.as<OpenTriggerHookMixin>().triggerHook;
                        if (trigger) {
                            this.setFastFocusToElement(trigger);
                        }
                    }, this.transitionDuration);
                }
                if (value != this.internalOpen) {
                    // really closing, reset focus
                    this.$emit('close');
                }
            }
        }
        this.internalOpen = value;
        this.$emit('update:open', value);
    }

    @Watch('open')
    private openChanged(open: boolean): void {
        this.propOpen = open;
    }

    private setFastFocusToElement(el: HTMLElement): void {
        el.setAttribute('tabindex', '0');
        el.focus();
        el.blur();
        el.removeAttribute('tabindex');
    }

    private get transitionDuration(): number {
        return this.as<MediaQueriesMixin>().isMqMaxS ? TRANSITION_DURATION_LONG : TRANSITION_DURATION;
    }

    private get hasDefaultSlot(): boolean {
        // todo: header or title?
        return !!this.$slots.default;
    }

    private get hasHeader(): boolean {
        return this.hasTitle || !!this.$slots.header;
    }

    private get hasTitle(): boolean {
        return !!this.title;
    }

    private backdropClick(): void {
        if (this.closeOnBackdrop) {
            this.propOpen = false;
        }
    }

    private closeDialog(): void {
        this.propOpen = false;
    }
}

const DialogPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(DIALOG_NAME, MDialog);
    }
};

export default DialogPlugin;
