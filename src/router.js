import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Send from './views/Send.vue'
import Transaction from './views/Transaction.vue'
import Address from './views/Address.vue'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/send',
      name: 'send',
      component: Send
    },
    {
      path: '/search',
      name: 'search',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/Search.vue')
    },
    {
      path: '/transaction/:hash',
      name: 'transaction',
      component: Transaction
    },
    {
      path: '/address/:address',
      name: 'address',
      component: Address
    }
  ]
});
// router.beforeEach((to, from, next) => {
//   if (to.path == '/send') {
//     if (Vue.prototype.$wallet === null) {
//       console.log(Vue.prototype.$wallet);
//       next({ path: '/', replace: true });
//     }
//   }
//   next();
// })
export default router;
