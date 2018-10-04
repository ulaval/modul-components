import UserAgent from './user-agent';

const defineUserAgent: (value: string) => void = (value: string) => {
    Object.defineProperty(window.navigator, 'userAgent', { value: value, configurable: true });
};

describe('user-agent', () => {
    [
        {
            userAgent: '',
            hardware: 'desktop',
            os: '<blank>',
            browser: '<blank>',
            want: {
                isDesktop: true
            }
        },
        {
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36',
            hardware: 'desktop',
            os: 'windows 10',
            browser: 'chrome 60',
            want: {
                isGecko: true,
                isKHTML: true,
                isWebKit: true,
                isBlink: true,
                isWindows: true,
                isDesktop: true
            }
        },
        {
            userAgent: 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:54.0) Gecko/20100101 Firefox/54.0',
            hardware: 'desktop',
            os: 'windows 7',
            browser: 'Firefox 54',
            want: {
                isGecko: true,
                isWindows: true,
                isDesktop: true
            }
        },
        {
            userAgent: 'Mozilla/4.0 (compatible; MSIE 9.0; Windows NT 6.1)',
            hardware: 'desktop',
            os: 'Windows 7',
            browser: 'Internet Explorer 9',
            want: {
                isTrident: true,
                isWindows: true,
                isDesktop: true
            }
        },
        {
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.79 Safari/537.36 Edge/14.14393',
            hardware: 'desktop',
            os: 'Windows 10',
            browser: 'Edge 38',
            want: {
                isEdge: true,
                isWebKit: true,
                isKHTML: true,
                isGecko: true,
                isWindows: true,
                isDesktop: true
            }
        },
        {
            userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X x.y; rv:42.0) Gecko/20100101 Firefox/42.0',
            hardware: 'desktop',
            os: 'Mac OS',
            browser: 'Firefox',
            want: {
                isGecko: true,
                isMacOs: true,
                isDesktop: true
            }
        },
        {
            userAgent: 'Mozilla/5.0 (X11; Linux x86_64; rv:45.0) Gecko/20100101 Thunderbird/45.3.0',
            hardware: 'desktop',
            os: 'Linux',
            browser: 'Thunderbird',
            want: {
                isGecko: true,
                isLinux: true,
                isUnix: true,
                isDesktop: true
            }
        },
        {
            userAgent: 'Opera/9.80 (Macintosh; Intel Mac OS X 10.10.5) Presto/2.12.388 Version/12.16',
            hardware: 'desktop',
            os: 'Mac OS X',
            browser: 'Opera',
            want: {
                isPresto: true,
                isMacOs: true,
                isDesktop: true
            }
        },
        {
            userAgent: 'Mozilla/5.0 (Linux; Android 4.2.1; en-us; Nexus 5 Build/JOP40D) AppleWebKit/535.19 (KHTML, like Gecko; googleweblight) Chrome/38.0.1025.166 Mobile Safari/535.19',
            hardware: 'mobile',
            os: 'Android',
            browser: 'Google Weblight Proxy',
            want: {
                isLinux: true,
                isAndroid: true,
                isWebKit: true,
                isKHTML: true,
                isGecko: true,
                isBlink: true,
                isMobile: true
            }
        },
        {
            userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 10_2_1 like Mac OS X) AppleWebKit/602.4.6 (KHTML, like Gecko) Version/10.0 Mobile/14D27 Safari/602.1',
            hardware: 'mobile',
            os: 'IOs',
            browser: 'Safari 10',
            want: {
                isIOs: true,
                isMacOs: true,
                isWebKit: true,
                isKHTML: true,
                isGecko: true,
                isMobile: true
            }
        },
        {
            userAgent: 'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0; XBLWP7; ZuneWP7)',
            hardware: 'mobile',
            os: 'Windows Phone',
            browser: 'Internet explorer mobile 0',
            want: {
                isWindowsPhone: true,
                isTrident: true,
                isMobile: true
            }
        }
    ].forEach(({ userAgent, hardware, os, browser, want }) => {
        it(`should be ${os} running on ${hardware} when browser is ${browser} on os ${os}`, () => {
            defineUserAgent(userAgent);

            const us: UserAgent = new UserAgent();

            expect(us.isEdge()).toBe(!!want.isEdge);
            expect(us.isGecko()).toBe(!!want.isGecko);
            expect(us.isKHTML()).toBe(!!want.isKHTML);
            expect(us.isWebKit()).toBe(!!want.isWebKit);
            expect(us.isBlink()).toBe(!!want.isBlink);
            expect(us.isPresto()).toBe(!!want.isPresto);
            expect(us.isTrident()).toBe(!!want.isTrident);

            expect(us.isWindows()).toBe(!!want.isWindows);
            expect(us.isMacOs()).toBe(!!want.isMacOs);
            expect(us.isUnix()).toBe(!!want.isUnix);
            expect(us.isLinux()).toBe(!!want.isLinux);
            expect(us.isAndroid()).toBe(!!want.isAndroid);
            expect(us.isIOs()).toBe(!!want.isIOs);
            expect(us.isWindowsPhone()).toBe(!!want.isWindowsPhone);

            expect(us.isMobile()).toBe(!!want.isMobile);
            expect(us.isDesktop()).toBe(!!want.isDesktop);
        });

    });
});
