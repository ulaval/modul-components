import { AxiosResponse } from 'axios';

export interface RequestConfig {
    method?: string;
    rawUrl?: string;
    pathParams?: any;
    params?: any;
    headers?: any;
    formParams?: any;
    data?: any;
    timeout?: number;
}

export interface RestAdapter {
    execute<T>(config: RequestConfig): Promise<AxiosResponse<T>>;
}
