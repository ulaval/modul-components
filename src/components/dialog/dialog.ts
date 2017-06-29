import Vue from 'vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import WithRender from './dialog.html?style=./dialog.scss';
import { DIALOG_NAME } from '../component-names';
import uuid from '../../utils/uuid/uuid';

@WithRender
@Component
export class MDialog extends Vue {
    @Prop({ default: true })
    public isDialog: boolean;
    @Prop({ default: true })
    public hasBackdrop: boolean;
    @Prop({ default: 'mDialog' })
    public id: string;
    @Prop({ default: 'body' })
    public targetElement: string;

    public componentName: string = DIALOG_NAME;

    private isOpen: boolean = false;
    private isVisible: boolean = false;
    private propsId: string = 'mDialog';
    private propsTargetElement: HTMLElement = document.querySelector('body') as HTMLElement;
    private elementPortalTarget: HTMLElement = document.createElement('div');

    private beforeMount(): void {
        this.setTargetElement(this.targetElement);
    }

    @Watch('targetElement')
    private setTargetElement(newTagetElement): void {
        this.propsTargetElement = document.querySelector(newTagetElement) as HTMLElement;
    }

    private destroyed(): void {
        if (this.isOpen) {
            this.deleteDialog();
        }
    }

    private createDialog() {
        this.propsId = this.id + '-' + uuid.generate();
        this.elementPortalTarget.setAttribute('id', this.propsId);
        this.elementPortalTarget.setAttribute('class', 'm-dialog-popover');
        this.propsTargetElement.appendChild(this.elementPortalTarget);
    }

    private deleteDialog() {
        let elementPortalTarget: HTMLElement = document.querySelector('#' + this.propsId) as HTMLElement;
        elementPortalTarget.remove();
    }

    private open(event): void {
        this.createDialog();
        this.isOpen = true;
        setTimeout(() => {
            this.isVisible = true;
        }, 2);
        this.$emit('open', event);
    }

    private close(event): void {
        this.isVisible = false;
        setTimeout(() => {
            this.isOpen = false;
            this.deleteDialog();
            this.$emit('close', event);
        }, 300);
    }

    private backdropClick(event): void {
        this.close(event);
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
