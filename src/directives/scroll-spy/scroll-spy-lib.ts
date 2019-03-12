/* tslint:disable:no-console */
import 'intersection-observer';
import { dispatchEvent } from '../../utils/vue/events';
import { IntersectionObserverOptions } from './scroll-spy';

export class ElementMap {
    isCurrent: boolean;
    id: string;
    isShowing: boolean;
    menuElement: HTMLElement;
    observeElement: HTMLElement;
}

export enum MScrollSpyEventNames {
    OnScrolling = 'spy:scrolling'
}

export interface HtmlElement extends Map<string, ElementMap> {
    htmlElement: HtmlElement;
}

class ScrollSpy {
    private elementsMap: Map<string, ElementMap> = new Map<string, ElementMap>();
    private observer: IntersectionObserver;

    public addElementToObserve(elementParent: HTMLElement, options: IntersectionObserverOptions): void {

        elementParent.childNodes.forEach(nodeElement => {
            const element: HTMLElement = nodeElement as HTMLElement;
            let myElement: ElementMap = new ElementMap();
            const myCurrentId: string | undefined = element.dataset.scrollSpyId;
            if (myCurrentId) {
                this.elementsMap.set(myCurrentId, myElement);
                myElement.menuElement = element;
                myElement.id = myCurrentId;

                const section: HTMLElement | null = document.getElementById(myCurrentId);
                this.observer = new IntersectionObserver((entries: IntersectionObserverEntry[]) => {
                    entries.forEach(entry => {
                        myElement.isShowing = entry.isIntersecting;
                    });
                    this.assignClassToFirstCurrent();
                }, options);

                if (section) {
                    this.observer.observe(section);
                    myElement.observeElement = section;
                    this.elementsMap.set(myCurrentId, myElement);
                }

            }
        });
    }

    public removeElementObserved(elementParent: HTMLElement): void {
        elementParent.childNodes.forEach(nodeElement => {
            const element: HTMLElement = nodeElement as HTMLElement;
            const myCurrentId: string | undefined = element.dataset.scrollSpyId;
            if (myCurrentId) {
                const myElementToRemove: ElementMap | undefined = this.elementsMap.get(myCurrentId);
                if (myElementToRemove) {
                    this.observer.unobserve(myElementToRemove.observeElement);
                }
            }

        });
    }

    private assignClassToFirstCurrent(): void {
        let elementFound: Boolean = false;
        let currentHtmlElement: HTMLElement | undefined = undefined;
        this.elementsMap.forEach((myElement: ElementMap, key: string) => {
            let currentElementMap: ElementMap = myElement;
            currentHtmlElement = currentElementMap.menuElement;
            currentElementMap.isCurrent = false;
            if (myElement.isShowing && !elementFound) {
                elementFound = true;
                currentElementMap.isCurrent = true;
            }
            this.elementsMap.set(key, currentElementMap);
        });

        if (currentHtmlElement) {
            const myEmitMap: Map<string, ElementMap> = this.elementsMap;
            const customEvent: CustomEvent = document.createEvent('CustomEvent');
            customEvent.initCustomEvent(MScrollSpyEventNames.OnScrolling, true, true, Object.assign('htmlElement', { myEmitMap }));
            (customEvent as any).htmlElement = myEmitMap;
            dispatchEvent(currentHtmlElement, MScrollSpyEventNames.OnScrolling, customEvent);
        }
    }

}

const ScrollSpyUtil: ScrollSpy = new ScrollSpy();
export default ScrollSpyUtil;
