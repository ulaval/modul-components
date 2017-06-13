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

    @Prop({
        default: 'hover',
        validator: (value) => ['click', 'hover'].indexOf(value) > -1 }
    )
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
    @Prop({ default: '' })
    public transition: string;
    @Prop()
    public options: Object;

    public referenceElm;
    public popperJS;
    public showPopper: boolean = false;
    public currentPlacement: string = '';
    public popperOptions: IPopperOptions = {
        placement: 'bottom',
        gpuAcceleration: false,
        modifiers: {},
        onCreate: () => {}
    };

    private popper: Node | undefined;
    private appended: boolean;
    private _timer: number;

    @Watch('showPopper')
    public showPopperChanged(value) {
        if (value) {
            this.$emit('show');
            this.updatePopper();
        } else {
            this.$emit('hide');
        }
    }

    @Watch('forceShow', {immediate: true})
    public forceShowChanged(value) {
        this[value ? 'doShow' : 'doClose']();
    }

    public created() {
        this.popperOptions = {...this.popperOptions, ...this.options};
    }

    public mounted() {
        this.referenceElm = this.reference || this.$slots.reference[0].elm;
        this.popper = this.$slots.default[0].elm;

        switch (this.trigger) {
            case 'click':
                on(this.referenceElm, 'click', this.doToggle);
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

    doToggle() {
        if (!this.forceShow) {
            this.showPopper = !this.showPopper;
        }
    }

    doShow() {
        this.showPopper = true;
    }

    doClose() {
        this.showPopper = false;
    }

    doDestroy() {
        if (this.showPopper || !this.popperJS) {
            return;
        }

        this.popperJS.destroy();
        this.popperJS = undefined;
    }

    createPopper() {
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
                    this.popperOptions.modifiers = {...this.popperOptions.modifiers};
                    this.popperOptions.modifiers.preventOverflow = {...this.popperOptions.modifiers.preventOverflow};
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

    destroyPopper() {
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

    appendArrow(element) {
        if (this.appended) {
            return;
        }

        this.appended = true;

        const arrow = document.createElement('div');
        arrow.setAttribute('x-arrow', '');
        arrow.className = 'popper__arrow';
        element.appendChild(arrow);
    }

    updatePopper() {
        this.popperJS ? this.popperJS.update() : this.createPopper();
    }

    onMouseOver() {
        this.showPopper = true;
        clearTimeout(this._timer);
    }

    onMouseOut() {
        this._timer = window.setTimeout(() => {
            this.showPopper = false;
        }, 10);
    }

    handleDocumentClick(e) {
        if (!this.$el || !this.referenceElm ||
            this.$el.contains(e.target) ||
            this.referenceElm.contains(e.target) ||
            !this.popper || this.popper.contains(e.target) ||
            this.forceShow
        ) {
            return;
        }

        this.showPopper = false;
    }

    destroyed() {
        this.destroyPopper();
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
