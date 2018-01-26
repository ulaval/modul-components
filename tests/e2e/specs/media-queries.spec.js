module.exports = {
    'media-queries': function test(browser) {
        const devServer = browser.globals.devServerURL;

        const min480 = 'min480';
        const min769 = 'min769';
        const min1024 = 'min1024';
        const min1200 = 'min1200';
        const min1600 = 'min1600';

        const in480_769 = 'in480-769';
        const in769_1024 = 'in769-1024';
        const in1024_1600 = 'in1024-1600';

        const max480 = 'max480';
        const max769 = 'max769';
        const max1024 = 'max1024';
        const max1200 = 'max1200';
        const max1600 = 'max1600';

        const SIZES = [400, 700, 1000, 1100, 1300, 1700];

        const expectations = {
            400: { present: [max480, max769, max1024, max1200, max1600], notPresent: [in480_769, in769_1024, in1024_1600, min480, min769, min1024, min1200, min1600] },
            700: { present: [max769, max1024, max1200, max1600, in480_769, min480], notPresent: [max480, in769_1024, in1024_1600, min769, min1024, min1200, min1600] },
            1000: { present: [max1024, max1200, max1600, in769_1024, min480, min769], notPresent: [max480, max769, in480_769, in1024_1600, min1024, min1200, min1600] },
            1100: { present: [max1200, max1600, in1024_1600, min480, min769, min1024], notPresent: [max480, max769, max1024, in480_769, in769_1024, min1200, min1600] },
            1300: { present: [max1600, in1024_1600, min480, min769, min1024, min1200], notPresent: [max480, max769, max1024, max1200, in480_769, in769_1024, min1600] },
            1700: { present: [min480, min769, min1024, min1200, min1600], notPresent: [max480, max769, max1024, max1200, max1600, in480_769, in769_1024, in1024_1600] },
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
            .click('a[href*="/media-queries"');

        SIZES.forEach(function (size) {
            browser.resizeWindow(size, 800);
            validate(size);
        });

        browser.end();
    }
};
