export function filterNewLines(html: string): string {
    return html.replace(/\n|\r/g, '');
}

export function filterTag(tag: string, html: string): string {
    const regex: RegExp = new RegExp(`<${tag}([^>]*)>(.*)</${tag}>`, 'gi');

    return html.replace(regex, '');
}

export function filterTags(tags: string[], html: string): string {
    tags.forEach((tag) => { html = filterTag(tag, html); });

    return html;
}

export function filterImg(html: string): string {
    return html.replace(/<img([^>]*)>/g, '');
}

export function replaceTag(tag, replace, html): string {
    const openingTag: RegExp = new RegExp(`<${tag}([^>]*)>`, 'gi');
    return html.replace(openingTag, `<${replace}>`).replace(`${tag}>`, `${replace}>`);
}

export function replaceTags(tags: string[], replace: string, html: string): string {
    tags.forEach((tag) => { html = replaceTag(tag, replace, html); });

    return html;
}

export function eraseTag(tag: string, html: string): string {
    const regex: RegExp = new RegExp(`(<${tag}([^>]*)>)|(</${tag}>)`, 'gi');

    return html.replace(regex, '');
}

export function eraseTags(tags: string[], html: string): string {
    tags.forEach((tag) => { html = eraseTag(tag, html); });

    return html;
}
