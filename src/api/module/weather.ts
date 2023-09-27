import request from '@/utils/axios';

/**
 * 获取天气接口
 */

interface IResponseType<P = {}> {
    code?: number;
    status: number;
    msg: string;
    data: P;
}
interface ILogin {
    token: string;
    expires: number;
}

interface IWeatherData {
    key: string;
    city: string;
    extensions?: 'base' | 'all';
    output?: 'JSON' | 'XML';
}
export const getWeather = (data: IWeatherData) => {
    return request<IResponseType<ILogin>>({
        url: 'https://restapi.amap.com/v3/weather/weatherInfo',
        method: 'get',
        data
    });
};
