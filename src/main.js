// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import axios from "axios";
import VueAxios from "vue-axios";
import App from "./App";
import router from "./router";
import "./mock/mock";
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import store from './store'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import 'swiper/swiper-bundle.css'

Vue.config.productionTip = false;

Vue.use(VueAxios, axios);
Vue.use(ElementUI);
Vue.use(VueAwesomeSwiper)
    /* eslint-disable no-new */
new Vue({
    el: "#app",
    router,
    store,
    components: {
        App
    },
    template: "<App/>"
});