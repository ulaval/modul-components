window.matchMedia =
    window.matchMedia ||
    (() => {
        return {
            matches: false,
            addListener: () => {},
            removeListener: () => {}
        };
    });

window.MutationObserver =  window.MutationObserver || class { observe () {} disconnect () {} };

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
