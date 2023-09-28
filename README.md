# 高德天气项目

一个通过高德地图查询天气状况的项目，可以查看北京、上海、广州、深圳、苏州、沈阳6个城市的天气预报情况。



使用


## 环境依赖版本
-   [node](https://github.com/nodejs/node)：v14.15.4
-   [vite](https://github.com/vitejs/vite)：^2.8.0
-   [vue](https://github.com/vuejs/vue)：^3.2.25
-   [typescript](https://github.com/microsoft/TypeScript)：^4.5.4
-   [pinia](https://github.com/vuejs/pinia)：^2.0.12
-   [vue-router](https://github.com/vuejs/router)：^4.0.14
-   [eslint](https://github.com/eslint/eslint)：^8.12.0
-   [prettier](https://github.com/prettier/prettier)：^2.6.1
-   [commitizen](https://github.com/commitizen/cz-cli)：^4.2.4
-   [husky](https://github.com/typicode/husky)：^7.0.4

## 目录结构

目前前端开发一般遵循 `MVVM` 设计模式的组件式开发，除了明确各层之间的职责外，还需规划其各类文件的存放目录。目录设计合理将大幅提升代码的可维护性和可读性。项目结构如下图所示:

```
project
|-- src
    |-- api
        |-- module    // 各个模块的接口
        |-- index     // api接口入口
    |-- assets        // 静态资源，图片等
    |-- components    // 业务组件
    |-- pages
        |-- IndexPage // 首页
    |-- router        // 路由文件
    |-- store         // store。分模块store
    |-- styles        // 所有style文件，例如一些common.css
    |-- types         // types文件，针对于需要自定义声明的库
    |-- utils         // 工具文件
    |-- App.vue       // 入口vue文件
    |-- constants.ts  // 全局常量
    |-- env.d.ts      // env.d.ts 是TypeScript的声明文件，它提供了对环境变量的类型定义
    |-- main.ts       // main文件
```

## 代码质量风格的统一

使用eslint、prettier来进行代码校验、代码美化格式化的功能，保证代码质量风格的统一

### 集成 `eslint`

使用情况如下，在命令行中输入`yarn eslint`或者`npm run eslint`就可以对文件进行格式化
```json
{
    ...
    "scripts": {
        ...
        "eslint:comment": "使用 ESLint 检查并自动修复 src 目录下所有扩展名为 .js 和 .vue 的文件",
        "eslint": "eslint --ext .js,.vue --ignore-path .gitignore --fix src",
    }
    ...
}
```


### 集成 `prettier`
使用情况如下，在命令行中输入`yarn prettier`或者`npm run prettier`就可以对文件进行格式化
```json
{
    ...
    "scripts": {
        ...
        "prettier:comment": "自动格式化当前目录下的所有文件",
        "prettier": "prettier --write"
    }
    ...
}
```

eslint、prettier集成到了commit中，每次提交都会对修改的文件进行校验和格式化


## 集成 `pinia`
`Pinia` 读音：['piːnə]，是 Vue 官方团队推荐代替`Vuex`的一款轻量级状态管理库。

1.  新建 src/store 目录并在其下面创建 index.ts，导出 store

``` typescript
 import { createPinia } from 'pinia'

 const store = createPinia()

 export default store
```

2.  在 main.ts 中引入并使用

```typescript
 import { createApp } from 'vue'
 import App from './App.vue'
 import store from './store'
 ​
 // 创建vue实例
 const app = createApp(App)
 ​
 // 挂载pinia
 app.use(store)
 ​
 // 挂载实例
 app.mount('#app');
```

3.  **定义State：** 在 src/store 下面创建一个 user.ts

```typescript
 import { defineStore } from 'pinia'

 export const useUserStore = defineStore({
   id: 'user', // id必填，且需要唯一
   state: () => {
     return {
       name: '张三'
     }
   },
   actions: {
     updateName(name) {
       this.name = name
     }
   }
 })
```

4.  **获取State：** 在 src/components/usePinia.vue 中使用

```typescript
 <template>
   <div>{{ userStore.name }}</div>
 </template>

 <script lang="ts" setup>
 import { useUserStore } from '@/store/user'

 const userStore = useUserStore()
 </script>
```

5.  **修改State：**

```typescript
 // 1. 直接修改 state （不建议）
 userStore.name = '李四'

 // 2. 通过 actions 去修改
 <script lang="ts" setup>
 import { useUserStore } from '@/store/user'

 const userStore = useUserStore()
 userStore.updateName('李四')
 </script>
```

> 更详细上手指南：[链接](https://juejin.cn/post/7049196967770980389)   官方文档：[链接](https://pinia.vuejs.org/introduction.html)

## 集成 `vue-router4`

1.  新建 src/router 目录并在其下面创建 index.ts，导出 router

```typescript
 import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

 const routes: Array<RouteRecordRaw> = [
   {
     path: '/login',
     name: 'Login',
     meta: {
         title: '登录',
         keepAlive: true,
         requireAuth: false
     },
     component: () => import('@/pages/login.vue')
   },
   {
       path: '/',
       name: 'Index',
       meta: {
           title: '首页',
           keepAlive: true,
           requireAuth: true
       },
       component: () => import('@/pages/index.vue')
   }
 ]

 const router = createRouter({
   history: createWebHistory(),
   routes
 });
 export default router;
```

2.  在 main.ts 中引入并使用

```typescript
 import { createApp } from 'vue'
 import App from './App.vue'
 import store from './store'
 import router from '@/router';

 // 创建vue实例
 const app = createApp(App);

 app.use(router);

 // 挂载实例
 app.mount('#app');
```

3.  修改 App.vue

```typescript
 <template>
   <RouterView/>
 </template>
```

## less 的集成


使用在 .vue 文件模板中

```typescript

// .less
 <template>
     <div class="root">
         <h3>欢迎使用 less</h3>
     </div>
 </template>
 <style lang="less">
   .root {}
 </style>
```

## 集成 `axios`

`axios` 是一个基于 promise 的 HTTP 库，可以用在浏览器和 node.js 中

1.  新建 src/utils/axios.ts

```typescript
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
         // do something
     },
     (error: any) => {
         // do something
         return Promise.reject(error);
     }
 );

 export default service;
```

2.  在页面中使用即可
```typescript
<script lang="ts">
    import request from '@/utils/axios';
    const requestRes = async () => {
        let result = await request({
                    url: '/api/xxx',
                    method: 'get'
                  });
    }

</script>
```

### 封装请求参数和响应数据的所有 api (可选项)
1. 新建 `src/api/index.ts`
```typescript
import * as login from './module/login';
import * as index from './module/index';

export default Object.assign({}, login, index);

```

2. 新建 `src/api/module/login.ts` 和 `src/api/module/index.ts`
```typescript
import request from '@/utils/axios';

/**
 * 登录
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
export const login = (username: string, password: string) => {
    return request<IResponseType<ILogin>>({
        url: '/api/auth/login',
        method: 'post',
        data: {
            username,
            password
        }
    });
};
```
3. 由于使用了 typescript，所以需新增 `src/types/shims-axios.d.ts` 
```typescript
import { AxiosRequestConfig } from 'axios';
/**
 * 自定义扩展axios模块
 * @author Maybe
 */
declare module 'axios' {
    export interface AxiosInstance {
        <T = any>(config: AxiosRequestConfig): Promise<T>;
        request<T = any>(config: AxiosRequestConfig): Promise<T>;
        get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
        delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
        head<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
        post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
        put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
        patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
    }
}

```
4. 在 `src/pages/request.vue` 页面中使用
```typescript
<script lang="ts">
    import API from '@/api';
    
    const requestRes = async () => {
        let result = await API.login('zhangsan', '123456');
    }

</script>

```

## 使用 [commitizen](https://github.com/commitizen/cz-cli) 规范git提交
为了使团队多人协作更加的规范，所以需要每次在 git 提交的时候，做一次硬性规范提交，规范 git 的提交信息

### 安装 `commitizen` (交互式提交 + 自定义提示文案 + Commit规范)

我们提交使用 `yarn commit` 或者 `git cz` 即可完成规范提交

```javascript
module.exports = {
    types: [
        {value: 'feature',  name: 'feature:  增加新功能'},
        {value: 'bug',      name: 'bug:      测试反馈bug列表中的bug号'},
        {value: 'fix',      name: 'fix:      修复bug'},
        {value: 'ui',       name: 'ui:       更新UI'},
        {value: 'docs',     name: 'docs:     文档变更'},
        {value: 'style',    name: 'style:    代码格式(不影响代码运行的变动)'},
        {value: 'perf',     name: 'perf:     性能优化'},
        {value: 'refactor', name: 'refactor: 重构(既不是增加feature，也不是修复bug)'},
	{value: 'release',  name: 'release:  发布'},
	{value: 'deploy',   name: 'deploy:   部署'},
        {value: 'test',     name: 'test:     增加测试'},
        {value: 'chore',    name: 'chore:    构建过程或辅助工具的变动(更改配置文件)'},
        {value: 'revert',   name: 'revert:   回退'},
    	{value: 'build',    name: 'build:    打包'}
    ],
    // override the messages, defaults are as follows
    messages: {
        type: '请选择提交类型:',
        customScope: '请输入您修改的范围(可选):',
        subject: '请简要描述提交 message (必填):',
        body: '请输入详细描述(可选，待优化去除，跳过即可):',
        footer: '请输入要关闭的issue(待优化去除，跳过即可):',
        confirmCommit: '确认使用以上信息提交？(y/n/e/h)'
    },
    allowCustomScopes: true,
    skipQuestions: ['body', 'footer'],
    subjectLimit: 72
};
```
交互界面测试

![carbon.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d2be96b13d3c427e919b11e5bc5404e4~tplv-k3u1fbpfcp-watermark.image?)

-   到目前只是规范了 git 的提交信息，我们对提交前代码的检查还没有做到位，例如 ESLint、Prettier，毕竟谁都会有疏忽的时候，
-   那么现在我们的 husky 就闪亮登场了

## 安装 husky + lint-staged
husky会在commit之前添加一个hook，在commit之前做一些操作，正好可以用来我们继续进行提交前的代码格式化和校验

而lint-staged只对暂存区的代码进行检验。

之后进行commit操作就可以看到 hook 生效了


