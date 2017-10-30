// import { PluginObject } from 'vue';
// import { ModulVue } from '../../utils/vue/vue';
// import Component from 'vue-class-component';
// import { Prop, Watch } from 'vue-property-decorator';
// import { MediaQueries, MediaQueriesMixin } from '../../mixins/media-queries/media-queries';
// // import { Portal, PortalMixin } from '../../mixins/portal/portal';
// import WithRender from './base-window.html?style=./base-window.scss';

// export enum BaseWindowMode {
//     Modal = 'modal',
//     Dialog = 'dialog',
//     Sidebar = 'sidebar'
// }

// export enum BaseWindowFrom {
//     Top = 'top',
//     Right = 'right',
//     Bottom = 'bottom',
//     Left = 'left',
//     BottomRight = 'bottom-right',
//     BottomLeft = 'Bottom-left'
// }

// export const TRANSITION_DURATION: number = 300;
// export const TRANSITION_DURATION_LONG: number = 600;

// const DIALOG_ID: string = 'mDialog';

// @WithRender
// @Component({
//     /*mixins: [
//         MediaQueries,
//         Portal
//     ]*/
// })
// export class BaseWindow extends ModulVue {
//     @Prop({ default: DIALOG_ID })
//     public id: string;
//     @Prop({ default: false })
//     public open: boolean;
//     @Prop({ default: '' })
//     public classNamePortalTarget: string;
//     @Prop({ default: false })
//     public disabled: boolean;
//     @Prop()
//     public closeOnBackdrop: boolean;
//     @Prop()
//     public title: string;
//     @Prop({ default: true })
//     public padding: boolean;
//     @Prop({ default: true })
//     public paddingHeader: boolean;
//     @Prop({ default: true })
//     public paddingBody: boolean;
//     @Prop({ default: true })
//     public paddingFooter: boolean;

//     public componentName: string;
//     public from: string;

//     private internalPropOpen: boolean = false;
//     private propId: string = DIALOG_ID;
//     private visible: boolean = false;
//     private busy: boolean = false;

//     protected get windowMode(): BaseWindowMode {
//         return BaseWindowMode.Modal;
//     }

//     protected beforeMount(): void {
//         this.propOpen = this.open;
//     }

//     protected destroyed(): void {
//         if (this.propOpen) {
//             this.deleteDialog();
//         }
//     }

//     private get propOpen(): boolean {
//         if (this.disabled) {
//             return false;
//         }
//         return this.internalPropOpen;
//     }

//     private set propOpen(value: boolean) {
//         if (this.internalPropOpen != value && !this.disabled) {
//             if (this.busy) {
//                 this.$emit('update:open', !value);
//             } else {
//                 this.busy = true;
//                 if (value) {
//                     this.internalPropOpen = true;
//                     this.internalOpenDialog().then(() => {
//                         this.$emit('update:open', value);
//                         this.$emit('open');
//                         this.busy = false;
//                     });
//                 } else {
//                     this.internalCloseDialog().then(() => {
//                         this.internalPropOpen = false;
//                         this.$emit('update:open', value);
//                         this.$emit('close');
//                         this.busy = false;
//                     });
//                 }
//             }
//         }
//     }

//     private get showHeader(): boolean {
//         return this.from != BaseWindowFrom.Bottom && this.windowMode != BaseWindowMode.Modal && (this.hasHeaderSlot || this.hasTitle);
//     }

//     public get propCloseOnBackdrop(): boolean {
//         let result: boolean = false;
//         if (this.windowMode == BaseWindowMode.Dialog || this.windowMode == BaseWindowMode.Sidebar) {
//             result = this.closeOnBackdrop == undefined ? true : this.closeOnBackdrop;
//         }
//         return result;
//     }

