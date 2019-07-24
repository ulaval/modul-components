import Vue from 'vue';
import { resetModulPlugins } from '../../../tests/helpers/component';
import HttpPlugin from './http';
import { serializeParams } from './http-param-serializer';

describe('http plugin', () => {
    describe('when not installed', () => {
        it('should not be registered on the Vue prototype', () => {
            expect(Vue.prototype.$http).toBeUndefined();
        });
    });

    describe('when install', () => {
        beforeEach(() => {
            resetModulPlugins();
        });

        it('should register $http on the Vue prototype', () => {
            Vue.use(HttpPlugin);
            expect(Vue.prototype.$http).toBeDefined();
        });
    });
});

describe('http serializer', () => {
    describe('given params', () => {
        it('should serialize primitives', () => {
            expect(serializeParams({ param1: 1, param2: 'text', param3: false })).toEqual('param1=1&param2=text&param3=false');
        });

        it('should not serialize undefined values', () => {
            expect(serializeParams({ param1: 1, param2: undefined, param3: 'text', param4: undefined })).toEqual('param1=1&param3=text');
        });

        it('should serialize arrays', () => {
            expect(serializeParams({ param1: [1, 2, 3] })).toEqual('param1=1&param1=2&param1=3');
        });

        it('should serialize arrays with object values', () => {
            expect(serializeParams({ param1: [{ key: 'k1', value: 'v1' }, { key: 'k2', value: 'v2' }] })).toEqual('param1={"key":"k1","value":"v1"}&param1={"key":"k2","value":"v2"}');
        });

        it('should serialize arrays with undefined values', () => {
            expect(serializeParams({ param1: [1, undefined, 3] })).toEqual('param1=1&param1=undefined&param1=3');
        });

        it('should not serialize empty arrays', () => {
            expect(serializeParams({ param1: [], param2: 'text' })).toEqual('param2=text');
        });

        it('should serialize complex objects', () => {
            expect(serializeParams({ param1: { a1: 'text', a2: 33, a3: true } })).toEqual('param1={"a1":"text","a2":33,"a3":true}');
        });

        it('should serialize dates', () => {
            // support DST
            expect(['param1=2019-07-23T00:00:00.000Z', 'param1=2019-07-23T04:00:00.000Z', 'param1=2019-07-23T05:00:00.000Z']).toContain(serializeParams({ param1: new Date(2019, 6, 23) }));
        });
    });
});
