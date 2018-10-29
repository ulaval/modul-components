export function draggableHasHandle(element: HTMLElement): boolean {
    return element.getElementsByClassName('dragHandle').length > 0;
}

export function isHandleUsedToDrag(event: MouseEvent): boolean {
    let elementDragged: HTMLElement = event.target as HTMLElement;
    return elementDragged.classList.contains('dragHandle');
}
