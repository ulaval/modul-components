import { UserAgent } from './user-agent';

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
            expected: {
                isDesktop: true
            }
        },
        {
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36',
            hardware: 'desktop',
            os: 'windows 10',
            browser: 'chrome 60',
            expected: {
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
            expected: {
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
            expected: {
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
            expected: {
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
            expected: {
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
            expected: {
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
            expected: {
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
            expected: {
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
            expected: {
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
            browser: 'Internet explorer mobile 9',
            expected: {
                isWindowsPhone: true,
                isTrident: true,
                isMobile: true
            }
        }
    ].forEach(({ userAgent: value , hardware, os, browser, expected }) => {
        it(`should be ${os} running on ${hardware} when browser is ${browser} on os ${os}`, () => {
            defineUserAgent(value);

            const userAgent: UserAgent = new UserAgent();

            expect(userAgent.isEdge()).toBe(!!expected.isEdge);
            expect(userAgent.isGecko()).toBe(!!expected.isGecko);
            expect(userAgent.isKHTML()).toBe(!!expected.isKHTML);
            expect(userAgent.isWebKit()).toBe(!!expected.isWebKit);
            expect(userAgent.isBlink()).toBe(!!expected.isBlink);
            expect(userAgent.isPresto()).toBe(!!expected.isPresto);
            expect(userAgent.isTrident()).toBe(!!expected.isTrident);

            expect(userAgent.isWindows()).toBe(!!expected.isWindows);
            expect(userAgent.isMacOs()).toBe(!!expected.isMacOs);
            expect(userAgent.isUnix()).toBe(!!expected.isUnix);
            expect(userAgent.isLinux()).toBe(!!expected.isLinux);
            expect(userAgent.isAndroid()).toBe(!!expected.isAndroid);
            expect(userAgent.isIOs()).toBe(!!expected.isIOs);
            expect(userAgent.isWindowsPhone()).toBe(!!expected.isWindowsPhone);

            expect(userAgent.isMobile()).toBe(!!expected.isMobile);
            expect(userAgent.isDesktop()).toBe(!!expected.isDesktop);
        });

    });
});
