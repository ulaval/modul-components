/* tslint:disable:no-console */

export interface ConsoleOptions {
    displayLogs?: boolean;
    displayWarnings?: boolean;
    displayDebugs?: boolean;
    displayInfos?: boolean;
    hideAll?: boolean;
}

export class Logger {
    private static displayLogs: boolean = true;
    private static displayWarnings: boolean = true;
    private static displayDebugs: boolean = true;
    private static displayInfos: boolean = true;
    private static hideAll: boolean = false;

    private constructor() {}

    static setConsoleOptions(options: ConsoleOptions): void {
        if (typeof(options.displayLogs) === 'boolean') {
            Logger.displayLogs = options.displayLogs;
        }
        if (typeof(options.displayWarnings) === 'boolean') {
            Logger.displayWarnings = options.displayWarnings;
        }
        if (typeof(options.displayDebugs) === 'boolean') {
            Logger.displayDebugs = options.displayDebugs;
        }
        if (typeof(options.displayInfos) === 'boolean') {
            Logger.displayInfos = options.displayInfos;
        }
        if (typeof(options.hideAll) === 'boolean') {
            Logger.hideAll = options.hideAll;
        }
    }

    static log(message?: any, ...optionalParams: any[]): void {
        if (!Logger.hideAll && Logger.displayLogs) {
            console.log(message, optionalParams);
        }
    }

    static warn(message?: any, ...optionalParams: any[]): void {
        if (!Logger.hideAll && Logger.displayWarnings) {
            console.warn(message, optionalParams);
        }
    }

    static debug(message?: any, ...optionalParams: any[]): void {
        if (!Logger.hideAll && Logger.displayDebugs) {
            console.debug(message, optionalParams);
        }
    }

    static info(message?: any, ...optionalParams: any[]): void {
        if (!Logger.hideAll && Logger.displayInfos) {
            console.info(message, optionalParams);
        }
    }
}
