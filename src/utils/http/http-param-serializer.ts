export function serializeParams(params: any): any {
    let options: string[] = [];
    for (const key in params) {
        if (typeof params[key] === 'object' && params[key] !== undefined && params[key].length !== undefined) {
            // array
            if (params[key].length > 0) {
                params[key].forEach((el: any) => options.push(`${key}=${serializeValue(el)}`)); // array not empty
            }
        } else if (params[key] !== undefined) {
            options.push(`${key}=${serializeValue(params[key])}`);
        }
    }

    return options.join('&');
}

function serializeValue(value: any): string {
    return typeof value !== 'object'
        ? value
        : toString.call(value) === '[object Date]'
            ? (value as Date).toISOString()
            : JSON.stringify(value);
}
