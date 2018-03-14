import { PluginObject } from 'vue';
import axios, { AxiosInstance, AxiosRequestConfig, AxiosPromise, AxiosResponse } from 'axios';
import qs from 'qs/lib';
import { RestAdapter, RequestConfig } from './rest';

export class HttpService implements RestAdapter {
    private instance: AxiosInstance;
    private requestInterceptor: number | undefined;
    private responseInterceptor: number | undefined;

    constructor() {
        this.instance = axios.create({
            timeout: 30000 // TODO configure from plugin options
        });
    }

    public setupRequestInterceptor<T>(onFulfilled: (value: any) => any, onRejected: (error: any) => any): void {
        if (this.requestInterceptor !== undefined) {
            throw new Error('An request interceptor is already defined');
        }
        this.requestInterceptor = this.instance.interceptors.request.use((value: AxiosRequestConfig) => {
            return onFulfilled(value);
        }, (error: Error) => {
            return onRejected(error);
        });
    }

    public setupResponseInterceptor<T>(onFulfilled: (value: any) => any, onRejected: (error: any) => any): void {
        if (this.responseInterceptor !== undefined) {
            throw new Error('An response interceptor is already defined');
        }
        this.responseInterceptor = this.instance.interceptors.response.use((response: AxiosResponse) => {
            return onFulfilled(response);
        }, (error: Error) => {
            return onRejected(error);
        });
    }

    public ejectResponseInterceptor(): void {
        if (this.responseInterceptor !== undefined) {
            this.instance.interceptors.response.eject(this.responseInterceptor);
            this.responseInterceptor = undefined;
        }
    }

    public execute<T>(config: RequestConfig, axiosOptions?: AxiosRequestConfig): AxiosPromise<T> {
        let mergedConfig: AxiosRequestConfig = this.buildConfig(config);
        mergedConfig = {
            ...mergedConfig,
            ...axiosOptions
        };

        return this.instance.request<T>(mergedConfig);
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
    install(v, options): void {
        let http = new HttpService();
        (v.prototype as any).$http = http;
    }
};

export default HttpPlugin;
