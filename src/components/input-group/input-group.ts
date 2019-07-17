import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import uuid from '../../utils/uuid/uuid';
import { INPUT_GROUP_NAME } from '../component-names';
import ValidationMessagePlugin from '../validation-message/validation-message';
import { InputManagement } from './../../mixins/input-management/input-management';
import { InputState } from './../../mixins/input-state/input-state';
import { ModulVue } from './../../utils/vue/vue';
import WithRender from './input-group.html?style=./input-group.scss';

export enum MMInputGroupValidationMessagePosition {
    Top = 'top',
    Bottom = 'bottom'
}

export interface MInputGroupProps {
    readonly label: string;
    readonly requiredMarker?: boolean;
    readonly validationMessagePosition?: MMInputGroupValidationMessagePosition;
}

@WithRender
@Component({
    mixins: [
        InputState,
        InputManagement
    ]
})
export class MInputGroup extends ModulVue implements MInputGroupProps {

    @Prop()
    readonly label!: string;
    @Prop()
    readonly requiredMarker!: boolean;

    @Prop({
        default: MMInputGroupValidationMessagePosition.Top,
        validator: value =>
            value === MMInputGroupValidationMessagePosition.Top ||
            value === MMInputGroupValidationMessagePosition.Bottom
    })
    public validationMessagePosition: MMInputGroupValidationMessagePosition;

    get hasLabel(): boolean {
        return !!this.label;
    }

    get isValidationMessagePositionBottom(): boolean {
        return this.validationMessagePosition === MMInputGroupValidationMessagePosition.Bottom;
    }

    get idLabel(): string | undefined {
        return this.hasLabel ? uuid.generate() : undefined;
    }

    get idValidationMessage(): string | undefined {
        return this.as<InputState>().errorMessage || this.as<InputState>().validMessage || this.as<InputState>().helperMessage ? uuid.generate() : undefined;
    }
}


const InputGroupPlugin: PluginObject<any> = {
    install(v, options): void {
        v.use(ValidationMessagePlugin);
        v.component(INPUT_GROUP_NAME, MInputGroup);
    }
};

export default InputGroupPlugin;
