/* tslint:disable:no-console */

function createMultiTagsRegexString(tags: string[]): string {
    // create a string for a multi tags regexp
    let fullTagForRegex: string = '(';
    for (let i: number = 0; i < tags.length; i++) {
        const tag: string = tags[i];
        fullTagForRegex += (i === tags.length - 1) ? `${tag}` : `${tag}|`;
    }
    fullTagForRegex += ')';

    return fullTagForRegex;
}

export function eraseNewLines(html: string): string {
    return html.replace(/\n|\r/g, '');
}

export function filterByTag(tag: string, html: string): string {
    const regex: RegExp = new RegExp(`<${tag}([^>]*)>(.*)</${tag}>`, 'gi');

    return html.replace(regex, '');
}

export function filterByTags(tags: string[], html: string): string {
    tags.forEach((tag) => { html = filterByTag(tag, html); });

    return html;
}

export function replaceTag(tag, replace, html): string {
    const openingTag: RegExp = new RegExp(`<${tag}([^>]*)>`, 'gi');
    return html.replace(openingTag, `<${replace}>`).replace(`${tag}>`, `${replace}>`);
}

export function replaceTags(tags: string[], replace: string, html: string): string {
    return replaceTag(createMultiTagsRegexString(tags), replace, html);
}

export function eraseTag(tag: string, html: string): string {
    const regex: RegExp = new RegExp(`(<${tag}([^>]*)>)|(</${tag}>)`, 'gi');

    return html.replace(regex, '');
}

export function eraseTags(tags: string[], html: string): string {
    return eraseTag(createMultiTagsRegexString(tags), html);
}
