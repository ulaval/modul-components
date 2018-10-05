type UserAgentSpecifications = {expected: string[], not?: string[]};

const ENGINE_EDGE: UserAgentSpecifications = { expected: ['Edge'] };
const ENGINE_GECKO: UserAgentSpecifications = { expected: ['Gecko'] };
const ENGINE_KHTML: UserAgentSpecifications = { expected: ['KHTML'] };
const ENGINE_WEBKIT: UserAgentSpecifications = { expected: ['AppleWebKit'] };
const ENGINE_BLINK: UserAgentSpecifications = { expected: ['Chrome', 'Chromium'], not: ENGINE_EDGE.expected };
const ENGINE_PRESTO: UserAgentSpecifications = { expected: ['Opera'] };
const ENGINE_TRIDENT: UserAgentSpecifications = { expected: ['Trident', 'MSIE'] };

const OS_ANDROID: UserAgentSpecifications = { expected: ['Android'] };
const OS_IOS: UserAgentSpecifications = { expected: ['iPad', 'iPhone'] };
const OS_WINDOWS_PHONE: UserAgentSpecifications = { expected: ['Windows Phone', 'XBLWP7', 'ZuneWP7', 'WP7'] };
const OS_WINDOWS: UserAgentSpecifications = { expected: ['Windows NT'], not: OS_WINDOWS_PHONE.expected };
const OS_MACOS: UserAgentSpecifications = { expected: ['Mac OS X', 'Mac Os X'] };
const OS_UNIX: UserAgentSpecifications = { expected: ['X11'] };
const OS_LINUX: UserAgentSpecifications = { expected: ['Linux'] };
const OS_MOBILE_GENERIC: UserAgentSpecifications = { expected: ['Mobi'] };

const OS_MOBILE: UserAgentSpecifications = { expected: [
    ...OS_MOBILE_GENERIC.expected,
    ...OS_ANDROID.expected,
    ...OS_IOS.expected,
    ...OS_WINDOWS_PHONE.expected
]};
const OS_DESKTOP: UserAgentSpecifications = { expected: [
    ...OS_WINDOWS.expected,
    ...OS_MACOS.expected,
    ...OS_UNIX.expected,
    ...OS_LINUX.expected
]};

export interface UserAgentStatus {
    isEdge: boolean;
    isGecko: boolean;
    isKHTML: boolean;
    isWebKit: boolean;
    isBlink: boolean;
    isPresto: boolean;
    isTrident: boolean;

    isWindows: boolean;
    isMacOs: boolean;
    isUnix: boolean;
    isLinux: boolean;
    isAndroid: boolean;
    isIOs: boolean;
    isWindowsPhone: boolean;

    isMobile: boolean;
    isDesktop: boolean;
}

export class UserAgent {
    private state: UserAgentStatus = {
        isEdge: false,
        isGecko: false,
        isKHTML: false,
        isWebKit: false,
        isBlink: false,
        isPresto: false,
        isTrident: false,
        isWindows: false,
        isMacOs: false,
        isUnix: false,
        isLinux: false,
        isAndroid: false,
        isIOs: false,
        isWindowsPhone: false,
        isMobile: false,
        isDesktop: false
    };

    constructor() {
        this.initUserAgentEngines();
        this.initUserAgentOS();
        this.initHardware();
    }

    public isMobile(): boolean {
        return this.state.isMobile;
    }

    public isDesktop(): boolean {
        return this.state.isDesktop;
    }

    public isEdge(): boolean {
        return this.state.isEdge;
    }

    public isGecko(): boolean {
        return this.state.isGecko;
    }

    public isKHTML(): boolean {
        return this.state.isKHTML;
    }

    public isWebKit(): boolean {
        return this.state.isWebKit;
    }

    public isBlink(): boolean {
        return this.state.isBlink;
    }

    public isPresto(): boolean {
        return this.state.isPresto;
    }

    public isTrident(): boolean {
        return this.state.isTrident;
    }

    public isWindows(): boolean {
        return this.state.isWindows;
    }

    public isMacOs(): boolean {
        return this.state.isMacOs;
    }

    public isUnix(): boolean {
        return this.state.isUnix;
    }

    public isLinux(): boolean {
        return this.state.isLinux;
    }

    public isAndroid(): boolean {
        return this.state.isAndroid;
    }

    public isIOs(): boolean {
        return this.state.isIOs;
    }

    public isWindowsPhone(): boolean {
        return this.state.isWindowsPhone;
    }

    private initHardware(): void {
        this.state.isMobile = this.userAgentIs(OS_MOBILE);
        this.state.isDesktop = !this.state.isMobile;
    }

    private initUserAgentOS(): void {
        this.state.isWindows = this.userAgentIs(OS_WINDOWS);
        this.state.isMacOs = this.userAgentIs(OS_MACOS);
        this.state.isUnix = this.userAgentIs(OS_UNIX);
        this.state.isLinux = this.userAgentIs(OS_LINUX);
        this.state.isAndroid = this.userAgentIs(OS_ANDROID);
        this.state.isIOs = this.userAgentIs(OS_IOS);
        this.state.isWindowsPhone = this.userAgentIs(OS_WINDOWS_PHONE);
    }

    private initUserAgentEngines(): void {
        this.state.isEdge = this.userAgentIs(ENGINE_EDGE);
        this.state.isGecko = this.userAgentIs(ENGINE_GECKO);
        this.state.isKHTML = this.userAgentIs(ENGINE_KHTML);
        this.state.isWebKit = this.userAgentIs(ENGINE_WEBKIT);
        this.state.isBlink = this.userAgentIs(ENGINE_BLINK);
        this.state.isPresto = this.userAgentIs(ENGINE_PRESTO);
        this.state.isTrident = this.userAgentIs(ENGINE_TRIDENT);
    }

    private userAgentIs(specification: UserAgentSpecifications): boolean {
        let containsExpected: boolean = specification.expected.reduce((previous: boolean, value: string) => {
            return previous || navigator.userAgent.indexOf(value) !== -1;
        }, false);

        if (!specification.not) {
            return containsExpected;
        }

        let containsNotExpected: boolean = specification.not.reduce((previous: boolean, value: string) => {
            return previous || navigator.userAgent.indexOf(value) !== -1;
        }, false);

        return containsExpected && !containsNotExpected;
    }
}

const UserAgentUtil: UserAgent = new UserAgent();
export default UserAgentUtil;
