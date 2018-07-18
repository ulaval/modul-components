import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

import { ElementQueries } from '../../mixins/element-queries/element-queries';
import { InputLabel } from '../../mixins/input-label/input-label';
import { InputState, InputStateInputSelector } from '../../mixins/input-state/input-state';
import { InputWidth } from '../../mixins/input-width/input-width';
import MessagePlugin from '../../utils/i18n/i18n';
import LicensePlugin from '../../utils/license/license';
import uuid from '../../utils/uuid/uuid';
import { ModulVue } from '../../utils/vue/vue';
import { RICH_TEXT_EDIT } from '../component-names';
import { InputManagement, InputManagementData } from './../../mixins/input-management/input-management';
import VueFroala from './adapter/vue-froala';
import { MRichTextEditorDefaultOptions, MRichTextEditorStandardOptions } from './rich-text-edit-options';
import WithRender from './rich-text-edit.html?style=./rich-text-edit.scss';
import { RichTextLicensePluginOptions } from './rich-text-license-plugin';

require('froala-editor/js/froala_editor.pkgd.min');
require('froala-editor/css/froala_editor.pkgd.min.css');
require('froala-editor/js/languages/fr.js');

const RICH_TEXT_LICENSE_KEY: string = 'm-rich-text-license-key';

export enum MRichTextEditMode {
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
export class MRichTextEdit extends ModulVue implements InputManagementData, InputStateInputSelector {
    selector: string = '.fr-element';
    internalValue: string;

    public tag: string = 'textarea';

    @Prop({ default: '' })
    public value: string;

    @Prop({
        default: MRichTextEditMode.STANDARD,
        validator: value => value === MRichTextEditMode.STANDARD
    })
    public mode: MRichTextEditMode;

    @Prop({ default: 0 })
    public toolbarStickyOffset: number;

    @Prop()
    public scrollableContainer: string;

    protected id: string = `mrich-text-${uuid.generate()}`;
    protected get internalOptions(): any {
        const propOptions: any = {
            placeholderText: this.as<InputManagement>()!.placeholder
        };
        propOptions.toolbarStickyOffset = this.toolbarStickyOffset || undefined;
        propOptions.scrollableContainer = this.scrollableContainer || undefined;

        return Object.assign(this.getDefaultOptions(), propOptions);
    }

    protected get froalaLicenseKey(): string {
        return this.$license.getLicense<string>(RICH_TEXT_LICENSE_KEY) || '';
    }

    protected mounted(): void {
        this.as<InputState>().getInput()!.id = this.id;
    }

    protected refreshModel(newValue: string): void {
        this.$emit('input', newValue);
    }

    protected getDefaultOptions(): MRichTextEditorDefaultOptions {
        if (this.mode === MRichTextEditMode.STANDARD) {
            return new MRichTextEditorStandardOptions(this.froalaLicenseKey, this.$i18n.currentLang());
        }

        throw new Error(`rich-text-edit: mode ${this.mode} is not a valid mode.  See MRichTextEditMode Enum for a list of compatible modes.`);
    }
}

export class RichTextLicensePlugin implements PluginObject<RichTextLicensePluginOptions | undefined> {
    install(v, options: RichTextLicensePluginOptions | undefined = { key: '' }): void {
        v.use(LicensePlugin);
        v.use(MessagePlugin);
        if (options.key) {
            (v.prototype as ModulVue).$license.addLicense(RICH_TEXT_LICENSE_KEY, options.key);
        }
        v.use(RICH_TEXT_EDIT, MRichTextEdit);
    }
}

export default RichTextLicensePlugin;
