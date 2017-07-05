import Vue from 'vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import WithRender from './dialog.html?style=./dialog.scss';
import { DIALOG_NAME } from '../component-names';
import uuid from '../../utils/uuid/uuid';
import { BodyScroll } from '../../mixins/body-scroll/body-scroll';
import { Backdrop } from '../../mixins/backdrop/backdrop';
@WithRender
@Component({
    mixins: [
        BodyScroll,
        Backdrop
    ]
})
export class MDialog extends Vue {
    @Prop({ default: 'primary' })
    public mode: string;
    @Prop({ default: 'mDialog' })
    public id: string;
    @Prop({ default: false })
    public isOpen: boolean;
    @Prop({ default: true })
    public hasBackdrop: boolean;
    @Prop({ default: 'body' })
    public targetElement: string;

    public componentName: string = DIALOG_NAME;

    private propsMode: string = 'primary';
    private propsIsOpen: boolean = false;
    private propsId: string = 'mDialog';
    private propsHasBackdrop: boolean;
    private propsTargetElement: HTMLElement = document.body;
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
    }

    private beforeMount(): void {
        this.setTargetElement(this.targetElement);
        this.propsHasBackdrop = this.hasBackdrop;
        this.propsMode = this.mode;
        if (this.isOpen) {
            this.openDialog();
        }
        switch (this.propsMode) {
            case 'secondary':
                break;
            default:
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
            this['changeBackdropZIndex'](-1);
            if (this['getDataWindowCount']() == 1) {
                this['getElementBackdrop']().style.opacity = '0';
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

        if (this['getDataWindowCount']() == 0) {
            this.addFirstDialog();
            this['stopScollBody']();
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

        if (this['getDataWindowCount']() == 1) {
            this['removeDataWindowCount']();
            this['activeScollBody']();
            this['removeBackdrop']();
        } else {
            this['setDataWindowCount'](String(this['getDataWindowCount']() - 1));
        }
    }

    private addFirstDialog() {
        // Init first dialog
        this['setDataWindowCount']('1');
        this.elementPortalTarget.style.zIndex = this['backdropZIndex'];
        // Init first backdrop
        this['createBackdrop'](this.propsTargetElement);
        this.propsTargetElement.appendChild(this.elementPortalTarget);
    }

    private addDialog() {
        let elementPortalTarget: HTMLElement = this.getElementPortalTarget();
        elementPortalTarget.style.position = 'relative';
        this['addWindow']();
        this['changeBackdropZIndex'](1);
        elementPortalTarget.style.zIndex = String(this['getDataBackdropZIndex']());
    }

    private backdropClick(event): void {
        this.closeDialog(event);
    }

    private getElementPortalTarget(): HTMLElement {
        return document.querySelector('#' + this.propsId) as HTMLElement;
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
