<template>
    <div class="weather">
        <template v-if="selectCity.weatherData">
            <button @click="onShowDialog">切换城市</button>
            <div class="container">
                <div class="top">
                    <div class="title">{{ selectCity.weatherData.city }}</div>
                    <div class="date">{{ selectDate.weatherData?.date }}</div>
                    <div class="power">
                        {{
                            selectDate.isDay
                                ? selectDate?.weatherData?.dayweather
                                : selectDate?.weatherData?.nightweather
                        }}
                    </div>
                    <div class="temp"
                        >{{
                            selectDate.isDay
                                ? selectDate?.weatherData?.daytemp_float
                                : selectDate?.weatherData?.nighttemp_float
                        }}摄氏度</div
                    >
                    <div class="wind"
                        >{{
                            selectDate.isDay
                                ? selectDate?.weatherData?.daywind
                                : selectDate?.weatherData?.nightwind
                        }}风</div
                    >
                    <div class="power">
                        {{
                            selectDate.isDay
                                ? selectDate?.weatherData?.daypower
                                : selectDate?.weatherData?.nightpower
                        }}级
                    </div>
                </div>
                <div class="bottom">
                    <div class="casts">
                        <div
                            v-for="item in selectCity.weatherData.casts"
                            :key="selectCity.weatherData.city + item.date"
                            class="cast-card"
                            @click="onChangeDate(item.date)"
                        >
                            <div class="cast-date">{{ item.date }}</div>
                            <div class="cast-weather">{{
                                selectDate.isDay ? item.dayweather : item.nightweather
                            }}</div>
                            <div class="cast-temp"
                                >{{
                                    selectDate.isDay ? item.daytemp_float : item.nighttemp_float
                                }}摄氏度</div
                            >
                        </div>
                    </div>

                    <div class="report-time">
                        数据报告时间：{{ selectCity.weatherData.reporttime }}
                    </div>
                </div>
            </div>
            <div v-if="showCityDialog" class="dialog">
                <div class="title">切换城市</div>
                <div
                    v-for="city in cityList"
                    :key="city"
                    class="city"
                    @click="onChangeCity(city)"
                    >{{ city }}</div
                >
            </div>
        </template>

        <div v-else class="empty"> {{ selectCity.isLoading ? '正在加载中...' : '暂无数据' }} </div>
    </div>
</template>

<script lang="ts" setup>
    import { reactive, onBeforeMount, ref } from 'vue';
    import API from '@/api';
    import { MAP_KEY } from '@/constants';
    import { IWeatherCast, IWeatherResData } from '@/api/module/weather';
    import dayjs from 'dayjs';
    import { sortBy } from 'lodash-es';

    const CITY_CODES: { [key: string]: string } = {
        北京: '110000',
        上海: '310000',
        广州: '440100',
        深圳: '440300',
        苏州: '320500',
        沈阳: '210100'
    };

    const cityList = Object.keys(CITY_CODES);
    //选中的城市信息
    const selectCity: { weatherData?: IWeatherResData; isLoading: boolean; code: string } =
        reactive({
            code: cityList[0],
            isLoading: false
        });

    //选中的日期
    let selectDate: {
        weatherData?: IWeatherCast;
        isDay: boolean;
    } = reactive({
        isDay: true
    });

    //切换城市弹窗是否显示
    const showCityDialog = ref(false);

    //生成城市当前日期的数据
    const generateCurrentWeather = (currentDate: string) => {
        const currentDateWeather = selectCity.weatherData?.casts.find(
            (item) => item.date === currentDate
        );
        currentDateWeather && (selectDate.weatherData = currentDateWeather);
        selectCity.weatherData &&
            (selectCity.weatherData = {
                ...selectCity.weatherData,
                casts: selectCity.weatherData.casts.filter((item) => item.date !== currentDate)
            });
    };

    //请求接口获取数据
    const getWeather = async () => {
        const currentDate = dayjs().format('YYYY-MM-DD');
        selectCity.isLoading = true;
        const result = await API.getWeather({
            key: MAP_KEY,
            city: selectCity.code,
            extensions: 'all'
        });
        selectCity.isLoading = false;
        selectCity.weatherData = result.forecasts[0];
        generateCurrentWeather(currentDate);
    };

    //修改当前日期
    const onChangeDate = (date: string) => {
        if (selectDate.weatherData && selectCity.weatherData) {
            selectCity.weatherData.casts = sortBy(
                [...selectCity.weatherData.casts, selectDate.weatherData],
                'date'
            );
        }
        generateCurrentWeather(date);
    };

    onBeforeMount(async () => {
        await getWeather();
    });

    //dialog显示与否
    const onShowDialog = () => {
        showCityDialog.value = !showCityDialog.value;
    };
    //修改当前城市
    const onChangeCity = async (cityName: string) => {
        selectCity.code = CITY_CODES[cityName];
        await getWeather();
        onShowDialog();
    };
</script>

<style lang="less" scoped>
    .fill {
        width: 100%;
        height: 100%;
    }
    .weather {
        position: relative;
        .fill();
        button {
            position: absolute;
            left: 20px;
            top: 20px;
        }

        .container {
            padding: 20px;
            overflow: hidden;
            box-sizing: border-box;
            .fill();
            .top {
                display: flex;
                flex-direction: column;
                overflow: hidden;
                margin-top: 60px;

                & > div {
                    margin-top: 20px;
                }
                .title {
                    font-size: 28px;
                    text-align: center;
                    margin-top: 0;
                }
            }

            .bottom {
                display: flex;
                flex-direction: column;
                margin-top: 40px;
                .casts {
                    display: flex;
                    .cast-card {
                        // flex: 1;
                        border: 1px solid black;
                        padding: 10px;
                        & + .cast-card {
                            margin-left: 20px;
                        }
                    }
                }

                .report-time {
                    display: flex;
                    flex: 1;
                    margin-top: 20px;
                }
            }
        }

        .dialog {
            .fill();
            position: fixed;
            z-index: 10;
            left: 0;
            top: 0;
            padding: 20px;
            font-size: 20px;
            box-sizing: border-box;
            background: white;
            & > div {
                margin-top: 20px;
                text-align: center;
            }
            .title {
                font-size: 28px;
            }
        }

        .empty {
            .fill();
            display: flex;
            align-items: center;
            justify-content: center;
        }
    }
</style>
