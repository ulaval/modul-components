import Vue, { PluginObject } from 'vue';
import { sprintf, vsprintf } from '../str/str';


declare module 'vue/types/vue' {
    interface Vue {
        $i18n: Messages;
    }
}

/**
 * This package provides language and locales utilities.
 */

/**
 * French language code.
 */
export const FRENCH: string = 'fr';

/**
 * English language code.
 */
export const ENGLISH: string = 'en';

/**
 * Regex to parse and format messages.
 */
const FORMAT_REGEX: RegExp = /{\d+}/g;

/**
 * String used as a special characters wrapper
 */
const SPECIAL_CHARACTER_PREFIXE: string = '_';
const SPECIAL_CHARACTER_SUFIXE: string = '_';

export type MessageMap = {
    [key: string]: string;
};

export type BundleMessagesMap = {
    [bundle: string]: MessageMap;
};

type LanguageBundlesMap = {
    [language: string]: BundleMessagesMap;
};

type SpecialCharacterMap = {
    [key: string]: SpecialCharacter
};

/**
 * Special characters must be represented as their unicode equivalent \u00xxxx
 */
export enum SpecialCharacter {
    NBSP = '160', // non-breaking space equivalent to HTML entity : &nbsp; => ()
    NBHYPHEN = '8209', // non-breaking hyphen equivalent to unicode : \u002011, HTML entity : &#8209; => (‑)
    EMDASH = '8212', // em dash equivalent to unicode :\u002014, HTML entity : &mdash; => (—)
    ENDASH = '8211' // en dash equivalent to unicode :\u002013, HTML entity : &#ndash; => (–)
}

export enum DebugMode {
    Throw,
    Warn,
    Prod
}

export interface I18nPluginOptions {
    curLang?: string;
    debug?: DebugMode;
    formatMode?: FormatMode;
}

export enum FormatMode {
    Default = '',
    Vsprintf = 'vsprintf',
    Sprintf = 'sprintf'
}

export class Messages {
    private curLang: string = ENGLISH;
    private curLocale: string;
    private formatMode: FormatMode;
    private messages: LanguageBundlesMap = {};
    private specialCharacterDict: SpecialCharacterMap = {};

    constructor(private options?: I18nPluginOptions) {
        if (options) {
            if (options.curLang) {
                this.currentLang(options.curLang);
            }
            if (options.formatMode) {
                this.formatMode = options.formatMode;
            }
        }
        this.initSpecialCharactersDict();
    }

    /**
     * Set the application language globally
     *
     * @param lang The language, for example: 'en'
     */
    public currentLang(lang?: string): string {
        if (lang) {
            this.curLang = lang;
            this.curLocale = this.getCurrentLocale();
        }
        return this.curLang;
    }

    /**
     * Get current locale
     */
    public getCurrentLocale(): string {
        let locale: string;
        switch (this.curLang) {
            case FRENCH:
                locale = 'fr-CA';
                break;
            case ENGLISH:
            default:
                locale = 'en-CA';
                break;
        }
        return locale;
    }

    public get currentLocale(): string {
        return this.curLocale;
    }

    /**
     * Adds the messages so that they can be resolved.
     *
     * @param lang The language, for example: 'en'
     * @param messages The messages
     */
    public addMessages(lang: string, bundle: BundleMessagesMap): void {
        let languageBundles: BundleMessagesMap = this.messages[lang];
        this.messages[lang] = { ...languageBundles, ...bundle };
    }

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
    public translate(
        key: string,
        params: any = [],
        nb?: number,
        modifier?: string,
        htmlEncodeParams: boolean = true,
        formatMode: FormatMode = this.formatMode
    ): string {
        if (!key) {
            throw new Error('The key is empty.');
        }

        let val: string = this.resolveKey(this.curLang, key, nb, modifier);

        if (htmlEncodeParams && params.length) {
            Object.keys(params).forEach((key: any) => { params[key] = htmlEncode(params[key].toString()); });
        }

        if (formatMode === FormatMode.Sprintf || formatMode === FormatMode.Vsprintf) {
            params = Object.assign(this.specialCharacterDict, params);
        }

        val = this.format(val, params, formatMode);

        return val;
    }

