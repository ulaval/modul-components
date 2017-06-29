import Vue from 'vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import WithRender from './dialog.html?style=./dialog.scss';
import { DIALOG_NAME } from '../component-names';
import uuid from '../../utils/uuid/uuid';

const DATA_DIALOG_COUNT: string = 'data-m-dialog-count';

@WithRender
@Component
export class MDialog extends Vue {
    @Prop({ default: true })
    public isDialog: boolean;
    @Prop({ default: 'mDialog' })
    public id: string;
    @Prop({ default: false })
    public isOpen: boolean;
    @Prop({ default: true })
    public hasBackdrop: boolean;
    @Prop({ default: 'body' })
    public targetElement: string;

    public componentName: string = DIALOG_NAME;

    private propsIsOpen: boolean = false;
    private propsId: string = 'mDialog';
    private propsHasBackdrop: boolean;
    private propsTargetElement: HTMLElement = document.body;
    private elementBody: HTMLElement = document.body;
    private elementPortalTarget: HTMLElement = document.createElement('div');
    private nbDialog: number = 0;
    private isVisible: boolean = false;
    private isAnimActive: boolean = false;

    private scollPosition: number = 0;

    @Watch('targetElement')
    private setTargetElement(newTagetElement): void {
        this.propsTargetElement = document.querySelector(newTagetElement) as HTMLElement;
    }

    @Watch('isOpen')
    private isOpenChanged(newValue): void {
        this.propsIsOpen = newValue;
    }

    private beforeMount(): void {
        this.setTargetElement(this.targetElement);
        this.propsHasBackdrop = this.hasBackdrop;
        if (this.isOpen) {
            this.openDialog();
        }
    }

    private destroyed(): void {
        if (this.propsIsOpen) {
            this.deleteDialog();
        }
    }

    private createDialog() {
        this.propsId = this.id + '-' + uuid.generate();
        this.elementPortalTarget.setAttribute('id', this.propsId);
        this.elementPortalTarget.setAttribute('class', 'm-dialog-popover');
        this.propsTargetElement.appendChild(this.elementPortalTarget);

        let dialogCount: number = Number(this.propsTargetElement.getAttribute(DATA_DIALOG_COUNT));
        if (dialogCount == 0) {
            this.propsTargetElement.setAttribute(DATA_DIALOG_COUNT, '1');
            this.stopScollBody();
        } else {
            this.propsTargetElement.setAttribute(DATA_DIALOG_COUNT, String(dialogCount + 1));
        }
    }

    private deleteDialog() {
        let elementPortalTarget: HTMLElement = document.querySelector('#' + this.propsId) as HTMLElement;
        if (elementPortalTarget) {
            elementPortalTarget.remove();
        }

        let dialogCount: number = Number(this.propsTargetElement.getAttribute(DATA_DIALOG_COUNT));
        if (dialogCount == 1) {
            this.propsTargetElement.removeAttribute(DATA_DIALOG_COUNT);
            this.activeScollBody();
        } else {
            this.propsTargetElement.setAttribute(DATA_DIALOG_COUNT, String(dialogCount - 1));
        }
    }

    private activeScollBody(): void {
        this.elementBody.style.removeProperty('position');
        this.elementBody.style.removeProperty('top');
        this.elementBody.style.removeProperty('left');
        this.elementBody.style.removeProperty('overflow');
        window.scrollBy(0, this.scollPosition);
    }

    private stopScollBody(): void {
        this.scollPosition = this.elementBody.scrollTop;
        this.elementBody.style.position = 'fixed';
        this.elementBody.style.top = '-' + this.scollPosition + 'px';
        this.elementBody.style.left = '0';
        this.elementBody.style.overflow = 'hidden';
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
            setTimeout(() => {
                this.propsIsOpen = false;
                this.deleteDialog();
                this.isAnimActive = false;
                this.$emit('close');
            }, 300);
        }
    }

    private backdropClick(event): void {
        this.closeDialog(event);
    }

    private get hasTitle(): boolean {
        return !!this.$slots['title'];
    }
}

const DialogPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(DIALOG_NAME, MDialog);
    }
};

export default DialogPlugin;
