import Vue from 'vue'
import Vuex from 'vuex'
import feathersVuex, { initAuth } from 'feathers-vuex'
import feathers from '@feathersjs/feathers'
import authConfigure from '@feathersjs/authentication-client'
import socketio from '@feathersjs/socketio-client'
import io from 'socket.io-client'
import { CookieStorage } from 'cookie-storage'

/*
* Initial setup
*/
const socket = io('<%= options.url %>', { transports: [ 'websocket' ] })

export const feathersClient = feathers().configure(socketio(socket)).configure(
  authConfigure({
    storage: new CookieStorage()
  })
)

export const { service, auth, FeathersVuex } = feathersVuex(feathersClient, {
  idField: '<%= options.id %>'
})

/*
* Register $Feathers-Vuex as Vue plugin
*/

if ('<%= options.vuePlugin %>' === 'true') {
  Vue.use(FeathersVuex)
}

/*
* Register files in ~/store/services as separate service modules
* Each file will export { store, hooks }
* So that we can register the hooks too
*/
const folder = require.context('~/store/services', false, /.js$/)
// extract names from './name.js'
const allNames = folder.keys().map((key) => key.substring(2, key.length - 3))
// filter the auth plugin out as we treat it differently
const filteredNames = allNames.filter((name) => name !== 'auth')
// prepare services
const servicePlugins = () => {
  const plugins = filteredNames.map((name) => {
    let { store, hooks } = require('~/store/services/' + name)
    // register service hooks while we're at it
    feathersClient.service(name).hooks(hooks)
    return service(name, store)
  })
  // if there's no file for userService, add service manually
  if (!filteredNames.includes('<%= options.userService %>')) {
    plugins.push(service('<%= options.userService %>'))
  }
  return plugins
}

/*
* Prepare auth plugin separately
*/
const authStore = Object.assign(
  {
    state: {
      publicPages: []
    },
    actions: {
      onInitAuth ({ dispatch }, payload) {
        dispatch('authenticate')
          .then((result) => {
            // handle success like a boss
          })
          .catch((error) => {
            // handle error like a boss
          })
      }
    },
    userService: '<%= options.userService %>'
  },
  allNames.includes('auth') ? require('~/store/services/auth').store : {}
)

/*
* Prepare default store object for new Vuex.Store
* When ready, nuxtServerInit will dispatch default authenticate action
* User can replace it in store/index.js
*/
const defaultStore = {
  actions: {
    nuxtServerInit ({ commit, dispatch }, { req }) {
      return initAuth({
        commit,
        dispatch,
        req,
        moduleName: '<%= options.authModule %>',
        cookieName: '<%= options.cookie %>'
      }).then((result) => dispatch('auth/onInitAuth'))
    }
  }
}

/*
* Actual `new Vuex.Store` handler
* Plugins are an array so we need to deal with them separately
*/
export const createStore = (val = {}) => {
  // prepare user's store
  let newStore = Object.assign({}, val)
  delete newStore.plugins
  // prepare user's plugins
  let newPlugins = val.plugins || []
  return () => {
    return new Vuex.Store({
      ...Object.assign(defaultStore, newStore),
      plugins: [
        // separate services files
        ...servicePlugins(),
        // authentication service
        auth(authStore)
      ].concat(newPlugins)
    })
  }
}