    /**
     * format a string with depending on the option formatMode
     * @param {string} val the string to format
     * @param {any[]} params the values to insert in string
     */
    private format(val: string, params: any, formatMode: FormatMode): string {
        switch (formatMode) {
            case FormatMode.Vsprintf:
                return vsprintf(val, params);
            case FormatMode.Sprintf:
                return sprintf(val, params);
            default:
                return formatRegexp(val, params);
        }
    }

    private resolveKey(
        lang: string,
        key: string,
        nb?: number,
        modifier?: string,
        encodeParams?: boolean
    ): string {
        let val: string | undefined = undefined;

        if (nb && modifier) {
            // key.nb.modifier
            val = this.findKey(lang, `${key}.${nb}.${modifier}`);

            if (val) {
                return val;
            }

            // key.p.modifier
            if (nb > 1) {
                val = this.findKey(lang, `${key}.p.${modifier}`);

                if (val) {
                    return val;
                }
            }
        }

        if (nb) {
            // key.nb
            val = this.findKey(lang, `${key}.${nb}`);

            if (val) {
                return val;
            }

            // key.p
            if (nb > 1) {
                val = this.findKey(lang, `${key}.p`);

                if (val) {
                    return val;
                }
            }
        }

        if (modifier) {
            // key.modifier
            val = this.findKey(lang, `${key}.${modifier}`);

            if (val) {
                return val;
            }
        }

        // key
        val = this.findKey(lang, key);

        if (val) {
            return val;
        }

        let error: string = `The key ${key} does not exist. Current lang: ${this.curLang}`;
        if (this.options && this.options.debug === DebugMode.Throw) {
            throw new Error(error);
        } else {
            if (!this.options || this.options.debug === DebugMode.Warn) {
                Vue.prototype.$log.warn(error);
            } else {
                Vue.prototype.$log.debug(error);
            }
            return key;
        }
    }

    /**
     * Build the list of special characters that are automatically replaced to the desired pattern
     *
     * Example with '_' as PREFIXE and SUFIXE
     * NBSP => _NBSP_ : '\xOA'
     */
    private initSpecialCharactersDict(): void {
        Object.keys(SpecialCharacter).forEach((key: string) => {
            this.specialCharacterDict[`${SPECIAL_CHARACTER_PREFIXE}${key}${SPECIAL_CHARACTER_SUFIXE}`] = String.fromCharCode(SpecialCharacter[key]) as SpecialCharacter;
        });
    }


    /**
     * Finds a key in the available messages or returns null.
     *
     * @param lang The language to use
     * @param key The key to find
     */
    private findKey(lang: string, key: string): string | undefined {
        const parts: string[] = key.split(':');

        if (parts.length !== 2) {
            let error: string = `The key ${key} is invalid. The key needs to be in the format <bundle>:<id>`;
            if (this.options && this.options.debug === DebugMode.Throw) {
                throw new Error(error);
            } else {
                if (!this.options || this.options.debug === DebugMode.Warn) {
                    Vue.prototype.$log.warn(error);
                } else {
                    Vue.prototype.$log.debug(error);
                }
                return undefined;
            }
        }

        const bundleName: string = parts[0];
        const id: string = parts[1];

        const langMsgs: BundleMessagesMap = this.messages[lang];
        const bundleMsgs: MessageMap = langMsgs && langMsgs[bundleName];
        return bundleMsgs && bundleMsgs[id];
    }
}

/**
 * Formats a value containing parameters.
 *
 * The format is 'This is a {0} containing {1}...'
 */
function formatRegexp(val: string, params: string[]): string {
    return val.replace(FORMAT_REGEX, match => {
        // TODO: should use the regex variable notation instead of parsing the regex match
        let index: number = parseInt(match.substring(1, match.length - 1), 10);

        if (index >= params.length) {
            Vue.prototype.$log.warn(
                `The parameter ${index} doesn't exist while translating: '${val}'`
            );
        }

        return params[index];
    });
}

/**
 * Encodes a value so that it can be inserted in an html string.
 * @param val The value to encode
 */
function htmlEncode(val: string): string {
    return val
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

const MessagePlugin: PluginObject<any> = {
    install(v, options): void {
        v.prototype.$log.debug('$i18n', 'plugin.install');

        let msg: Messages = new Messages(options);
        (v.prototype).$i18n = msg;
    }
};

export default MessagePlugin;
