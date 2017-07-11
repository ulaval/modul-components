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
    public open: boolean;
    @Prop({ default: 'body' })
    public targetElement: string;
    @Prop({ default: '' })
    public title: string;
    @Prop()
    public closeOnBackdrop: boolean;

    public componentName: string = DIALOG_NAME;

    private propOpen: boolean = false;
    private propId: string = 'mDialog';
    private propTargetElement: HTMLElement = document.body;
    private elementPortalTarget: HTMLElement = document.createElement('div');
    private propCloseOnBackdrop: boolean;
    private nbDialog: number = 0;
    private isVisible: boolean = false;
    private isAnimActive: boolean = false;
    private isScreenMinS: boolean;
    private transitionDuration: number = TRANSITION_DURATION;

    @Watch('targetElement')
    private setTargetElement(newTagetElement): void {
        this.propTargetElement = document.querySelector(newTagetElement) as HTMLElement;
    }

    @Watch('open')
    private isOpenChanged(newValue): void {
        this.propOpen = newValue;
        if (this.propOpen) {
            this.openDialog();
        } else {
            this.closeDialog();
        }
    }

    private beforeMount(): void {
        this.setTargetElement(this.targetElement);
        if (this.open) {
            this.openDialog();
        }
    }

    private destroyed(): void {
        if (this.propOpen) {
            this.deleteDialog();
        }
    }

    private openDialog(event = undefined): void {
        if (!this.isAnimActive) {
            this.createDialog();
            this.propOpen = true;
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
                this.propOpen = false;
                this.deleteDialog();
                this.isAnimActive = false;
                this.$emit('toggleOpen', false);
                ModulVue.nextTick(() => {
                    this.$refs.dialogButton['setAttribute']('tabindex', '0');
                    this.$refs.dialogButton['focus']();
                    this.$refs.dialogButton['removeAttribute']('tabindex');
                });
            }, this.transitionDuration);
        }
    }

    private createDialog() {
        this.propId = this.id + '-' + uuid.generate();
        this.elementPortalTarget.setAttribute('id', this.propId);
        this.elementPortalTarget.setAttribute('class', 'm-dialog-popover');
        this.elementPortalTarget.style.position = 'relative';

        if (this.$mWindow.windowCount == 0) {
            this.addFirstDialog();
        } else {
            this.propTargetElement.appendChild(this.elementPortalTarget);
            this.addDialog();
        }
    }

    private deleteDialog() {
        let elementPortalTarget: HTMLElement = this.getElementPortalTarget();
        if (elementPortalTarget) {
            document.body.removeChild(elementPortalTarget);
        }
        this.$mWindow.deleteWindow(this.propId);
    }

    private addFirstDialog() {
        this.$mWindow.addWindow(this.propId);
        this.elementPortalTarget.style.zIndex = String(this.$mWindow.windowZIndex);
        this.$mWindow.createBackdrop(this.propTargetElement);
        this.propTargetElement.appendChild(this.elementPortalTarget);
    }

    private addDialog() {
        let elementPortalTarget: HTMLElement = this.getElementPortalTarget();
        elementPortalTarget.style.position = 'relative';
        this.$mWindow.addWindow(this.propId);
        elementPortalTarget.style.zIndex = String(this.$mWindow.windowZIndex);
    }

    private backdropClick(event): void {
        if (this.propCloseOnBackdrop) {
            this.closeDialog(event);
        }
    }

    private getElementPortalTarget(): HTMLElement {
        return document.querySelector('#' + this.propId) as HTMLElement;
    }

    private get propMode(): string {
        let mode: string = this.mode == MODE_SECONDARY || this.mode == MODE_PANEL ? this.mode : MODE_PRIMARY;
        switch (mode) {
            case MODE_SECONDARY:
                this.propCloseOnBackdrop = this.closeOnBackdrop == undefined ? true : this.closeOnBackdrop;
                this.transitionDuration = this.isScreenMinS ? TRANSITION_DURATION_LONG : TRANSITION_DURATION;
                break;
            case MODE_PANEL:
                this.propCloseOnBackdrop = this.closeOnBackdrop == undefined ? true : this.closeOnBackdrop;
                this.transitionDuration = TRANSITION_DURATION_LONG;
                break;
            default:
                this.propCloseOnBackdrop = this.closeOnBackdrop == undefined ? false : this.closeOnBackdrop;
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
