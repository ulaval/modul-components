window.matchMedia =
    window.matchMedia ||
    (() => {
        return {
            matches: false,
            addListener: () => {},
            removeListener: () => {}
        };
    });

window.MutationObserver = window.MutationObserver || class {
    observe() {}
    disconnect() {}
};

// jsdom doesn't support closest at the moment --> https://github.com/jsdom/jsdom/issues/1555
if (!window.Element.prototype.closest) {
    window.Element.prototype.closest = function (selector) {
        var el = this;
        while (el) {
            if (el.matches(selector)) {
                return el;
            }
            el = el.parentElement;
        }
    };
}

window.requestAnimationFrame = callback => callback();

// FIX Cannot read property 'split' of undefined error when running tests.  It is related to vue-test-utils
// https://github.com/vuejs/vue-test-utils/issues/839
// The issue is marked as closed, but it still occurs.
const {
    getComputedStyle
} = window
window.getComputedStyle = function getComputedStyleStub(el) {
    return Object.assign({}, getComputedStyle(el), {
        transitionDelay: '',
        transitionDuration: '',
        animationDelay: '',
        animationDuration: '',
        getPropertyValue: getComputedStyle(el).getPropertyValue
    });
}

// Mock DateTimeFormat because of partial NodeJs locale support when running jest.
Intl.DateTimeFormat = class {
    format(date) {
        return `mock-intl-dateTimeFormat-${date.getFullYear()}-${date.getMonth().toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}T${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    }
}
