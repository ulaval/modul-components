import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { ModulVue } from '../../utils/vue/vue';
import { Prop, Watch } from 'vue-property-decorator';
import WithRender from './dialog.html?style=./dialog.scss';
import { DIALOG_NAME } from '../component-names';
import uuid from '../../utils/uuid/uuid';
import { MediaQueries } from '../../mixins/media-queries/media-queries';
import { DialogProps, DialogPropsMixin } from '../../mixins/dialog-props/dialog-props';

const MODE_PRIMARY = 'primary';
const MODE_SECONDARY = 'secondary';
const MODE_PANEL = 'panel';

const TRANSITION_DURATION = 300;
const TRANSITION_DURATION_LONG = 600;

@WithRender
@Component({
    mixins: [
        MediaQueries,
        DialogProps
    ]
})
export class MDialog extends ModulVue implements DialogPropsMixin {
    @Prop({ default: MODE_PRIMARY })
    public mode: string;

    // DialogPropsMixin props
    public id: string;
    public open: boolean;
    public closeOnBackdrop: boolean;
    public title: string;
    public className: string;

    public componentName: string = DIALOG_NAME;

    private propOpen: boolean = false;
    private propId: string = 'mDialog';
    private propCloseOnBackdrop: boolean;
    private bodyElement: HTMLElement = document.body;
    private portalTargetElement: HTMLElement = document.createElement('div');
    private nbDialog: number = 0;
    private isVisible: boolean = false;
    private isAnimActive: boolean = false;
    private isScreenMinS: boolean;
    private transitionDuration: number = TRANSITION_DURATION;

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
            if (this.$mWindow.windowCount == 1 && this.$mWindow.hasBackdrop) {
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
        this.portalTargetElement.setAttribute('id', this.propId);
        this.portalTargetElement.setAttribute('class', 'm-dialog-popover');
        this.portalTargetElement.style.position = 'relative';

        this.$mWindow.addWindow(this.propId);
        this.portalTargetElement.style.zIndex = String(this.$mWindow.windowZIndex);

        if (!this.$mWindow.hasBackdrop) {
            this.$mWindow.createBackdrop(this.bodyElement);
        }
        this.bodyElement.appendChild(this.portalTargetElement);
    }

    private deleteDialog() {
        let portalTargetElement: HTMLElement = this.bodyElement.querySelector('#' + this.propId) as HTMLElement;
        if (portalTargetElement) {
            this.bodyElement.removeChild(portalTargetElement);
        }
        this.$mWindow.deleteWindow(this.propId);
    }

    private backdropClick(event): void {
        if (this.propCloseOnBackdrop) {
            this.closeDialog(event);
        }
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
}

const DialogPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(DIALOG_NAME, MDialog);
    }
};

export default DialogPlugin;
