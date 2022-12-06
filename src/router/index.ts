import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'

import store from '@/store/index';

Vue.use(VueRouter)


const routes = new Array<RouteConfig>();
if (store.state.courseContent) {
  let menuComponent = 'Menu';
  switch(store.state.courseContent.menu._type) {
    case 'tiles':
      menuComponent = 'Menu';
      break;
    case 'pages':
      menuComponent = 'PageMenu';
      break;
  }
  if (store.state.courseContent.global._navigation === 'navigation') {
    routes.push({
      path: '/menu',
      name: 'menu',
      component: () =>
        import('../views/' + menuComponent + '.vue'),
    });
  }
  store.state.courseContent.topics.forEach((topic: any) => {
    let component = topic._component.charAt(0).toUpperCase() + topic._component.substring(1);
    routes.push({
      path: topic._uri,
      name: topic._uri,
      component: () =>
        import('../views/' + component + '.vue'),      
    });
  });

  //
  

}

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior() {
    if (document.getElementById('vertical') !== null) {
      document.getElementById('vertical')!.scrollIntoView();
    }
    if (document.getElementById('horizontal') !== null) {
      document.getElementById('horizontal')!.scrollIntoView();
    }

    //go to top of page!
    var elem = document.getElementById('app');
    if (elem) {
      setTimeout(() => {
        elem!.scrollTop = 0;
      }, 100);
    }

  }
})

if (store.state.courseContent.global._navigation === 'navigation' && !store.state.started) {
  Vue.nextTick(() => {
    router.replace({path: '/menu'});
  });
}

export default router;
