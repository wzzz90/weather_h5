import request from '@/utils/axios';
import { COMMON_API } from '../constants';
/**
 * 获取天气接口
 */

interface IResponseType<P = {}> {
    count: string;
    info: string;
    infoCode: string;
    status: '0' | '1';
    forecasts: P[];
}

export interface IWeatherCast {
    //日期
    date: string;
    //daypower
    daypower: string;
    //白天温度
    daytemp: string;
    daytemp_float: string;
    //白天天气现象
    dayweather: string;
    //daywind
    daywind: string;
    //nightpower
    nightpower: string;
    //晚上温度
    nighttemp: string;
    nighttemp_float: string;
    //晚上天气现象
    nightweather: string;
    //nightwind
    nightwind: string;
    //星期几
    week: string;
}
export interface IWeatherResData {
    // 城市名称
    city: string;
    // 城市编码
    adcode: string;
    // 省份名称
    province: string;
    //预报发布时间
    reporttime: string;
    //预报数据list结构，元素cast,按顺序为当天、第二天、第三天的预报数据
    casts: IWeatherCast[];
}

interface IWeatherRequestParams {
    key: string;
    city: string;
    extensions?: 'base' | 'all';
    output?: 'JSON' | 'XML';
}
export const getWeather = (data: IWeatherRequestParams) => {
    console.log('🚀 ~ file: weather.ts:25 ~ getWeather ~ data:', data);
    return request<IResponseType<IWeatherResData>>({
        url: `${COMMON_API}/weather/weatherInfo`,
        method: 'get',
        params: data
    });
};