//     public get transitionDuration(): number {
//         let result: number;
//         switch (this.windowMode) {
//             case BaseWindowMode.Dialog:
//                 result = this.as<MediaQueriesMixin>().isMqMaxS ? TRANSITION_DURATION_LONG : TRANSITION_DURATION;
//                 break;
//             case BaseWindowMode.Sidebar:
//                 result = TRANSITION_DURATION_LONG;
//                 break;
//             default:
//                 result = TRANSITION_DURATION;
//         }
//         return result;
//     }

//     @Watch('open')
//     private openChanged(value: boolean): void {
//         this.propOpen = value;
//     }

//     private openDialog(): boolean {
//         if (this.hasDefaultSlots) {
//             if (!this.busy) {
//                 this.propOpen = true;
//             }
//             return this.propOpen;
//         }
//         return false;
//     }

//     private closeDialog(): boolean {
//         if (!this.busy) {
//             this.propOpen = false;
//         }
//         return !this.propOpen;
//     }

//     private internalOpenDialog(event = undefined): Promise<any> {
//         return new Promise((resolve, reject) => {
//             this.createDialog();
//             setTimeout(() => {
//                 this.visible = true;
//                 setTimeout(() => {
//                     resolve();
//                     let dialogWrapEl: HTMLElement = this.$refs.dialogWrap as HTMLElement;
//                     if (dialogWrapEl) {
//                         dialogWrapEl.setAttribute('tabindex', '0');
//                         dialogWrapEl.focus();
//                         dialogWrapEl.blur();
//                         dialogWrapEl.removeAttribute('tabindex');
//                     }
//                 }, this.transitionDuration);
//             }, 10);
//         });
//     }

//     private internalCloseDialog(event = undefined): Promise<any> {
//         return new Promise((resolve, reject) => {
//         //     this.visible = false;
//         //     this.$modul.backdropElement.style.zIndex = String(this.$modul.windowZIndex - 1);
//         //     this.$emit('startClose');
//         //     if (this.$modul.windowCount == 1 && this.$modul.hasBackdrop) {
//         //         this.$modul.setBackdropTransitionDuration(this.transitionDuration / 1000 + 's');
//         //         this.$modul.setBackdropOpacity('0');
//         //     }
//         //     setTimeout(() => {
//         //         this.deleteDialog();
//         //         resolve();
//         //         if (this.hasDefaultSlots) {
//         //             this.$nextTick(() => {
//         //                 let baseWindowEl: HTMLElement = this.$refs.baseWindow as HTMLElement;
//         //                 baseWindowEl.setAttribute('tabindex', '0');
//         //                 baseWindowEl.focus();
//         //                 baseWindowEl.removeAttribute('tabindex');
//         //             });
//         //         }
//         //     }, this.transitionDuration);
//         });
//     }

//     private createDialog() {
//         // if (!this.disabled) {
//         //     this.as<PortalMixin>().appendBackdropAndPortalToBody(this.id, this.classNamePortalTarget, this.transitionDuration / 1000 + 's');
//         //     this.propId = this.as<PortalMixin>().portalId;
//         // }
//     }

//     private deleteDialog() {
//         // this.as<PortalMixin>().removeBackdropAndPortal();
//     }

//     private backdropClick(event): void {
//         if (this.propCloseOnBackdrop) {
//             this.closeDialog();
//         }
//     }

//     private onTrue() {
//         if (this.closeDialog()) {
//             this.$emit('true');
//         }
//     }

//     private onFalse() {
//         if (this.closeDialog()) {
//             this.$emit('false');
//         }
//     }

//     private get hasTitle(): boolean {
//         return !!this.title;
//     }

//     private get hasHeaderSlot(): boolean {
//         return !!this.$slots.header;
//     }

//     private get hasBodySlot(): boolean {
//         return !!this.$slots.body;
//     }

//     private get hasFooterSlot(): boolean {
//         return !!this.$slots.footer;
//     }

//     private get hasDefaultSlots(): boolean {
//         return !!this.$slots.default;
//     }
// }
