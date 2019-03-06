/* tslint:disable:no-console */
import 'intersection-observer';

export enum MScrollSpyClassNames {
    Current = 'm--is-current'
}

export class ElementMap {
    isShowing: boolean;
    menuElement: HTMLElement;
    observeElement: HTMLElement;
}

class ScrollSpy {
    private sectionsMap: Map<string, boolean> = new Map<string, boolean>();
    private elementsMap: Map<string, HTMLElement> = new Map<string, HTMLElement>();
    private mapElements: Map<string, ElementMap> = new Map<string, ElementMap>();

    private observer: IntersectionObserver;

    public addElementToObserve(element: HTMLElement, id: string): void {
        let monElement: ElementMap = new ElementMap();
        this.mapElements.set(id, monElement);

        monElement.menuElement = element;

        const section: HTMLElement | null = document.getElementById(id);
        this.observer = new IntersectionObserver((entries: IntersectionObserverEntry[]) => {
            entries.forEach(entry => {
                monElement.isShowing = entry.isIntersecting;
            });

            this.searchFirstCurrent();
        });
        if (section) {
            this.observer.observe(section);
            monElement.isShowing = false;
            monElement.observeElement = section;
            this.mapElements.set(id, monElement);
        }
    }

    public removeElementObserved(id: string): void {
        const myElementToRemove: ElementMap | undefined = this.mapElements.get(id);
        if (myElementToRemove) {
            this.observer.unobserve(myElementToRemove.observeElement);
        }
    }

    private searchFirstCurrent(): void {
        let elementFound: Boolean = false;
        this.mapElements.forEach((value: ElementMap, key: string) => {
            const myCurentHTMLElement: ElementMap | undefined = this.mapElements.get(key);
            if (myCurentHTMLElement) {
                myCurentHTMLElement.menuElement.classList.remove(MScrollSpyClassNames.Current);

                if (value.isShowing && !elementFound) {
                    myCurentHTMLElement.menuElement.classList.add(MScrollSpyClassNames.Current);
                    elementFound = true;
                }
            }
        });
    }

}

const ScrollSpyUtil: ScrollSpy = new ScrollSpy();
export default ScrollSpyUtil;
