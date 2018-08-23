import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

import { ElementQueries } from '../../mixins/element-queries/element-queries';
import { InputLabel } from '../../mixins/input-label/input-label';
import { InputManagement, InputManagementData } from '../../mixins/input-management/input-management';
import { InputState, InputStateInputSelector } from '../../mixins/input-state/input-state';
import { InputWidth } from '../../mixins/input-width/input-width';
import uuid from '../../utils/uuid/uuid';
import { ModulVue } from '../../utils/vue/vue';
import VueFroala from './adapter/vue-froala';
import { MRichTextEditorDefaultOptions, MRichTextEditorStandardOptions } from './rich-text-editor-options';
import WithRender from './rich-text-editor.html?style=./rich-text-editor.scss';

const RICH_TEXT_LICENSE_KEY: string = 'm-rich-text-license-key';

export enum MRichTextEditorMode {
    STANDARD
}

@WithRender
@Component({
    components: { Froala: VueFroala },
    mixins: [
        InputState,
        InputManagement,
        InputWidth,
        InputLabel,
        ElementQueries
    ]
})
export class MRichTextEditor extends ModulVue implements InputManagementData, InputStateInputSelector {
    selector: string = '.fr-element';
    internalValue: string;

    @Prop({ default: '' })
    public value: string;

    @Prop({
        default: MRichTextEditorMode.STANDARD,
        validator: value => value === MRichTextEditorMode.STANDARD
    })
    public mode: MRichTextEditorMode;

    @Prop({ default: 0 })
    public toolbarStickyOffset: number;

    @Prop()
    public scrollableContainer: string | undefined;

    protected id: string = `mrich-text-${uuid.generate()}`;
    public get internalOptions(): any {
        const propOptions: any = {
            placeholderText: this.as<InputManagement>()!.placeholder
        };
        propOptions.toolbarStickyOffset = this.toolbarStickyOffset;
        propOptions.scrollableContainer = this.scrollableContainer;

        return Object.assign(this.getDefaultOptions(), propOptions);
    }

    public get froalaLicenseKey(): string {
        return this.$license.getLicense<string>(RICH_TEXT_LICENSE_KEY) || '';
    }

    public getDefaultOptions(): MRichTextEditorDefaultOptions {
        if (this.mode === MRichTextEditorMode.STANDARD) {
            return new MRichTextEditorStandardOptions(this.froalaLicenseKey, this.$i18n.currentLang());
        }

        throw new Error(`rich-text-edit: mode ${this.mode} is not a valid mode.  See MRichTextEditMode Enum for a list of compatible modes.`);
    }

    protected refreshModel(newValue: string): void {
        this.$emit('input', newValue);
    }

}
