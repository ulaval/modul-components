import Promise from 'es6-promise';

// Polyfill for the Promise API
Promise.polyfill();

// https://tc39.github.io/ecma262/#sec-array.prototype.find
if (!Array.prototype['find']) {
    Object.defineProperty(Array.prototype, 'find', {
        value: (...predicate: any[]) => {
            // 1. Let O be ? ToObject(this value).
            // tslint:disable-next-line:no-null-keyword
            if (this == null) {
                throw new TypeError('"this" is null or not defined');
            }

            let o = Object(this);

            // 2. Let len be ? ToLength(? Get(O, "length")).
            let len = o.length >>> 0;

            // 3. If IsCallable(predicate) is false, throw a TypeError exception.
            if (typeof predicate !== 'function') {
                throw new TypeError('predicate must be a function');
            }

            // 4. If thisArg was supplied, let T be thisArg else let T be undefined.
            let thisArg = predicate[1];

            // 5. Let k be 0.
            let k = 0;

            // 6. Repeat, while k < len
            while (k < len) {
                // a. Let Pk be ! ToString(k).
                // b. Let kValue be ? Get(O, Pk).
                // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
                // d. If testResult is true, return kValue.
                let kValue = o[k];
                if (predicate[0].call(thisArg, kValue, k, o)) {
                    return kValue;
                }
                // e. Increase k by 1.
                k++;
            }

            // 7. Return undefined.
            return undefined;
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

// https://tc39.github.io/ecma262/#sec-array.prototype.includes
if (!Array.prototype['includes']) {
    Object.defineProperty(Array.prototype, 'includes', {
        value: function(searchElement, fromIndex) {

            // 1. Let O be ? ToObject(this value).
            if (this == undefined) {
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
