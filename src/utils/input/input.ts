export interface InputSelectable {
    selection: string;
    updateSelection(): void;
}

export function changeSelection(input: HTMLInputElement, selection: string): void {
    const indexSelection: number = input.value.indexOf(selection || '');
    if (input && selection && indexSelection >= 0) {
        input.focus();
        input.setSelectionRange(indexSelection, indexSelection + selection.length);
    }
}
