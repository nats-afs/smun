import Vue from 'vue'
import App from './App.vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.css'

import {
  sync
} from 'vuex-router-sync'
import {
  store
} from "./store";
import router from "./router";
import {
  firebaseAuth
} from '@/config/firebaseConfig';

const unsync = sync(store, router)

// firebaseListener(authStatusChange);

Vue.use(Vuetify)

new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App),
  created() {
    console.log('Aplicacion creada');
    firebaseAuth().onAuthStateChanged((user) => {
      if (user)
        console.log(`${user.email} a cambiado de estado`)
      else
        console.log('No existe usuario');
      // this.$store.dispatch('autoSignIn', user)
    })
  }
})

// function authStatusChange(loggedIn, user) {
//   if (store) {
//     store.commit('AUTH_STATUS_CHANGE');
//     if (user) {
//       // store.dispatch('getShoppingCart', {
//       //   uid: user.uid,
//       //   currentCart: store.getters.cartItemList
//       // });
//       console.log('Usuario autenticado');
//       router.push('/')
//     } else {
//       console.log('No existe usuario autenticado');
//       router.push('/login')
//     }
//   }
// }