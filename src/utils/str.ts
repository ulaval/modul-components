export function startsWith(text: string | undefined, value: string | undefined): boolean {
    return (!text && !value) || (!!text && !!value && text.slice(0, value.length) == value);
}
