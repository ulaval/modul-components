/**
 * @param {Object}  The enum to convert
 * @return {string} The array of objects containing the pairs of key/value of the enum
 */
export function toArray(e: Object): { key: string | number, value: string }[] {
    return Object.keys(e)
        .map(key => ({
            key: key,
            value: e[key].toString()
        }));
}
