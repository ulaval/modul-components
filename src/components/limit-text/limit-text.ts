import { ModulVue } from '../../utils/vue/vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import WithRender from './limit-text.html?style=./limit-text.scss';
import { LIMIT_TEXT_NAME } from '../component-names';

export const MODE_LOADING: string = 'loading';
export const MODE_PROCESSING: string = 'processing';

@WithRender
@Component
export class MLimitText extends ModulVue {
    @Prop({ default: 4 })
    public maxNumberOfLine: number;
    @Prop()
    public label: string;

    public componentName = LIMIT_TEXT_NAME;
    private reduceContent: string = '';
    private originalContent: string = '';
    private fullContent: string = '';
    private open: boolean = false;
    private ready: boolean = false;
    private child: ModulVue;

    protected destroyed(): void {
        if (this.child) {
            this.child.$off('click');
        }
    }

    private mounted(): void {
        this.originalContent = this.$refs.originalText['innerHTML'];
        if (this.originalContent.match('</')) {
            let tagIndex = this.originalContent.lastIndexOf('</');
            this.fullContent = this.originalContent.substring(0,tagIndex) + this.closeLink + this.originalContent.substring(tagIndex);
        } else {
            this.fullContent = this.originalContent + this.closeLink;
        }
        this.adjustText();
        this.ready = true;
        // let windowWidth = document.documentElement.clientWidth;
        // window.addEventListener('resize', () => {
        //     if (document.documentElement.clientWidth != windowWidth) {
        //         windowWidth = document.documentElement.clientWidth;
        //         this.adjustText();

        //     }
        // });
    }

    private adjustText(): void {
        if (this.isContentToHeigh(false)) {
            this.getReduceContent();
        } else {
            // ok
        }
    }

    private isContentToHeigh(update: boolean): boolean {
        if (update) { this.updateContent(this.reduceContent); }
        let el = this.$refs.originalText as HTMLElement;
        let initLineHeigh: any = parseFloat(String(window.getComputedStyle(el).lineHeight).replace(/,/g, '.')).toFixed(2);
        let maxHeight: number = this.maxNumberOfLine * initLineHeigh;
        let currentHeight: number = (el as HTMLElement).clientHeight;
        return (currentHeight > maxHeight);
    }
    private updateContent(content): void {
        this.$refs.originalText['innerHTML'] = content;
    }

    private getReduceContent(): void {
        let HTMLcontent = this.fullContent;
        let index: number = 0;
        let lastValidContent: string = '';
        let closingTag: string = '';

        while (index < HTMLcontent.length && !this.isContentToHeigh(true)) {
            if (HTMLcontent[index] === '<' && (index + 1) < HTMLcontent.length) {
                switch (true) {
                    // Opening tag
                    case /\w/.test(HTMLcontent[index + 1]):
                        let tag: string = '</';
                        index++;
                        let endTagName: boolean = false;
                        while (HTMLcontent[index] !== '>') {
                            if (!endTagName && /\w/.test(HTMLcontent[index])) {
                                tag += HTMLcontent[index];
                            } else {
                                endTagName = true;
                            }
                            index++;
                        }
                        tag += '>';
                        // Do not keep the tag if it is a "self closing" tag
                        if (/<\/(area|base|br|col|command|embed|hr|img|input|keygen|link|meta|param|source|track|wbr)$/.test(closingTag)) {
                            closingTag = closingTag.slice(tag.length);
                        } else {
                            closingTag = tag + closingTag;
                        }
                        break;
                    // Closing tag
                    case (HTMLcontent[index + 1] === '/'):
                        let endTag: string = '</';
                        index += 2;
                        while (HTMLcontent[index] !== '>') {
                            endTag += HTMLcontent[index];
                            index++;
                        }
                        endTag += '>';
                        closingTag = closingTag.slice(endTag.length);
                        break;
                }
            }
            lastValidContent = this.reduceContent;
            this.reduceContent = HTMLcontent.substring(0, index + 1) + this.openLinkOriginal + closingTag;
            index++;
        }
        this.reduceContent = lastValidContent.replace(this.openLinkOriginal, this.openLink);
    }

    private getReduceText(): string {
        return this.reduceContent;
    }

    private getFullText(): string {
        return this.fullContent;
    }

    private get openLinkOriginal(): string {
        return `... <m-link style="font-weight:400;" mode="button" hiddenText="` + this.$i18n.translate('m-limit-text:open') + `" :underline="false">[` + (this.label ? this.label.replace(/\s/g, '\xa0') : '\xa0+\xa0') + `]</m-link>`;
    }

    private get openLink(): string {
        return `... <m-link mode="button" hiddenText="` + this.$i18n.translate('m-limit-text:open') + `" :underline="false">[` + (this.label ? this.label.replace(/\s/g, '\xa0') : '\xa0+\xa0') + `]</m-link>`;
    }

    private get closeLink(): string {
        return `<m-link mode="button" hiddenText="` + this.$i18n.translate('m-limit-text:close') + `" :underline="false">[\xa0-\xa0]</m-link>`;
    }

    private openText(): boolean {
        return this.open = true;
    }

    private closeText(): boolean {
        return this.open = false;
    }

    private onUpdatedOpen(component: any): void {
        if (this.child) {
            this.child.$off('click');
        }
        this.child = component[0].$children[0];
        this.child.$on('click', () => this.openText());
    }

    private onUpdatedClose(component: any): void {
        if (this.child) {
            this.child.$off('click');
        }
        this.child = component[0].$children[0];
        this.child.$on('click', () => this.closeText());
    }
}

const LimitTextPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(LIMIT_TEXT_NAME, MLimitText);
    }
};

export default LimitTextPlugin;
