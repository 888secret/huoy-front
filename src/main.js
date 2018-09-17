import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/'
import ElementUI from 'element-ui'
import jQuery from 'jquery'
import 'element-ui/lib/theme-chalk/index.css'

Vue.config.productionTip = false;

Vue.use(ElementUI);
Vue.use(jQuery);

new Vue({
	el: '#app',
	router,
	store,
	template: '<App/>',
	components: { App }
})
