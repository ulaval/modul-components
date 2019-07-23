import ClipboardJs from 'clipboard';
import { PluginObject } from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { InputMaxWidth } from '../../mixins/input-width/input-width';
import { InputSelectable } from '../../utils/input/input';
import { ModulVue } from '../../utils/vue/vue';
import { COPY_TO_CLIPBOARD_FEEDBACK_NAME, COPY_TO_CLIPBOARD_NAME } from '../component-names';
import I18nPlugin from '../i18n/i18n';
import LinkPlugin from '../link/link';
import TextfieldPlugin from '../textfield/textfield';
import ToastPlugin from '../toast/toast';
import { MCopyToClipboardFeedback } from './copy-to-clipboard-feedback';
import WithRender from './copy-to-clipboard.html';
import './copy-to-clipboard.scss';

interface CopyToClipboardInputProps {
    value: any;
    readonly: boolean;
    selection: string;
}

export interface CopyToClipboardInputSupport extends InputSelectable, CopyToClipboardInputProps {
    value: any;
    readonly: boolean;
    selection: string;
}

class DefaultCopyToClipboardPropsValue implements CopyToClipboardInputProps {
    constructor(public readonly: boolean = true, public selection: string = '', public value: string = '') { }
}

function copyToClipboard(text: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const fakeElement: HTMLButtonElement = document.createElement('button');
        const clipboard: ClipboardJs = new ClipboardJs(fakeElement, {
            text(): string { return text; },
            action(): string { return 'copy'; },
            container: document.body
        });

        clipboard.on('success', (result: any) => {
            clipboard.destroy();
            resolve(result);
        });

        clipboard.on('error', (result: any) => {
            clipboard.destroy();
            reject(result);
        });

        fakeElement.click();
    });
}

@WithRender
@Component
export class MCopyToClipboard extends ModulVue {
    @Prop({
        default: '',
        required: true
    })
    value: string;

    fieldMaxWidth: InputMaxWidth = InputMaxWidth.None;
    labelCopyBtn: string = this.$i18n.translate('m-copy-to-clipboard:copy');
    selectedText: string = '';

    get inputProps(): CopyToClipboardInputProps {
        return new DefaultCopyToClipboardPropsValue(true, this.selectedText, this.value);
    }

    get buttonHandlers(): { [key: string]: (value: string) => void } {
        return {
            click: this.copyText
        };
    }

    selectText(): void {
        requestAnimationFrame(() => {
            this.selectedText = '';
            this.$nextTick(() => {
                this.selectedText = this.value;
            });
        });
    }

    copyText(): void {
        copyToClipboard(this.value);
        this.$emit('copy');
    }
}

const CopyToClipboardPlugin: PluginObject<any> = {
    install(v): void {
        v.component(COPY_TO_CLIPBOARD_NAME, MCopyToClipboard);
        v.component(COPY_TO_CLIPBOARD_FEEDBACK_NAME, MCopyToClipboardFeedback);
        v.use(TextfieldPlugin);
        v.use(LinkPlugin);
        v.use(I18nPlugin);
        v.use(TextfieldPlugin);
        v.use(ToastPlugin);
    }
};

export default CopyToClipboardPlugin;
