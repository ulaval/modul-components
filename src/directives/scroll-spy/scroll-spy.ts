/* tslint:disable:no-console */
import { DirectiveOptions, PluginObject, VNode, VNodeDirective } from 'vue';
import { SCROLL_SPY_NAME } from '../directive-names';

const sectionsMap: Map<string, boolean> = new Map<string, boolean>();
const elementsMap: Map<string, HTMLElement> = new Map<string, HTMLElement>();

export enum MScrollSpyClassNames {
    Current = 'm--is-current'
}

class ScrollSpy {

    currentId: string = '';

    constructor(private element: HTMLElement, private id: string) { }

    public createMapObserver(): void {
        elementsMap.set(this.id, this.element);
        const section: HTMLElement | null = document.getElementById(this.id);
        const observer: IntersectionObserver = new IntersectionObserver(this.handleIntersection);
        if (section) {
            observer.observe(section);
            sectionsMap.set(section.id, false);
        }
    }

    private handleIntersection(entries: IntersectionObserverEntry[]): void {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                sectionsMap.set(entry.target.id, entry.isIntersecting);
            } else {
                sectionsMap.set(entry.target.id, entry.isIntersecting);
            }
        });

        ScrollSpy.searchFirstCurrent();
    }

    private static searchFirstCurrent(): void {
        let elementFound: Boolean = false;
        sectionsMap.forEach((value: boolean, key: string) => {
            const myCurentHTMLElement: HTMLElement | undefined = elementsMap.get(key);
            if (myCurentHTMLElement) {
                myCurentHTMLElement.classList.remove(MScrollSpyClassNames.Current);

                if (value && !elementFound) {
                    myCurentHTMLElement.classList.add(MScrollSpyClassNames.Current);
                    elementFound = true;
                }
            }
        });
    }
}

const Directive: DirectiveOptions = {
    inserted(element: HTMLElement, binding: VNodeDirective, _node: VNode): void {
        const monIdElementCourant: ScrollSpy = new ScrollSpy(element, binding.value);
        monIdElementCourant.createMapObserver();
    }
};

const ScrollSpyPlugin: PluginObject<any> = {
    install(v, options): void {
        v.directive(SCROLL_SPY_NAME, Directive);
    }
};

export default ScrollSpyPlugin;
