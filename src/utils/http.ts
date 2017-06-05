import Vue from 'vue';
import { PluginObject } from 'vue';
import axios from 'axios';

const HttpPlugin: PluginObject<any> = {
    install(v, options) {
        (v as any).$http = axios;
        (v.prototype as any).$http = axios;
    }
};

export default HttpPlugin;
