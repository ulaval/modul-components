module.exports = {
    'media-query': function test(browser) {
        const devServer = browser.globals.devServerURL;

        const u320 = 'u320';
        const u640 = 'u640';
        const u768 = 'u768';
        const u1024 = 'u1024';
        const u1400 = 'u1400';

        const i320_640 = 'i320-640';
        const i640_768 = 'i640-768';
        const i768_1024 = 'i768-1024';

        const expectations = {
            '300': { present: [u320, u640, u768, u1024, u1400], notPresent: [i320_640, i640_768, i768_1024] },
            '500': { present: [u640, u768, u1024, u1400, i320_640], notPresent: [u320, i640_768, i768_1024] },
            '700': { present: [u768, u1024, u1400, i640_768], notPresent: [u320, u640, i320_640, i768_1024] },
            '1000': { present: [u1024, u1400, i768_1024], notPresent: [u320, u640, u768, i320_640, i640_768] },
            '1200': { present: [u1400], notPresent: [u320, u640, u768, u1024, i320_640, i640_768, i768_1024] },
            '1500': { present: [], notPresent: [u320, u640, u768, u1024, u1400, i320_640, i640_768, i768_1024] }
        }

        function validate(size) {
            expectations[size].present.forEach(function (element) {
                browser.assert.elementPresent(`#${element}`);
            });
            expectations[size].notPresent.forEach(function (element) {
                browser.assert.elementNotPresent(`#${element}`);
            });
        }

        browser
            .url(devServer)
            .waitForElementVisible('body', 5000)
            .click('a[href*="/media-query"');

        browser.resizeWindow(300, 600);
        validate('300');
        browser.resizeWindow(500, 600);
        validate('500');
        browser.resizeWindow(700, 600);
        validate('700');
        browser.resizeWindow(1000, 600);
        validate('1000');
        browser.resizeWindow(1200, 600);
        validate('1200');
        browser.resizeWindow(1500, 600);
        validate('1500');

        browser.end();
    }
};
