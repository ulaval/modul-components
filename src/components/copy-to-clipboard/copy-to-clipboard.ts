import ClipboardJs from 'clipboard';
import { PluginObject } from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { ModulVue } from '../../utils/vue/vue';
import { COPY_TO_CLIPBOARD_NAME } from '../component-names';
import I18nPlugin from '../i18n/i18n';
import LinkPlugin from '../link/link';
import TextfieldPlugin from '../textfield/textfield';
import ToastPlugin, { MToastPosition, MToastTimeout } from '../toast/toast';
import WithRender from './copy-to-clipboard.html';
import './copy-to-clipboard.scss';

export interface CopyToClipboardInputSupport {
    value: any;
    readonly: boolean;
    selection: string;
}

class DefaultCopyToClipboardPropsValue implements CopyToClipboardInputSupport {
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

    labelCopyBtn: string = this.$i18n.translate('m-copy-to-clipboard:copy');
    selectedText: string = '';

    get inputProps(): CopyToClipboardInputSupport {
        return new DefaultCopyToClipboardPropsValue(true, this.selectedText, this.value);
    }

    get inputHandlers(): { [key: string]: (value: string) => void } {
        return {
            click: this.selectText
        };
    }

    get buttonHandlers(): { [key: string]: (value: string) => void } {
        return {
            click: this.copyText,
            mousedown: () => requestAnimationFrame(() => this.selectText()) // Avoid selection flicker when spamming copy button.
        };
    }

    selectText(): void {
        this.selectedText = '';
        this.$nextTick(() => {
            this.selectedText = this.value;
        });
    }

    copyText(): void {
        copyToClipboard(this.value);
        this.selectText();
        this.$toast.show({
            text: this.$i18n.translate('m-copy-to-clipboard:copied'),
            position: MToastPosition.BottomLeft,
            timeout: MToastTimeout.xshort
        });
    }
}

const CopyToClipboardPlugin: PluginObject<any> = {
    install(v): void {
        v.component(COPY_TO_CLIPBOARD_NAME, MCopyToClipboard);
        v.use(I18nPlugin);
        v.use(TextfieldPlugin);
        v.use(LinkPlugin);
        v.use(ToastPlugin);
    }
};

export default CopyToClipboardPlugin;
