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
    private elementsMap: Map<string, ElementMap> = new Map<string, ElementMap>();

    private observer: IntersectionObserver;

    public addElementToObserve(element: HTMLElement, id: string): void {
        let monElement: ElementMap = new ElementMap();
        this.elementsMap.set(id, monElement);

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
            this.elementsMap.set(id, monElement);
        }
    }

    public removeElementObserved(id: string): void {
        const myElementToRemove: ElementMap | undefined = this.elementsMap.get(id);
        if (myElementToRemove) {
            this.observer.unobserve(myElementToRemove.observeElement);
        }
    }

    private searchFirstCurrent(): void {
        let elementFound: Boolean = false;
        this.elementsMap.forEach((myElement: ElementMap, key: string) => {
            myElement.menuElement.classList.remove(MScrollSpyClassNames.Current);

            if (myElement.isShowing && !elementFound) {
                myElement.menuElement.classList.add(MScrollSpyClassNames.Current);
                elementFound = true;
            }
        });
    }

}

const ScrollSpyUtil: ScrollSpy = new ScrollSpy();
export default ScrollSpyUtil;
