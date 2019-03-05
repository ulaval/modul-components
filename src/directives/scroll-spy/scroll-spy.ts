/* tslint:disable:no-console */
import { DirectiveOptions, PluginObject, VNode, VNodeDirective } from 'vue';
import { SCROLL_SPY_NAME } from '../directive-names';

const sectionsMap: Map<string, boolean> = new Map<string, boolean>();
const elementsMap: Map<string, HTMLElement> = new Map<string, HTMLElement>();

let observer: IntersectionObserver;
let monIdElementCourant: ScrollSpy;

export enum MScrollSpyClassNames {
    Current = 'm--is-current'
}

class ScrollSpy {

    currentId: string = '';

    constructor(private element: HTMLElement, private id: string) { }

    public createMapObserver(): void {
        elementsMap.set(this.id, this.element);
        const section: HTMLElement | null = document.getElementById(this.id);
        observer = new IntersectionObserver((entries: IntersectionObserverEntry[]) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    sectionsMap.set(entry.target.id, entry.isIntersecting);
                } else {
                    sectionsMap.set(entry.target.id, entry.isIntersecting);
                }
            });

            this.searchFirstCurrent();
        });
        if (section) {
            observer.observe(section);
            sectionsMap.set(section.id, false);
        }
    }

    public KillMapObserver(): void {
        observer.disconnect();
    }

    private searchFirstCurrent(): void {
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

const observeDirective: DirectiveOptions = {
    inserted(element: HTMLElement, binding: VNodeDirective, _node: VNode): void {
        monIdElementCourant = new ScrollSpy(element, binding.value);
        monIdElementCourant.createMapObserver();
    },
    update(element: HTMLElement, binding: VNodeDirective, node: VNode): void {
        monIdElementCourant = new ScrollSpy(element, binding.value);
        monIdElementCourant.createMapObserver();
    },
    unbind(_element: HTMLElement): void {
        monIdElementCourant.KillMapObserver();
    }
};

const ScrollSpyPlugin: PluginObject<any> = {
    install(v, _options): void {
        v.directive(SCROLL_SPY_NAME, observeDirective);
    }
};

export default ScrollSpyPlugin;
