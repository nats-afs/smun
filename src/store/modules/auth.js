import router from "@/router";
import {
  firebaseAuth
} from '@/config/firebaseConfig';

export const AUTH_STATUS_CHANGE = "AUTH_STATUS_CHANGE"
export const SET_USER = "SET_USER"

const state = {
  isLoggedIn: false,
  user: null,
}

const getters = {
  isLoggedIn: state => state.isLoggedIn,
  currentUser: state => state.user
}

const mutations = {
  [AUTH_STATUS_CHANGE]: state => {
    state.isLoggedIn = firebaseAuth().currentUser != null;
    state.user = firebaseAuth().currentUser;
  },
}

const actions = {
  registerByEmail: (
    context, payload) => {
    return firebaseAuth().createUserWithEmailAndPassword(payload.email, payload.password);
  },
  logout: context => {
    firebaseAuth().signOut().then(() => {
      console.log('Usuario desconectado');
      context.commit(AUTH_STATUS_CHANGE)
      setTimeout(() => {
        router.push('/login')
      }, 2000);
    })
  },
  loginWithEmail: (context, payload) => {
    firebaseAuth().signInWithEmailAndPassword(payload.email, payload.password).then(user => {
        console.log(user)
        context.commit(AUTH_STATUS_CHANGE)
        router.push('/')
      })
      .catch(error => console.log(`Error en store.loginWithEmail ${error}`))
  },
  loginWithGoogle: (context, payload) => {
    firebaseAuth().signInWithPopup(new firebaseAuth.GoogleAuthProvider()).then(() => {
      context.commit(AUTH_STATUS_CHANGE)
      router.push('/')
    }).catch(error => {
      console.log(error)
    })
  },
  loginWithFacebook: (context, payload) => {
    firebaseAuth().signInWithPopup(new firebaseAuth.FacebookAuthProvider()).then(() => {
      context.commit(AUTH_STATUS_CHANGE)
      router.push('/')
    }).catch(error => {
      console.log(error)
    })
  },
}


export default {
  state,
  mutations,
  actions,
  getters
}