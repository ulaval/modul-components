import Vue, { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

import { ElementQueries } from '../../mixins/element-queries/element-queries';
import { MediaQueries } from '../../mixins/media-queries/media-queries';
import { ModulVue } from '../../utils/vue/vue';
import { LIMIT_TEXT_NAME } from '../component-names';
import I18nPlugin from '../i18n/i18n';
import LinkPlugin from '../link/link';
import WithRender from './limit-text.html?style=./limit-text.scss';

// @WithRender
// @Component
// export class MLimitText extends ModulVue {

//     @Prop()
//     public open: boolean;

//     @Prop({ default: 4 })
//     public lines: number;

//     @Prop()
//     public openLabel: string;

//     @Prop()
//     public closeLabel: string;

//     private openHiddenText: string = this.$i18n.translate('m-limit-text:open');
//     private closeHiddenText: string = this.$i18n.translate('m-limit-text:close');
//     private internalOpen: boolean = false;
//     private contentHeight: number = 0;
//     private maxHeight: number = 0;
//     private overflow: boolean = false;

//     protected mounted(): void {
//         Vue.nextTick(() => {
//             this.computeHeight();
//         });
//     }

//     protected updated(): void {
//         this.computeHeight();
//     }

//     private computeHeight(): void {
//         this.contentHeight = (this.$refs.container as HTMLElement).scrollHeight;
//         this.maxHeight = (this.$refs.test as HTMLElement).clientHeight * this.lines;
//         this.overflow = this.contentHeight > this.maxHeight;
//     }

//     private get maxHeightStyle(): string | undefined {
//         if (this.overflow) {
//             return this.propOpen ? this.contentHeight + 'px' : this.maxHeight + 'px';
//         }
//         return 'none';
//     }

//     private get propOpen(): boolean {
//         if (this.open !== undefined) {
//             return this.open;
//         }
//         return this.internalOpen;
//     }

//     private onOpen(): void {
//         this.internalOpen = true;
//         this.$emit('update:open', true);
//     }

//     private onClose(): void {
//         this.internalOpen = false;
//         this.$emit('update:open', false);
//     }

//     private get openText(): string {
//         return `[ ${this.openLabel || this.openHiddenText} ]`;
//     }

//     private get closeText(): string {
//         return `[ ${this.closeLabel || this.closeHiddenText} ]`;
//     }
// }

// const LimitTextPlugin: PluginObject<any> = {
//     install(v, options): void {
//         v.prototype.$log.warn(LIMIT_TEXT_NAME + ' is not ready for production');
//         v.use(I18nPlugin);
//         v.use(LinkPlugin);
//         v.component(LIMIT_TEXT_NAME, MLimitText);
//     }
// };

// export default LimitTextPlugin;

@WithRender
@Component({
    mixins: [MediaQueries, ElementQueries]
})
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
    private hasFinish: boolean = false;
    private child: ModulVue;
    private el: HTMLElement;
    private initLineHeigh: any = '';
    private maxHeight: number = 0;
    private previousOrientation: string;

    protected mounted(): void {
        this.originalContent = this.$refs.originalText['innerHTML'];
        this.el = this.$refs.originalText as HTMLElement;
        this.initLineHeigh = parseFloat(String(window.getComputedStyle(this.el).lineHeight).replace(/,/g, '.')).toFixed(2);
        this.maxHeight = this.maxNumberOfLine * this.initLineHeigh;

        // Add the close link if an HTML tag is present
        if (this.originalContent.match('</')) {
            let tagIndex: number = this.originalContent.lastIndexOf('</');
            this.fullContent = this.originalContent.substring(0,tagIndex) + this.closeLink + this.originalContent.substring(tagIndex);
        } else {
            this.fullContent = this.originalContent + this.closeLink;
        }
        // Get the limited text
        this.adjustText();

        // Resize section ------------
        this.previousOrientation = window.screen['orientation']['type'];
        this.as<ElementQueries>().$on('resizeDone', this.checkOrientation);
        // window.addEventListener('orientationchange', this.checkOrientation);
        // ---------------------------
    }

    protected destroyed(): void {
        if (this.child) {
            this.child.$off('click');
        }
    }

    private adjustText(): void {
        if (this.isContentTooTall(false)) {
            this.hasFinish = false;
            this.getReduceContent();
            this.hasFinish = true;
        } else {
            this.hasFinish = false;
        }
    }

    private checkOrientation(): void {
        if (window.screen['orientation']['type'] !== this.previousOrientation) {
            this.previousOrientation = window.screen['orientation']['type'];
            this.reset();
        }
    }

    private isContentTooTall(update: boolean): boolean {
        if (update) { this.updateContent(this.reduceContent, this.el); }
        let currentHeight: number = (this.el as HTMLElement).clientHeight;
        return (currentHeight > this.maxHeight);
    }

    private updateContent(content, el): void {
        el.innerHTML = content;
    }

    private reset(): void {
        this.hasFinish = false;
        this.el.innerHTML = this.originalContent;
        this.reduceContent = '';
        this.$nextTick(() => {
            this.adjustText();
        });
    }

    private getReduceContent(): void {
        let HTMLcontent: string = this.fullContent;
        let index: number = 0;
        let lastValidContent: string = '';
        let closingTag: string = '';

        while (index < HTMLcontent.length && !this.isContentTooTall(true)) {
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

    private get getReduceText(): string {
        return this.reduceContent;
    }

    private get getFullText(): string {
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

    private openText(): void {
        this.open = true;
    }

    private closeText(): void {
        this.open = false;
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
    install(v, options): void {
        v.prototype.$log.warn(LIMIT_TEXT_NAME + ' is not ready for production');
        v.use(I18nPlugin);
        v.use(LinkPlugin);
        v.component(LIMIT_TEXT_NAME, MLimitText);
    }
};

export default LimitTextPlugin;
