import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import pipwerks, { SCORM } from 'pipwerks-scorm-api-wrapper'
Vue.use(pipwerks);

import VueObserveVisibility from 'vue-observe-visibility'
Vue.use(VueObserveVisibility)

import FoundationJs from 'foundation-sites'
import 'foundation-sites/js/foundation.core.js';
require('foundation-sites/dist/css/foundation.min.css');
require("@/style/global.scss");
Vue.use(FoundationJs)

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

// when start / boot-up
const Boot: () => void = () => {  
  // reinstate localstorage
  store.getters.revive;
  Vue.nextTick(() => {
    //set the languages - which shows the select overlay if needed
    store.getters.setLanguages;
    //set  default lang
    if(store.state.language === '') {
      store.state.language = store.state.courseContent.config.defaultlang;
      store.getters.write;
      store.state.showLangSelect = true;
    }
    if(store.state.courseContent.config.defaultlang !== 'en' || store.state.language !== 'en') {
      store.getters.updateLang;
    } else {
      // preload all images
      store.getters.preloadImages;
      
    }
  });
  
  //SCORM?
  if (store.state.courseContent.config.lms === true) {
    store.getters.initSCORM;
  }
}

Boot();

export default Boot;
