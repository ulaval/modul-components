import { PluginObject } from 'vue';
import axios from 'axios';
import * as strUtils from '../str/str';

const AUTHORIZATION_HEADER: string = 'Authorization';

export interface SecurityPluginOptions {
    protectedUrls: string[];
    getToken?: () => string;
}

class Security {
    constructor(private options: SecurityPluginOptions) {
        axios.interceptors.request.use(config => {
            this.options.protectedUrls.every(url => {
                if (!this.options.getToken) {
                    return false;
                }
                if (strUtils.startsWith(config.url, url)) {
                    let token: string = this.options.getToken();
                    if (config.headers) {
                        config.headers[AUTHORIZATION_HEADER] = token;
                    } else {
                        config.headers = {
                            [AUTHORIZATION_HEADER]: token
                        };
                    }
                    return false;
                }
                return true;
            });
            return config;
        });
    }
}

const SecurityPlugin: PluginObject<any> = {
    install(v, options) {
        if (!options) {
            throw new Error('SecurityPlugin.install -> options cannot be null');
        }

        let security = new Security(options);
        (v.prototype as any).$security = security;
    }
};

export default SecurityPlugin;
