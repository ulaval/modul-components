function createMultiTagsRegexString(tags: string[]): string {
    // create a string for a multi tags regexp
    return `(${tags.join('|')})`;
}

export function eraseNewLines(html: string): string {
    return html.replace(/\n|\r/g, '');
}

export function filterByTag(tag: string, html: string): string {
    const regex: RegExp = new RegExp(`<${tag}([^>]*)>([^]*)</${tag}>`, 'gmi');

    return html.replace(regex, '');
}

export function filterByTags(tags: string[], html: string): string {
    return filterByTag(createMultiTagsRegexString(tags), html);
}

export function replaceTag(tag: string, replace: string, html: string): string {
    const openingTag: RegExp = new RegExp(`<${tag}([^>]*)>`, 'gmi');
    return html.replace(openingTag, `<${replace}>`).replace(`${tag}>`, `${replace}>`);
}

export function replaceTags(tags: string[], replace: string, html: string): string {
    return replaceTag(createMultiTagsRegexString(tags), replace, html);
}

export function eraseTag(tag: string, html: string): string {
    const regex: RegExp = new RegExp(`(<${tag}([^>]*)>)|(</${tag}>)`, 'gmi');

    return html.replace(regex, '');
}

export function eraseTags(tags: string[], html: string): string {
    return eraseTag(createMultiTagsRegexString(tags), html);
}
