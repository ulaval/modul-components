/**
 * This package provides language and locales utilities.
 */
/**
 * French language code.
 */
export declare const FRENCH = "fr";
/**
 * English language code.
 */
export declare const ENGLISH = "en";
export declare function currentLang(lang?: string): string;
/**
 * Adds the messages so that it can be resolved.
 *
 * @param lang The language, for example: 'en'
 * @param messages The messages
 */
export declare function addMessages(lang: string, messages: any): void;
/**
 * Allows to translate a key into the specified language.
 *
 * The resolution is made in this order:
 *
 * key.nb.modifier
 * key.p.modifier
 * key.nb
 * key.p
 * key.modifier
 * key
 */
export declare function translate(key: string, params?: any[], nb?: number, modifier?: string, htmlEncodeParams?: boolean): string;
