<template>
    <use-pinia></use-pinia>
    <div class="container">
        <div v-for="card in state.list" :key="card.code" class="card">
            <div class="top">
                <div class="title"></div>
                <div class="date"></div>
            </div>

            <div class="bottom"> <div class="weather"></div> </div
        ></div>
    </div>
</template>

<script lang="ts" setup>
    import UsePinia from '@/components/UsePinia.vue';
    import { ref, reactive, onBeforeMount, computed } from 'vue';
    import API from '@/api';
    import { MAP_KEY } from '@/constants';

    const CITY_CODES = {
        北京: 110000,
        上海: 310000,
        广州: 440100,
        深圳: 440300,
        苏州: 320500,
        沈阳: 210100
    };

    const state: { list: any[] } = reactive({
        list: []
    });

    const cityList = Object.keys(CITY_CODES);

    const selectCityCode = ref(cityList[0]);

    const displayList = computed(() => {
        return state.list.find((item) => item.code === selectCityCode.value);
    });
    console.log('🚀 ~ file: IndexPage.vue:46 ~ displayList ~ displayList:', displayList);

    onBeforeMount(async () => {
        const result = await API.getWeather({
            key: MAP_KEY,
            city: selectCityCode.value,
            extensions: 'all'
        });
        console.log('🚀 ~ file: IndexPage.vue:19 ~ onBeforeMount ~ result:', result);
        console.log(result);
    });
</script>
