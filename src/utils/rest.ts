export interface RequestConfig {
    method?: string;
    url?: string;
    pathParams?: any;
    queryParams?: any;
    headers?: any;
    formParams?: any;
    data?: any;
    timeout?: number;
}

export interface RestAdapter {
    execute<T>(config: RequestConfig): Promise<T>;
}
