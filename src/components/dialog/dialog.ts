import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { ModulVue } from '../../utils/vue/vue';
import { Prop, Watch } from 'vue-property-decorator';
import WithRender from './dialog.html?style=./dialog.scss';
import { DIALOG_NAME } from '../component-names';
import uuid from '../../utils/uuid/uuid';

const DIALOG_MODE_PRIMARY = 'primary';
const DIALOG_MODE_SECONDARY = 'secondary';

@WithRender
@Component
export class MDialog extends ModulVue {
    @Prop({ default: DIALOG_MODE_PRIMARY })
    public mode: string;
    @Prop({ default: 'mDialog' })
    public id: string;
    @Prop({ default: false })
    public isOpen: boolean;
    @Prop({ default: 'body' })
    public targetElement: string;
    @Prop({ default: '' })
    public title: string;
    @Prop()
    public isCloseOnBackdrop: boolean;

    public componentName: string = DIALOG_NAME;

    private propsMode: string = 'primary';
    private propsIsOpen: boolean = false;
    private propsId: string = 'mDialog';
    private propsTargetElement: HTMLElement = document.body;
    private propsIsCloseOnBackdrop: boolean = true;
    private elementPortalTarget: HTMLElement = document.createElement('div');
    private nbDialog: number = 0;
    private isVisible: boolean = false;
    private isAnimActive: boolean = false;
    private isMinSmall: boolean;

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
        this.$emit('isOpen', this.propsIsOpen);
    }

    private beforeMount(): void {
        this.setTargetElement(this.targetElement);
        this.propsIsCloseOnBackdrop = this.isCloseOnBackdrop;
        this.propsMode = this.mode;
        if (this.isOpen) {
            this.openDialog();
        }
        switch (this.propsMode) {
            case 'secondary':
                if (this.propsIsCloseOnBackdrop == undefined) {
                    this.propsIsCloseOnBackdrop = true;
                }
                break;
            default:
                if (this.propsIsCloseOnBackdrop == undefined) {
                    this.propsIsCloseOnBackdrop = false;
                }
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
            }, 300);
            this.$emit('open');
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
                this.$emit('close');
            }, 300);
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

    private get hasTitle(): boolean {
        return this.title == '' ? false : true;
    }

    private get hasDefaultSlots(): boolean {
        return !!this.$slots.default;
    }
}

const DialogPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(DIALOG_NAME, MDialog);
    }
};

export default DialogPlugin;
