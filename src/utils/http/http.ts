import { PluginObject } from 'vue';
import axios, { AxiosRequestConfig, AxiosPromise, AxiosResponse } from 'axios';
import qs from 'qs/lib';
import { RestAdapter, RequestConfig } from './rest';

export class HttpService implements RestAdapter {
    constructor() {
        // default options needed? should be initialized by the plugin
        // this.axiosInstance = axios.create({
        //     baseURL: 'https://some-domain.com/api/',
        //     timeout: 1000,
        //     headers: { 'X-Custom-Header': 'foobar' }
        // });
    }

    public execute<T>(config: RequestConfig): Promise<any> {
        let axiosConfig: AxiosRequestConfig = this.buildConfig(config);

        let response: AxiosPromise = axios(axiosConfig);

        return new Promise((resolve, reject) => {
            response.then(value => {
                resolve(value);
            }, reason => {
                reject(reason);
            });
        });
    }

    private buildConfig(config: RequestConfig): AxiosRequestConfig {
        let axiosConfig: AxiosRequestConfig = {};
        axiosConfig.url = this.resolveUrl(config);
        axiosConfig.method = config.method;
        axiosConfig.params = config.params;
        axiosConfig.headers = config.headers;

        if (config.formParams) {
            const CONTENT_TYPE: string = 'Content-Type';
            const FORM_URLENCODED: string = 'application/x-www-form-urlencoded';

            if (axiosConfig.headers) {
                axiosConfig.headers[CONTENT_TYPE] = FORM_URLENCODED;
            } else {
                axiosConfig.headers = {
                    [CONTENT_TYPE]: FORM_URLENCODED
                };
            }

            axiosConfig.data = qs.stringify(config.formParams, { arrayFormat: 'repeat' });
        } else {
            axiosConfig.data = config.data;
        }

        axiosConfig.paramsSerializer = params => {
            return qs.stringify(params, { arrayFormat: 'repeat' });
        };

        return axiosConfig;
    }

    private resolveUrl(config: RequestConfig): string | undefined {
        let result: string | undefined = config.rawUrl;
        if (result && config.pathParams) {
            for (let key in config.pathParams) {
                result = result.replace('{' + key + '}', encodeURIComponent(config.pathParams[key]));
            }
        }

        return result;
    }
}

const HttpPlugin: PluginObject<any> = {
    install(v, options) {
        let http = new HttpService();
        (v.prototype as any).$http = http;
    }
};

export default HttpPlugin;
