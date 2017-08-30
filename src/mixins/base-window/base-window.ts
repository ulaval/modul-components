import { PluginObject } from 'vue';
import { ModulVue } from '../../utils/vue/vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import uuid from '../../utils/uuid/uuid';
import { MediaQueries, MediaQueriesMixin } from '../../mixins/media-queries/media-queries';
import WithRender from './base-window.html?style=./base-window.scss';

export enum BaseWindowMode {
    Modal = 'modal',
    Dialog = 'dialog',
    Sidebar = 'sidebar'
}

export enum BaseWindowFrom {
    Top = 'top',
    Right = 'right',
    Bottom = 'bottom',
    Left = 'left',
    BottomRight = 'bottom-right',
    BottomLeft = 'Bottom-left'
}

export const TRANSITION_DURATION: number = 300;
export const TRANSITION_DURATION_LONG: number = 600;

const DIALOG_ID: string = 'mDialog';

@WithRender
@Component({
    mixins: [MediaQueries]
})
export class BaseWindow extends ModulVue {
    @Prop({ default: DIALOG_ID })
    public id: string;
    @Prop({ default: false })
    public open: boolean;
    @Prop()
    public classNamePortalTarget: string;
    @Prop({ default: false })
    public disabled: boolean;
    @Prop()
    public closeOnBackdrop: boolean;
    @Prop()
    public title: string;
    @Prop({ default: true })
    public padding: boolean;
    @Prop({ default: true })
    public paddingHeader: boolean;
    @Prop({ default: true })
    public paddingBody: boolean;
    @Prop({ default: true })
    public paddingFooter: boolean;

    public componentName: string;
    public from: string;
    private hasHeader: boolean;

    private internalPropOpen: boolean = false;
    private propId: string = DIALOG_ID;
    private bodyElement: HTMLElement = document.body;
    private portalTargetEl: HTMLElement = document.createElement('div');
    private isVisible: boolean = false;
    private busy: boolean = false;

    protected get windowMode(): BaseWindowMode {
        return BaseWindowMode.Modal;
    }

    protected beforeMount(): void {
        this.propOpen = this.open;
    }

    protected destroyed(): void {
        if (this.propOpen) {
            this.deleteDialog();
        }
    }

    private get propOpen(): boolean {
        return this.internalPropOpen;
    }

    private set propOpen(value: boolean) {
        if (this.internalPropOpen != value) {
            if (this.busy) {
                this.$emit('update:open', !value);
            } else {
                this.busy = true;
                if (value) {
                    this.internalPropOpen = true;
                    this.internalOpenDialog().then(() => {
                        this.$emit('update:open', value);
                        this.$emit('open');
                        this.busy = false;
                    });
                } else {
                    this.internalCloseDialog().then(() => {
                        this.internalPropOpen = false;
                        this.$emit('update:open', value);
                        this.$emit('close');
                        this.busy = false;
                    });
                }
            }
        }
    }

    private get showHeader(): boolean {
        if (this.from != BaseWindowFrom.Bottom && this.windowMode != BaseWindowMode.Modal && (this.hasHeaderSlot || this.hasTitle)) {
            this.hasHeader = true;
        } else {
            this.hasHeader = false;
        }
        return this.hasHeader;
    }

    public get propCloseOnBackdrop(): boolean {
        let result: boolean = false;
        if (this.windowMode == BaseWindowMode.Dialog || this.windowMode == BaseWindowMode.Sidebar) {
            result = this.closeOnBackdrop == undefined ? true : this.closeOnBackdrop;
        }
        return result;
    }

    public get transitionDuration(): number {
        let result: number;
        switch (this.windowMode) {
            case BaseWindowMode.Dialog:
                result = this.as<MediaQueriesMixin>().isMqMaxS ? TRANSITION_DURATION_LONG : TRANSITION_DURATION;
                break;
            case BaseWindowMode.Sidebar:
                result = TRANSITION_DURATION_LONG;
                break;
            default:
                result = TRANSITION_DURATION;
        }
        return result;
    }

    @Watch('open')
    private openChanged(value: boolean): void {
        this.propOpen = value;
    }

    private openDialog(): boolean {
        if (!this.busy) {
            this.propOpen = true;
        }
        return this.propOpen;
    }

    private closeDialog(): boolean {
        if (!this.busy) {
            this.propOpen = false;
        }
        return !this.propOpen;
    }

    private internalOpenDialog(event = undefined): Promise<any> {
        return new Promise((resolve, reject) => {
            this.createDialog();
            setTimeout(() => {
                this.isVisible = true;
            }, 2);
            setTimeout(() => {
                resolve();
                this.$nextTick(() => {
                    let dialogWrapEl: HTMLElement = this.$refs.dialogWrap as HTMLElement;
                    dialogWrapEl.setAttribute('tabindex', '0');
                    dialogWrapEl.focus();
                    dialogWrapEl.removeAttribute('tabindex');
                });
            }, this.transitionDuration);
        });
    }

    private internalCloseDialog(event = undefined): Promise<any> {
        return new Promise((resolve, reject) => {
            this.isVisible = false;
            this.$mWindow.backdropElement.style.zIndex = String(this.$mWindow.windowZIndex - 1);
            if (this.$mWindow.windowCount == 1 && this.$mWindow.hasBackdrop) {
                this.$mWindow.setBackdropTransitionDuration(this.transitionDuration / 1000 + 's');
                this.$mWindow.setBackdropOpacity('0');
            }
            setTimeout(() => {
                this.deleteDialog();
                resolve();
                if (this.hasDefaultSlots) {
                    this.$nextTick(() => {
                        let dialogButtonEl: HTMLElement = this.$refs.dialogButton as HTMLElement;
                        dialogButtonEl.setAttribute('tabindex', '0');
                        dialogButtonEl.focus();
                        dialogButtonEl.removeAttribute('tabindex');
                    });
                }
            }, this.transitionDuration);
        });
    }

    private createDialog() {
        this.propId = this.id + '-' + uuid.generate();
        this.portalTargetEl.setAttribute('id', this.propId);
        this.portalTargetEl.setAttribute('class', this.classNamePortalTarget);
        this.portalTargetEl.style.position = 'relative';

        this.$mWindow.addWindow(this.propId);
        this.portalTargetEl.style.zIndex = String(this.$mWindow.windowZIndex);

        this.$mWindow.createBackdrop(this.bodyElement);
        this.$mWindow.setBackdropTransitionDuration(this.transitionDuration / 1000 + 's');

        this.bodyElement.appendChild(this.portalTargetEl);
    }

    private deleteDialog() {
        let portalTargetEl: HTMLElement = this.bodyElement.querySelector('#' + this.propId) as HTMLElement;
        if (portalTargetEl) {
            this.bodyElement.removeChild(portalTargetEl);
        }
        this.$mWindow.deleteWindow(this.propId);
    }

    private backdropClick(event): void {
        if (this.propCloseOnBackdrop) {
            this.closeDialog();
        }
    }

    private onTrue() {
        if (this.closeDialog()) {
            this.$emit('true');
        }
    }

    private onFalse() {
        if (this.closeDialog()) {
            this.$emit('false');
        }
    }

    private get hasTitle(): boolean {
        return !!this.title;
    }

    private get hasHeaderSlot(): boolean {
        return !!this.$slots.header;
    }

    private get hasBodySlot(): boolean {
        return !!this.$slots.body;
    }

    private get hasFooterSlot(): boolean {
        return !!this.$slots.footer;
    }

    private get hasDefaultSlots(): boolean {
        return !!this.$slots.default;
    }
}
