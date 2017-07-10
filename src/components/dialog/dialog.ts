import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { ModulVue } from '../../utils/vue/vue';
import { Prop, Watch } from 'vue-property-decorator';
import WithRender from './dialog.html?style=./dialog.scss';
import { DIALOG_NAME } from '../component-names';
import uuid from '../../utils/uuid/uuid';
import { MediaQueries } from '../../../src/mixins/media-queries/media-queries';

const MODE_PRIMARY = 'primary';
const MODE_SECONDARY = 'secondary';
const MODE_PANEL = 'panel';

const TRANSITION_DURATION = 300;
const TRANSITION_DURATION_LONG = 600;

@WithRender
@Component({
    mixins: [MediaQueries]
})
export class MDialog extends ModulVue {
    @Prop({ default: MODE_PRIMARY })
    public mode: string;
    @Prop({ default: 'mDialog' })
    public id: string;
    @Prop()
    public className: string;
    @Prop({ default: false })
    public isOpen: boolean;
    @Prop({ default: 'body' })
    public targetElement: string;
    @Prop({ default: '' })
    public title: string;
    @Prop()
    public isCloseOnBackdrop: boolean;

    public componentName: string = DIALOG_NAME;

    private propsIsOpen: boolean = false;
    private propsId: string = 'mDialog';
    private propsTargetElement: HTMLElement = document.body;
    private elementPortalTarget: HTMLElement = document.createElement('div');
    private propsIsCloseOnBackdrop: boolean;
    private nbDialog: number = 0;
    private isVisible: boolean = false;
    private isAnimActive: boolean = false;
    private isScreenMinS: boolean;
    private transitionDuration: number = TRANSITION_DURATION;

    @Watch('targetElement')
    private setTargetElement(newTagetElement): void {
        this.propsTargetElement = document.querySelector(newTagetElement) as HTMLElement;
    }

    @Watch('isOpen')
    private isOpenChanged(newValue): void {
        this.propsIsOpen = newValue;
        if (this.propsIsOpen) {
            this.openDialog();
        } else {
            this.closeDialog();
        }
    }

    private beforeMount(): void {
        this.setTargetElement(this.targetElement);
        if (this.isOpen) {
            this.openDialog();
        }
    }

    private destroyed(): void {
        if (this.propsIsOpen) {
            this.deleteDialog();
        }
    }

    private openDialog(event = undefined): void {
        if (!this.isAnimActive) {
            this.createDialog();
            this.propsIsOpen = true;
            this.isAnimActive = true;
            setTimeout(() => {
                this.isVisible = true;
            }, 2);
            setTimeout(() => {
                this.isAnimActive = false;
            }, this.transitionDuration);
            ModulVue.nextTick(() => {
                this.$refs.dialogWrap['setAttribute']('tabindex', '0');
                this.$refs.dialogWrap['focus']();
                this.$refs.dialogWrap['removeAttribute']('tabindex');
            });
            this.$emit('toggleOpen', true);
        }
    }

    private closeDialog(event = undefined): void {
        if (!this.isAnimActive) {
            this.isVisible = false;
            this.isAnimActive = true;
            this.$mWindow.backdropElement.style.zIndex = String(this.$mWindow.windowZIndex - 1);
            if (this.$mWindow.windowCount == 1) {
                this.$mWindow.backdropElement.style.opacity = '0';
            }
            setTimeout(() => {
                this.propsIsOpen = false;
                this.deleteDialog();
                this.isAnimActive = false;
                this.$emit('toggleIsOpen', false);
                ModulVue.nextTick(() => {
                    this.$refs.dialogButton['setAttribute']('tabindex', '0');
                    this.$refs.dialogButton['focus']();
                    this.$refs.dialogButton['removeAttribute']('tabindex');
                });
            }, this.transitionDuration);
        }
    }

    private createDialog() {
        this.propsId = this.id + '-' + uuid.generate();
        this.elementPortalTarget.setAttribute('id', this.propsId);
        this.elementPortalTarget.setAttribute('class', 'm-dialog-popover');
        this.elementPortalTarget.style.position = 'relative';

        if (this.$mWindow.windowCount == 0) {
            this.addFirstDialog();
        } else {
            this.propsTargetElement.appendChild(this.elementPortalTarget);
            this.addDialog();
        }
    }

    private deleteDialog() {
        let elementPortalTarget: HTMLElement = this.getElementPortalTarget();
        if (elementPortalTarget) {
            elementPortalTarget.remove();
        }
        this.$mWindow.deleteWindow(this.propsId);
    }

    private addFirstDialog() {
        this.$mWindow.addWindow(this.propsId);
        this.elementPortalTarget.style.zIndex = String(this.$mWindow.windowZIndex);
        this.$mWindow.createBackdrop(this.propsTargetElement);
        this.propsTargetElement.appendChild(this.elementPortalTarget);
    }

    private addDialog() {
        let elementPortalTarget: HTMLElement = this.getElementPortalTarget();
        elementPortalTarget.style.position = 'relative';
        this.$mWindow.addWindow(this.propsId);
        elementPortalTarget.style.zIndex = String(this.$mWindow.windowZIndex);
    }

    private backdropClick(event): void {
        if (this.propsIsCloseOnBackdrop) {
            this.closeDialog(event);
        }
    }

    private getElementPortalTarget(): HTMLElement {
        return document.querySelector('#' + this.propsId) as HTMLElement;
    }

    private get propsMode(): string {
        let mode: string = this.mode == MODE_SECONDARY || this.mode == MODE_PANEL ? this.mode : MODE_PRIMARY;
        switch (mode) {
            case MODE_SECONDARY:
                this.propsIsCloseOnBackdrop = this.isCloseOnBackdrop == undefined ? true : this.isCloseOnBackdrop;
                this.transitionDuration = this.isScreenMinS ? TRANSITION_DURATION_LONG : TRANSITION_DURATION;
                break;
            case MODE_PANEL:
                this.propsIsCloseOnBackdrop = this.isCloseOnBackdrop == undefined ? true : this.isCloseOnBackdrop;
                this.transitionDuration = TRANSITION_DURATION_LONG;
                break;
            default:
                this.propsIsCloseOnBackdrop = this.isCloseOnBackdrop == undefined ? false : this.isCloseOnBackdrop;
                this.transitionDuration = TRANSITION_DURATION;
        }
        return mode;
    }

    private get hasTitle(): boolean {
        return this.title == '' ? false : true;
    }

    private get hasDefaultSlots(): boolean {
        return !!this.$slots.default;
    }

    private get hasHeaderSlot(): boolean {
        return !!this.$slots.header;
    }

    private get hasFooterSlot(): boolean {
        return !!this.$slots.footer;
    }
}

const DialogPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(DIALOG_NAME, MDialog);
    }
};

export default DialogPlugin;
