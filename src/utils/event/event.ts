export const targetIsInput: (element: HTMLElement, event: Event) => boolean = (element: HTMLElement, event: Event): boolean => {
    let recursiveElement: HTMLElement = event.target as HTMLElement;
    while (recursiveElement && recursiveElement !== element) {
        if (['INPUT', 'TEXTAREA'].find(elem => elem === recursiveElement.tagName) || recursiveElement.contentEditable === 'true') {
            return true;
        }
        recursiveElement = recursiveElement.parentElement as HTMLElement;
    }

    return false;
};
