import Promise from 'es6-promise';
import { polyfill } from 'mobile-drag-drop';
import { scrollBehaviourDragImageTranslateOverride } from 'mobile-drag-drop/scroll-behaviour';

export const polyFillActive: { dragDrop: boolean } = {
    dragDrop: false
};

// Polyfill for drag and drop on mobile.
polyFillActive.dragDrop = polyfill({
    holdToDrag: 200,
    dragImageTranslateOverride: scrollBehaviourDragImageTranslateOverride,
    iterationInterval: 50
});

// Polyfill for the Promise API
Promise.polyfill();

// http://stackoverflow.com/questions/35135127/adding-a-function-to-array-prototype-in-ie-results-in-it-being-pushed-in-to-ever.
if (!Array.prototype['find']) {
    Object.defineProperty(Array.prototype, 'find', {
        value: function(predicate) {
            if (this === undefined) {
                throw new TypeError('Array.prototype.find called on null or undefined');
            }
            if (typeof predicate !== 'function') {
                throw new TypeError('predicate must be a function');
            }
            let list = Object(this);
            let length = list.length >>> 0;
            let thisArg = arguments[1];
            let value;

            for (let i = 0; i < length; i++) {
                value = list[i];
                if (predicate.call(thisArg, value, i, list)) {
                    return value;
                }
            }
            return undefined;
        }
    });
}

// https://tc39.github.io/ecma262/#sec-array.prototype.includes
if (!Array.prototype['includes']) {
    Object.defineProperty(Array.prototype, 'includes', {
        value: function(searchElement, fromIndex) {

            // 1. Let O be ? ToObject(this value).
            if (this === undefined) {
                throw new TypeError('"this" is null or not defined');
            }

            let o = Object(this);

            // 2. Let len be ? ToLength(? Get(O, "length")).
            let len = o.length >>> 0;

            // 3. If len is 0, return false.
            if (len === 0) {
                return false;
            }

            // 4. Let n be ? ToInteger(fromIndex).
            //    (If fromIndex is undefined, this step produces the value 0.)
            let n = fromIndex | 0;

            // 5. If n ≥ 0, then
            //  a. Let k be n.
            // 6. Else n < 0,
            //  a. Let k be len + n.
            //  b. If k < 0, let k be 0.
            let k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

            // 7. Repeat, while k < len
            while (k < len) {
                // a. Let elementK be the result of ? Get(O, ! ToString(k)).
                // b. If SameValueZero(searchElement, elementK) is true, return true.
                // c. Increase k by 1.
                // NOTE: === provides the correct "SameValueZero" comparison needed here.
                if (o[k] === searchElement) {
                    return true;
                }
                k++;
            }

            // 8. Return false
            return false;
        }
    });
}

// https://github.com/FabioVergani/js-Polyfill_StringIncludes/blob/master/StringIncludes.js
if (!String.prototype['includes']) {
    String.prototype['includes'] = function(search, start) {
        'use strict';
        if (typeof start !== 'number') {
            start = 0;
        }
        if (start + search.length > this.length) {
            return false;
        } else {
            return this.indexOf(search, start) !== -1;
        }
    };
}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/startsWith#Polyfill
if (!String.prototype['startsWith']) {
    String.prototype['startsWith'] = function(searchString, position) {
        return this.substr(position || 0, searchString.length) === searchString;
    };
}
