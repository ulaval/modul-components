/* tslint:disable:no-console */
import 'intersection-observer';
import { dispatchEvent } from '../../utils/vue/events';

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

    public addElementToObserve(elementParent: HTMLElement): void {

        elementParent.childNodes.forEach(nodeElement => {
            const element: HTMLElement = nodeElement as HTMLElement;
            let monElement: ElementMap = new ElementMap();
            const myCurrentId: string | null = element.getAttribute('data-scroll-spy-id');
            if (myCurrentId) {
                this.elementsMap.set(myCurrentId, monElement);
                monElement.menuElement = element;
                monElement.id = myCurrentId;

                const section: HTMLElement | null = document.getElementById(myCurrentId);
                this.observer = new IntersectionObserver((entries: IntersectionObserverEntry[]) => {
                    entries.forEach(entry => {
                        monElement.isShowing = entry.isIntersecting;
                    });
                    this.assignClassToFirstCurrent();
                });

                if (section) {
                    this.observer.observe(section);
                    monElement.observeElement = section;
                    this.elementsMap.set(myCurrentId, monElement);
                }

            }
        });
    }

    public removeElementObserved(elementParent: HTMLElement): void {
        elementParent.childNodes.forEach(nodeElement => {
            const element: HTMLElement = nodeElement as HTMLElement;
            const myCurrentId: string | null = element.getAttribute('data-scroll-spy-id');
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
