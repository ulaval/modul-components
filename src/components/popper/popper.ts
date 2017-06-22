import Vue from 'vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import WithRender from './popper.html?style=./popper.scss';
import { POPPER_NAME } from '../component-names';
import Popper from 'popper.js';

export interface IPopperOptions {
    placement: string;
    gpuAcceleration: boolean;
    modifiers: any;
    onCreate: Function;
}

@WithRender
@Component
export class MPopper extends Vue {
    @Prop({ default: 'default' })
    public mode: string;
    @Prop({
        default: 'hover',
        validator: (value) => ['click', 'hover'].indexOf(value) > -1
    })
    public trigger: string;
    @Prop({ default: false })
    public disabled: boolean;
    @Prop()
    public content: string;
    @Prop()
    public boundariesSelector: string;
    @Prop()
    public reference: Object;
    @Prop({ default: false })
    public forceShow: boolean;
    @Prop({ default: false })
    public appendToBody: boolean;
    @Prop({ default: false })
    public visibleArrow: boolean;
    @Prop()
    public options: Object;
    @Prop({ default: false })
    public closeOnContentClick: boolean;
    @Prop({ default: true })
    public toggleOnReferenceClick: boolean;

    public componentName: string = POPPER_NAME;
    public referenceElm;
    public popperJS;
    public showPopper: boolean = false;
    public isAnimPopperActive: boolean = false;
    public currentPlacement: string = '';
    public popperOptions: IPopperOptions = {
        placement: 'bottom',
        gpuAcceleration: false,
        modifiers: {},
        onCreate: () => { }
    };

    private propsMode: string;
    private popper: Node | undefined;
    private appended: boolean;
    private _timer: number;
    private dropdownMaxHeight: number = 198;
    private dropdownClass: string = '.m-dropdown__list';

    @Watch('showPopper')
    public showPopperChanged(value) {
        if (value) {
            this.$emit('show');
            this.updatePopper();
        } else {
            this.$emit('hide');
        }
    }

    @Watch('forceShow', { immediate: true })
    public forceShowChanged(value) {
        this[value ? 'doShow' : 'doClose']();
    }

    private created(): void {
        this.popperOptions = { ...this.popperOptions, ...this.options };
    }

    private mounted(): void {
        this.propsMode = this.$props.mode;
        this.referenceElm = this.reference || this.$slots.reference[0].elm;
        this.popper = this.$slots.default[0].elm;

        switch (this.trigger) {
            case 'click':
                on(this.referenceElm, 'click', this.doToggle);
                if (this.closeOnContentClick) {
                    on(this.popper, 'click', this.doClose);
                }
                on(document, 'click', this.handleDocumentClick);
                break;
            case 'hover':
                on(this.referenceElm, 'mouseover', this.onMouseOver);
                on(this.popper, 'mouseover', this.onMouseOver);
                on(this.referenceElm, 'mouseout', this.onMouseOut);
                on(this.popper, 'mouseout', this.onMouseOut);
                break;
        }

        this.createPopper();
    }

    private doToggle(): void {
        if (!this.forceShow) {
            if (this.toggleOnReferenceClick) {
                this.showPopper = !this.showPopper;
            } else {
                this.doShow();
            }
        }
    }

    private doShow(): void {
        this.showPopper = true;
    }

    private doClose(): void {
        this.showPopper = false;
    }

    private doDestroy(): void {
        if (this.showPopper || !this.popperJS) {
            return;
        }

        this.popperJS.destroy();
        this.popperJS = undefined;
    }

