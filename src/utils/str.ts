export function startsWith(text: string | undefined, startsWith: string | undefined): boolean {
    let undef: string | undefined = undefined;
    return (text === undef && startsWith === undef) // both undef
        || (text !== undef && startsWith !== undef && !text && !startsWith) // both empty
        || (!!text && startsWith !== undef && !startsWith) // startsWith empty
        || (!!text && !!startsWith && text.slice(0, startsWith.length) == startsWith);
}
