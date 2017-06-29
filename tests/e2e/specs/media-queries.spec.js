module.exports = {
    'media-queries': function test(browser) {
        const devServer = browser.globals.devServerURL;

        const min480 = 'min480';
        const min768 = 'min768';
        const min1024 = 'min1024';
        const min1200 = 'min1200';
        const min1600 = 'min1600';

        const in480_768 = 'in480-768';
        const in768_1024 = 'in768-1024';
        const in1024_1600 = 'in1024-1600';

        const max480 = 'max480';
        const max768 = 'max768';
        const max1024 = 'max1024';
        const max1200 = 'max1200';
        const max1600 = 'max1600';

        const SIZES = [400, 700, 1000, 1100, 1300, 1700];

        const expectations = {
            400: { present: [max480, max768, max1024, max1200, max1600], notPresent: [in480_768, in768_1024, in1024_1600, min480, min768, min1024, min1200, min1600] },
            700: { present: [max768, max1024, max1200, max1600, in480_768, min480], notPresent: [max480, in768_1024, in1024_1600, min768, min1024, min1200, min1600] },
            1000: { present: [max1024, max1200, max1600, in768_1024, min480, min768], notPresent: [max480, max768, in480_768, in1024_1600, min1024, min1200, min1600] },
            1100: { present: [max1200, max1600, in1024_1600, min480, min768, min1024], notPresent: [max480, max768, max1024, in480_768, in768_1024, min1200, min1600] },
            1300: { present: [max1600, in1024_1600, min480, min768, min1024, min1200], notPresent: [max480, max768, max1024, max1200, in480_768, in768_1024, min1600] },
            1700: { present: [min480, min768, min1024, min1200, min1600], notPresent: [max480, max768, max1024, max1200, max1600, in480_768, in768_1024, in1024_1600] },
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
