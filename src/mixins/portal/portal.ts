import { ModulVue } from '../../utils/vue/vue';
import Component from 'vue-class-component';
import uuid from '../../utils/uuid/uuid';
import { Prop } from 'vue-property-decorator';

export interface PortalMixin {
    //     portalEl: HTMLElement;
    //     portalId: string;
    //     ceratePortalEl: Function;
    //     createBackdropEl: Function;
    //     appendPortalToBody: Function;
    //     appendBackdropAndPortalToBody: Function;
    //     removePortal: Function;
    //     removeBackdropAndPortal: Function;
}

@Component
export class Portal extends ModulVue implements PortalMixin {
    //     public portalEl: HTMLElement;
    //     public portalId: string;

    // @Prop({ default: 'mPortal' })
    // public id: string;

    // private propId: string = '';
    // private portalTargetEl: HTMLElement;

    // protected beforeMount(): void {
    //     this.propId = this.id + '-' + uuid.generate();
    //     let element: HTMLElement = document.createElement('div');
    //     element.setAttribute('id', this.propId);
    //     document.body.appendChild(element);
    // }

    // protected mounted(): void {
    //     this.portalTargetEl = document.getElementById(this.propId) as HTMLElement;
    // }

    //     public ceratePortalEl(id: string, className: string): void {
    //         this.portalEl = document.createElement('div');
    //         this.portalId = id + '-' + uuid.generate();
    //         this.portalEl.setAttribute('id', this.portalId);
    //         this.portalEl.setAttribute('class', className);
    //         this.portalEl.style.position = 'absolute';
    //     }

    //     public createBackdropEl(transitionDuration: string = '0.3s'): void {
    //         // if (!this.$modul.hasBackdrop) {
    //         //     this.$modul.createBackdrop(this.$modul.bodyEl);
    //         // }
    //         // this.$modul.setBackdropTransitionDuration(transitionDuration);
    //     }

    //     public appendBackdropAndPortalToBody(portalId: string, portalClassName: string, backdropTransitionDuration: string): void {
    //         // this.ceratePortalEl(portalId, portalClassName);
    //         // this.$modul.addWindow(this.portalId);
    //         // this.portalEl.style.zIndex = String(this.$modul.windowZIndex);
    //         // this.createBackdropEl(backdropTransitionDuration);
    //         // this.$modul.bodyEl.appendChild(this.portalEl);
    //     }

    //     public appendPortalToBody(id: string, className: string): void {
    //         this.ceratePortalEl(id, className);
    //         this.portalEl.style.zIndex = String(this.$modul.windowZIndex);
    //         this.$modul.bodyEl.appendChild(this.portalEl);
    //     }

    //     public removePortal(): void {
    //         let portalEl: HTMLElement = this.getPotalEl();
    //         if (portalEl) {
    //             this.$modul.bodyEl.removeChild(portalEl);
    //         }
    //     }

    //     public removeBackdropAndPortal(): void {
    //         // let portalEl: HTMLElement = this.getPotalEl();
    //         // if (portalEl) {
    //         //     this.$modul.bodyEl.removeChild(portalEl);
    //         //     this.$modul.deleteWindow(this.portalId);
    //         // }
    //     }

    //     private getPotalEl(): HTMLElement {
    //         return this.$modul.bodyEl.querySelector('#' + this.portalId) as HTMLElement;
    //     }
}
