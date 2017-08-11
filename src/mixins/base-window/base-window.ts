import { PluginObject } from 'vue';
import { ModulVue } from '../../utils/vue/vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import uuid from '../../utils/uuid/uuid';
import { MediaQueries, MediaQueriesMixin } from '../../mixins/media-queries/media-queries';
import WithRender from './base-window.html?style=./base-window.scss';

export enum DialogMode {
    Modal = 'modal',
    Dialog = 'dialog',
    Sidebar = 'sidebar'
}

export enum DialogFrom {
    Top = 'top',
    Bottom = 'bottom',
    Right = 'right',
    Left = 'left'
}

export const TRANSITION_DURATION: number = 300;
export const TRANSITION_DURATION_LONG: number = 600;

const DIALOG_ID: string = 'mDialog';

@WithRender
@Component({
    mixins: [MediaQueries]
})
export class DialogTemplate extends ModulVue {
    @Prop({ default: DIALOG_ID })
    public id: string;
    @Prop({ default: false })
    public open: boolean;
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
    @Prop()
    public className: string;

    public componentName: string;

    private internalPropOpen: boolean = false;
    private propId: string = DIALOG_ID;
    private bodyElement: HTMLElement = document.body;
    private portalTargetElement: HTMLElement = document.createElement('div');
    private isVisible: boolean = false;
    private busy: boolean = false;

    protected get dialogMode(): DialogMode {
        return DialogMode.Modal;
    }

    protected beforeMount(): void {
        this.propOpen = this.open;
    }

    protected destroyed(): void {
        if (this.propOpen) {
            this.deleteDialog();
        }
    }

    protected get offsetStyle(): string | undefined {
        return undefined;
    }

    private get propOpen(): boolean {
        return this.internalPropOpen;
    }

    private get fromClass(): String {
        let from = this.dialogMode == 'sidebar' ? 'm--from-' + this.getPanelDirection() : '';
        return from;
    }

    private getPanelDirection(): String {
        return DialogFrom.Bottom;
    }

    private set propOpen(value: boolean) {
        if (this.internalPropOpen != value) {
            if (this.busy) {
                this.$emit('update:open', !value);
            } else {
                this.busy = true;
                this.internalPropOpen = value;
                if (value) {
                    this.internalOpenDialog().then(() => {
                        this.$emit('update:open', value);
                        this.$emit('open');
                        this.busy = false;
                    });
                } else {
                    this.internalCloseDialog().then(() => {
                        this.$emit('update:open', value);
                        this.$emit('close');
                        this.busy = false;
                    });
                }
            }
        }
    }

    public get propCloseOnBackdrop(): boolean {
        let result: boolean = false;
        if (this.dialogMode == DialogMode.Dialog || this.dialogMode == DialogMode.Sidebar) {
            result = this.closeOnBackdrop == undefined ? true : this.closeOnBackdrop;
        }
        return result;
    }

    public get transitionDuration(): number {
        let result: number;
        switch (this.dialogMode) {
            case DialogMode.Dialog:
                result = this.as<MediaQueriesMixin>().isScreenMaxS ? TRANSITION_DURATION_LONG : TRANSITION_DURATION;
                break;
            case DialogMode.Sidebar:
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
                    this.$refs.dialogWrap['setAttribute']('tabindex', '0');
                    this.$refs.dialogWrap['focus']();
                    this.$refs.dialogWrap['removeAttribute']('tabindex');
                });
            }, this.transitionDuration);
        });
    }

    private internalCloseDialog(event = undefined): Promise<any> {
        return new Promise((resolve, reject) => {
            this.isVisible = false;
            this.$mWindow.backdropElement.style.zIndex = String(this.$mWindow.windowZIndex - 1);
            if (this.$mWindow.windowCount == 1 && this.$mWindow.hasBackdrop) {
                this.$mWindow.backdropElement.style.opacity = '0';
            }
            setTimeout(() => {
                this.deleteDialog();
                resolve();
                this.$nextTick(() => {
                    this.$refs.dialogButton['setAttribute']('tabindex', '0');
                    this.$refs.dialogButton['focus']();
                    this.$refs.dialogButton['removeAttribute']('tabindex');
                });
            }, this.transitionDuration);
        });
    }

    private createDialog() {
        this.propId = this.id + '-' + uuid.generate();
        this.portalTargetElement.setAttribute('id', this.propId);
        this.portalTargetElement.setAttribute('class', 'm-dialog-popover');
        this.portalTargetElement.style.position = 'relative';

        this.$mWindow.addWindow(this.propId);
        this.portalTargetElement.style.zIndex = String(this.$mWindow.windowZIndex);

        this.$mWindow.createBackdrop(this.bodyElement);
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
