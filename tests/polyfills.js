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
