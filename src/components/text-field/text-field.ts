import Vue from 'vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import WithRender from './text-field.html?style=./text-field.scss';
import { TEXT_FIELD_NAME } from '../component-names';

@WithRender
@Component
export class MTexteField extends Vue {

    @Prop({ default: 'default' })
    public state: string;
    @Prop({ default: '' })
    public value: string;
    @Prop({ default: '' })
    public defaultText: string;
    @Prop({ default: true })
    public isSelectionActive: boolean;
    @Prop({ default: '' })
    public iconName: string;
    @Prop({ default: '' })
    public errorMessage: string;
    @Prop({ default: '' })
    public helperMessage: string;

    public componentName: string = TEXT_FIELD_NAME;

    private propsState: string;
    private propsValue: string;
    private propsDefaultText: string;
    private propsIsSelectionActive: boolean;
    private hasIcon: boolean;
    private hasHelperText: boolean;
    private isValueEmpty: boolean = false;
    private isDefaultTextEmpty: boolean = false;
    private isFocusActive: boolean = false;

    private beforeMount(): void {
        this.propsState = this.$props.state == undefined ? 'default' : this.$props.state;
        this.propsValue = this.$props.value;
        this.propsIsSelectionActive = this.$props.isSelectionActive;
        this.propsDefaultText = this.$props.defaultText;
        this.hasIcon = this.$props.iconName != '';
        this.hasHelperText = this.$props.helperMessage != '';
        this.checkHasValue();
        this.checkHasDefaultText();
    }

    private onFocus(event): void {
        this.isFocusActive = this.isDisabled ? false : true;
        if (!this.isDisabled) {
            this.$refs.input['focus']();
            this.checkHasValue();
            this.checkHasDefaultText();
            this.$emit('onFocus', event, this.propsValue);
        }
    }

    private onBlur(event): void {
        this.isFocusActive = this.isDisabled ? true : false;
        if (!this.isDisabled) {
            this.checkHasValue();
            this.checkHasDefaultText();
            this.$emit('onBlur', event, this.propsValue);
        }
    }

    private onClick(event): void {
        if (!this.isDisabled) {
            this.$emit('onClick', event, this.propsValue);
        }
        event.preventDefault();
    }

    private checkHasValue() {
        this.isValueEmpty = String(this.propsValue).length == 0 ? true : false;
    }

    private get isDisabled(): boolean {
        return this.propsState == 'disabled';
    }

    private get hasError(): boolean {
        return this.$props.errorMessage != '';
    }

    private checkHasDefaultText() {
        if (this.propsDefaultText == '' || this.propsDefaultText == undefined) {
            this.isDefaultTextEmpty = true;
        } else if (this.isValueEmpty && this.isFocusActive) {
            this.isDefaultTextEmpty = false;
        } else {
            this.isDefaultTextEmpty = true;
        }
    }
}

const TextFieldPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(TEXT_FIELD_NAME, MTexteField);
    }
};

export default TextFieldPlugin;
