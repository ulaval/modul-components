import Vue from 'vue';
import { PluginObject } from 'vue';
import axios, { AxiosRequestConfig, AxiosPromise, AxiosResponse } from 'axios';
import qs from 'qs/lib';
import { RestAdapter, RequestConfig } from './rest';

const GET: string = 'get';
const POST: string = 'post';
const PUT: string = 'put';

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
        let response: AxiosPromise | undefined = undefined;

        if (config.method && config.url) {
            if (config.method.toLowerCase() == GET) {
                response = axios.get(config.url, this.buildConfig(config));
            } else if (config.method.toLowerCase() == POST) {
                response = axios.post(config.url, this.buildData(config), this.buildConfig(config));
            } else if (config.method.toLowerCase() == PUT) {
                response = axios.put(config.url, this.buildData(config), this.buildConfig(config));
            } else {
                throw new Error(`"${config.method}" http method not implemented`);
            }
        } else {
            throw new Error(`method and url should be supplied`);
        }

        return new Promise((resolve, reject) => {
            if (response) {
                response.then(value => {
                    resolve(value);
                }, reason => {
                    reject(reason);
                });
            } else {
                resolve();
            }
        });
    }

    private buildConfig(config: RequestConfig): AxiosRequestConfig {
        let axiosConfig: AxiosRequestConfig = {};
        axiosConfig.url = config.url;
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
        }

        axiosConfig.paramsSerializer = params => {
            return qs.stringify(params, { arrayFormat: 'repeat' });
        };

        return axiosConfig;
    }

    private buildData(config: RequestConfig): any {
        let data: any = {};

        if (config.formParams) {
            data = qs.stringify(config.formParams, { arrayFormat: 'repeat' });
        } else {
            data = config.data;
        }

        return data;
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
