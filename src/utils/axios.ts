import axios, { AxiosResponse, AxiosRequestConfig } from 'axios';

const service = axios.create();

// Request interceptors
service.interceptors.request.use(
    (config: AxiosRequestConfig) => {
        // do something
        return config;
    },
    (error: any) => {
        Promise.reject(error);
    }
);

// Response interceptors
service.interceptors.response.use(
    async (response: AxiosResponse) => {
        console.log(response);
        if (response.status === 200 && response.data.status === '1') {
            return response.data;
        } else {
            return Promise.reject(response.data);
        }
    },
    (error: any) => {
        return Promise.reject(error);
    }
);

export default service;
