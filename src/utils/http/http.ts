import Vue, { PluginObject } from 'vue';
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

    public execute<T>(config: RequestConfig): Promise<T> {
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
        axiosConfig.url = config.url;
        axiosConfig.method = config.method;
        axiosConfig.params = config.queryParams;
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
}

const HttpPlugin: PluginObject<any> = {
    install(v, options) {
        let http = new HttpService();
        (v as any).$http = http;
        (v.prototype as any).$http = http;
    }
};

export default HttpPlugin;
