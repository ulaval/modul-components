/* tslint:disable:no-console */
import { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';
import { ModulVue } from '../../utils/vue/vue';
import { SCROLL_SPY_NAME } from '../directive-names';
import ScrollSpyPlugin from './scroll-spy';
import { HtmlElement } from './scroll-spy-lib';
import WithRender from './scroll-spy.sandbox.html?style=./scroll-spy.sandbox.scss';

enum MScrollSpyClassNames {
    Current = 'm--is-current'
}

@WithRender
@Component
export class MScrollSpySandbox extends ModulVue {

    idSection1: string = 'section1';
    idSection2: string = 'section2';
    idSection3: string = 'section3';
    idSection4: string = 'section4';
    idSection6: string = 'section6';
    idSection7: string = 'section7';
    idSection8: string = 'section8';
    idSection9: string = 'section9';

    menu1: Array<string> = [this.idSection1, this.idSection2, this.idSection3, this.idSection4];
    menu2: Array<string> = [this.idSection6, this.idSection7, this.idSection8, this.idSection9];

    menuElements: HtmlElement;
    currentElement: HTMLElement | undefined = undefined;

    protected mounted(): void {
        this.$modul.event.$on('scrollDone', this.onScrollDone);
    }

    private onScrollDone(): void {
        if (this.currentElement) {
            this.addCurrentMenuClass(this.currentElement);
        }
    }

    scrolling(elements: HtmlElement): void {
        let currentElementFound: Boolean = false;
        this.menuElements = elements;
        elements.htmlElement.forEach(element => {
            if (element.isCurrent && !currentElementFound) {
                currentElementFound = true;
                this.currentElement = element.menuElement;
            } else {
                this.removeCurrentMenuClass(element.menuElement);
            }
        });
        if (!currentElementFound) {
            this.currentElement = undefined;
        }
    }

    naviguer(id: string, event: any): void {
        let sectionAncre: HTMLElement | null = this.$el.querySelector('#' + id);
        if (sectionAncre) {
            this.$scrollTo.goTo(sectionAncre, 0).then(() => {
                this.menuElements.htmlElement.forEach(element => {
                    this.removeCurrentMenuClass(element.menuElement);
                });
                this.currentElement = event.target.parentElement;
                this.addCurrentMenuClass(event.target.parentElement);
            });
        }
    }

    addCurrentMenuClass(element: HTMLElement): void {
        element.classList.add(MScrollSpyClassNames.Current);
    }

    removeCurrentMenuClass(element: HTMLElement): void {
        element.classList.remove(MScrollSpyClassNames.Current);
    }

}

const ScrollSpySandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.use(ScrollSpyPlugin);
        v.component(`${SCROLL_SPY_NAME}-sandbox`, MScrollSpySandbox);
    }
};

export default ScrollSpySandboxPlugin;