    private createPopper(): void {
        this.$nextTick(() => {
            if (this.visibleArrow) {
                this.appendArrow(this.popper);
            }

            if (this.appendToBody) {
                if (!(typeof this.popper === 'undefined')) {
                    document.body.appendChild(this.popper);
                }
            }

            if (this.popperJS && this.popperJS.destroy) {
                this.popperJS.destroy();
            }

            if (this.boundariesSelector) {
                const boundariesElement = document.querySelector(this.boundariesSelector);

                if (boundariesElement) {
                    this.popperOptions.modifiers = { ...this.popperOptions.modifiers };
                    this.popperOptions.modifiers.preventOverflow = { ...this.popperOptions.modifiers.preventOverflow };
                    this.popperOptions.modifiers.preventOverflow.boundariesElement = boundariesElement;
                }
            }

            this.popperOptions.onCreate = () => {
                this.$emit('created', this);
                this.$nextTick(this.updatePopper);
            };

            this.popperJS = new Popper(this.referenceElm, this.popper, this.popperOptions);
        });
    }

    private destroyPopper(): void {
        off(this.referenceElm, 'click', this.doToggle);
        off(this.referenceElm, 'mouseup', this.doClose);
        off(this.referenceElm, 'mousedown', this.doShow);
        off(this.referenceElm, 'focus', this.doShow);
        off(this.referenceElm, 'blur', this.doClose);
        off(this.referenceElm, 'mouseout', this.onMouseOut);
        off(this.referenceElm, 'mouseover', this.onMouseOver);
        off(document, 'click', this.handleDocumentClick);

        this.popperJS = undefined;
    }

    private appendArrow(element): void {
        if (this.appended) {
            return;
        }

        this.appended = true;

        const arrow = document.createElement('div');
        arrow.setAttribute('x-arrow', '');
        arrow.className = 'popper__arrow';
        element.appendChild(arrow);
    }

    private updatePopper(): void {
        this.popperJS ? this.popperJS.update() : this.createPopper();
    }

    private onMouseOver(): void {
        this.showPopper = true;
        clearTimeout(this._timer);
    }

    private onMouseOut(): void {
        this._timer = window.setTimeout(() => {
            this.showPopper = false;
        }, 10);
    }

    private handleDocumentClick(e): void {
        if (!this.$el || !this.referenceElm || !this.popper ||
            this.$el.contains(e.target) ||
            this.referenceElm.contains(e.target) ||
            this.popper.contains(e.target) ||
            this.forceShow) {
            return;
        }

        this.showPopper = false;
    }

    private destroyed() {
        this.destroyPopper();
    }

    private animEnter(element, done): void {
        this.isAnimPopperActive = true;
        if (this.propsMode == 'dropdown' && !this.appendToBody) {
            let el = element.querySelector(this.dropdownClass);
            let height: number = el.clientHeight > this.dropdownMaxHeight ? this.dropdownMaxHeight : el.clientHeight;
            el.style.overflowY = 'hidden';
            el.style.maxHeight = '0';
            setTimeout( () => {
                el.style.maxHeight = height + 'px';
                done();
            }, 0);
        } else {
            done();
        }
    }

    private animAfterEnter(element): void {
        if (this.propsMode == 'dropdown' && !this.appendToBody) {
            let el = element.querySelector(this.dropdownClass);
            setTimeout(() => {
                el.style.maxHeight = this.dropdownMaxHeight + 'px';
                el.style.overflowY = 'auto';
            }, 300);
        }
    }

    private animLeave(element, done): void {
        if (this.propsMode == 'dropdown' && !this.appendToBody) {
            let el = element.querySelector(this.dropdownClass);
            let height: number = el.clientHeight;
            el.style.maxHeight = height + 'px';
            el.style.overflowY = 'hidden';
            el.style.maxHeight = '0';
            setTimeout(() => {
                el.style.maxHeight = 'none';
                this.isAnimPopperActive = false;
                done();
            }, 300);
        } else {
            this.isAnimPopperActive = false;
            done();
        }
    }
}

const PopperPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(POPPER_NAME, MPopper);
    }
};

export default PopperPlugin;

// Add and remove events listeners that support IE implementation.
function on(element, event, handler) {
    if (element && event && handler) {
        document.addEventListener ? element.addEventListener(event, handler, false) : element.attachEvent('on' + event, handler);
    }
}

function off(element, event, handler) {
    if (element && event) {
        document.removeEventListener ? element.removeEventListener(event, handler, false) : element.detachEvent('on' + event, handler);
    }
}
