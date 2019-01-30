/* tslint:disable:no-console */
import { PluginObject } from 'vue';

/**
 * Augment the typings of Vue.js
 */

declare module 'vue/types/vue' {
    interface Vue {
        $log: Logger;
    }
}
export interface ConsoleOptions {
    displayLogs?: boolean;
    displayWarnings?: boolean;
    displayDebugs?: boolean;
    displayInfos?: boolean;
    hideAll?: boolean;
}

export class Logger {
    private displayLogs: boolean = true;
    private displayWarnings: boolean = true;
    private displayDebugs: boolean = true;
    private displayInfos: boolean = true;
    private hideAll: boolean = false;

    public constructor(options: ConsoleOptions) {
        this.setConsoleOptions(options);
    }

    setConsoleOptions(options: ConsoleOptions): void {
        if (options) {
            if (typeof (options.displayLogs) === 'boolean') {
                this.displayLogs = options.displayLogs;
            }
            if (typeof (options.displayWarnings) === 'boolean') {
                this.displayWarnings = options.displayWarnings;
            }
            if (typeof (options.displayDebugs) === 'boolean') {
                this.displayDebugs = options.displayDebugs;
            }
            if (typeof (options.displayInfos) === 'boolean') {
                this.displayInfos = options.displayInfos;
            }
            if (typeof (options.hideAll) === 'boolean') {
                this.hideAll = options.hideAll;
            }
        }
    }

    log(message?: any, ...optionalParams: any[]): void {
        if (!this.hideAll && this.displayLogs) {
            console.log(message, ...optionalParams);
        }
    }

    warn(message?: any, ...optionalParams: any[]): void {
        if (!this.hideAll && this.displayWarnings) {
            console.warn(message, ...optionalParams);
        }
    }

    debug(message?: any, ...optionalParams: any[]): void {
        if (!this.hideAll && this.displayDebugs) {
            console.debug(message, ...optionalParams);
        }
    }

    info(message?: any, ...optionalParams: any[]): void {
        if (!this.hideAll && this.displayInfos) {
            console.info(message, ...optionalParams);
        }
    }

    error(message?: any, ...optionalParams: any[]): void {
        if (!this.hideAll) {
            console.error(message, ...optionalParams);
        }
    }
}

const LoggerPlugin: PluginObject<any> = {
    install(v, options): void {
        let logger: Logger = new Logger(options);
        logger.debug('$logger', 'plugin.install');

        (v.prototype).$log = logger;

    }
};

export default LoggerPlugin;
