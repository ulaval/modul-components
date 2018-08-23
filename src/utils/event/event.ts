export const targetIsInput: (event: Event) => boolean = (event: Event): boolean => {
    let recursiveElement: HTMLElement = event.target as HTMLElement;
    while (recursiveElement && recursiveElement !== this.element) {
        if (['INPUT', 'TEXTAREA'].find(elem => elem === recursiveElement.tagName) || recursiveElement.contentEditable === 'true') {
            return true;
        }
        recursiveElement = recursiveElement.parentElement as HTMLElement;
    }

    return false;
};
