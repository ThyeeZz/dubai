// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VeHistogram from 'v-charts/lib/histogram.common'
import VeLine from 'v-charts/lib/line.common'
import router from '@/router/index'
import store from '@/store'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import locale from 'element-ui/lib/locale/lang/en';
import {
  succeed,
  failed,
  warning
} from '@/lib/utils'
import Mapping from '@/component/MapShower';
import LoadingConstructor from '@/component/Loading';
import directives from './directive';
import echarts from 'echarts'

Vue.use(ElementUI, {
  locale
});
Vue.use(Mapping); // js全局组：popMap
Vue.use(LoadingConstructor);
Vue.use(directives);// 全局指令

// 验证登录
// router.beforeEach((to, from, next) => {
//   const {
//     id
//   } = store.state.userInfo;
//   if (to.path !== '/' && typeof id === 'undefined') {
//     router.push({
//       path: '/'
//     })
//   } else {
//     next(); // 继续执行
//   }
// });

Vue.prototype.succeed = succeed;
Vue.prototype.failed = failed;
Vue.prototype.warning = warning;

Vue.prototype.$echarts = echarts;
//引入柱状图组件
Vue.component(VeHistogram.name, VeHistogram);
//引入折线图组件
Vue.component(VeLine.name, VeLine);

Vue.config.productionTip = false;
/* eslint-disable no-new */
new Vue({
  router,
  store,
  components: {
    App
  },
  template: '<App/>'
}).$mount('#app')
