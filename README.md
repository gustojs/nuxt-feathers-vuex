# nuxt-feathers-vuex
[![npm (scoped with tag)](https://img.shields.io/npm/v/nuxt-feathers-vuex/latest.svg?style=flat-square)](https://npmjs.com/package/nuxt-feathers-vuex)
[![npm](https://img.shields.io/npm/dt/nuxt-feathers-vuex.svg?style=flat-square)](https://npmjs.com/package/nuxt-feathers-vuex)
[![js-standard-style](https://img.shields.io/badge/code_style-standard-brightgreen.svg?style=flat-square)](http://standardjs.com)

Nuxt-Feathers-Vuex provides default setup for using Feathers-Vuex library, configurable through `nuxt.config.js` and with the option to automatically generate service files.

It's been designed to let the user override most of configuration but if you want more freedom or find that your setup strays too far away, it may be better to just use raw Feathers-Vuex.

The documentation focuses purely on this module and doesn't explain how to use Feathers-Vuex itself. It's assumed the user knows it already.

- [Features](#features)
  - [Ready](#ready)
  - [Todo](#todo)
- [Installation](#installation)
- [Configuration](#configuration)
  - [Default options](#default-options)
  - [URL](#url)
  - [ID field](#id-field)
  - [User service](#user-service)
  - [Auth module](#auth-module)
  - [Cookie](#cookie)
  - [Plugin](#plugin)
  - [Generate](#generate)
  - [Verbose](#verbose)
  - [Services](#services)
- [Vuex store](#vuex-store)
- [Service files](#service-files)
- [Auth plugin](#auth-plugin)
- [Middleware](#middleware)

## Features

### Ready

- hide common logic under the hood
- automatically register all services
- generate store, services and other files
- scaffold in minimal or verbose mode
- provide basic middleware
- automatically log the user in

### Todo

- support for Vuex module mode
- tutorial for using environment variables as config

## Installation

First, let's add `nuxt-feathers-vuex` dependency using yarn or npm to your project. Nuxt modules handle all needed dependencies under the hood, so we don't have to add Feathers, FeathersVuex or Socket.io by ourselves.

```
$ npm install nuxt-feathers-vuex
```

Now it's time to register Nuxt-Feathers-Vuex as a modules in `nuxt.config.js`.

```js
  modules: [
    [ 'nuxt-feathers-vuex', { /* options */ }]
  ]
```

## Configuration

### Default options

These are all default values for options object. If it covers some of your preferenced settings, feel free to ommit these options.

```js
  modules: [
    [ 'nuxt-feathers-vuex', {
      url: 'http://localhost:3030',
      id: 'id',
      userService: 'users',
      authModule: 'auth',
      cookie: 'feathers-jwt',
      plugin: true,
      generate: true,
      verbose: false,
      services: []
    }]
  ]
```

### URL (String)

Socket.io requires an URL to your Feathers backend. The default http://localhost:3000 is the address referenced across Feathersjs documentation as an example for development purposes. Of course, in production mode you'll want to change it.

References: [Feathersjs](https://docs.feathersjs.com/api/client/socketio.html#socketiosocket)

### ID field (String)

FeathersClient requires to know which document field is used as ID in your database. For example while MySQL may use `id`, Mongodb by default uses `_id`.

References: [Feathersjs](https://docs.feathersjs.com/api/databases/common.html#serviceoptions)

### User service (String)

Feathers-Vuex's `auth` service handles authentication for us, but we still need to provide the name of the service we use to keep our user data.

References: [Feathers-Vuex](https://feathers-plus.github.io/v1/feathers-vuex/auth-module.html#Configuration)

### Auth module (String)

If by any chance you wish to use non-standard name for `auth` module, configure it with this option.

### Cookie (String)

As we store authentication data in a cookie, we need to name it. Don't hesitate to use your imagination, sky is the limit.

References: [Feathers-Vuex](https://feathers-plus.github.io/v1/feathers-vuex/guide.html#Authentication-storage-with-Nuxt)

### Plugin (Boolean)

Do we want to use Feathers-Vuex plugin for Vue which exposes `$FeathersVuex`.

References: [Feathers-Vuex](https://feathers-plus.github.io/v1/feathers-vuex/vue-plugin.html)

### Generate (Boolean)

Nuxt-Feathers-Vuex allows you to generate all boilerplate files, so that you don't need to add them manually.

Other than service files, you'll also get the files for `store`, `middleware` and `auth` module (with the name specified by `authModule` option).

The files are generated with `standardjs` ESLint settings. They are also protected against overwriting - if they already exist, they won't be regenerated.

Remember that if you turn this option off, you'll need to manually setup the Vuex store:

```js
import { createStore } from '~/.nuxt/feathers'
export default createStore()
```

### Verbose (Boolean)

By default Nuxt-Feathers-Vuex generates files with minimal necessary content, but you may want them more verbose, with all properties ready to fill in. In such a case, just turn this option on.

Further in the README you'll see what each file has to offer in both minimal and verbose variants.

### Services (Array of Strings)

Here you can provide the list of service names for `generate` option. 

If you turned `generate` off but listed some names, these services will still be registered in the store with default settings.

## Vuex store

***Important**: Currently Nuxt-Feathers-Vuex supports only `classic` mode.*

In order to work with Feathers-Vuex, we need to initialize few things in the store, such as `initAuth` function or registering `auth` plugin. We also need to register plugins for each Feathers service we plan to use in our app. 

Feathers-Vuex docs explain how to do it manually, but our module can take care of all that for us, keeping most of the boilerplate under the hood:

```js
import { createStore } from '~/.nuxt/feathers'
export default createStore()
```

That's the bare minimum to make Feathers-Vuex work. Remember to add it manually if you don't use `generate` option.

What about the `verbose` version? It looks like this:

```js
import { createStore } from '~/.nuxt/feathers'

export default createStore({
  modules: {
    // modules
  },
  state: {
    // state
  },
  getters: {
    // getters
  },
  mutations: {
    // mutations
  },
  actions: {
    // actions
  },
  plugins: [
    // plugins
  ]
})
```

If we don't want to keep each service setup separately, we can just pass it here with `service('serviceName')`. In such a case we need to import also `service` function.

```js
import { createStore, service } from '~/.nuxt/feathers'

export default createStore({
  plugins: [
    service('messages')
  ]
})
```

## Service files

The module automatically registers Vuex store for each file in the `~/store/services` folder based on the name of the file.

Such files should export a `store` object with additional logic for the store module and `hooks` array with Feathers hooks for the service. You can add them manually or `generate`, it's your choice.

```js
export const store = {}
export const hooks = {}
```

Here's how files generated with `verbose` option look like:

```js
export const store = {
  state: {
    // state
  },
  getters: {
    // getters
  },
  mutations: {
    // mutations
  },
  actions: {
    // actions
  },
  instanceDefaults: {
    // instance defaults
  }
}

export const hooks = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },
  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },
  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
}
```

## Auth plugin

The Nuxt-Feathers-Vuex module registers `auth` plugin automatically, but we can customize its store with a following content:

```js
export const store = {}
```

Remember that if you don't use `generate`, the file name has to equal `authModule` option value, which by default is `auth`.

We don't export `hooks` this time, since `auth` is not a service. Luckily we've got another toy to play with. Here's the `verbose` version:

```js
export const store = {
  state: {
    publicPages: []
  },
  getters: {
    // getters
  },
  mutations: {
        // handle error like a boss
      })
    }
    // mutations
  },
  actions: {
    onInitAuth ({ dispatch }) {
      dispatch('authenticate')
        .then((result) => {
        // handle success like a boss
      }).catch((error) => {
        // handle error like a boss
      })
    }
  }
}
```

Notice the `onInitAuth` action. It's called by Feathers-Vuex's `initAuth` and automatically logs us in (if possible) on website's start. Feel free to remove its code if you don't need it though - it will still work under the hood.

## Middleware

The available middleware is very basic. If the route is public and user logged in, it will pass us through. Otherwise, we'll move to route specified by `redirect` option.

```js
export default function ({ store, redirect, route }) {
  const { auth } = store.state
  if (!auth.publicPages.includes(route.name) && !auth.payload) {
    return redirect(/* route name */)
  }
}
```

If you prefer more complex solution, just overwrite the file (or create one if you don't use `generate` option).

Unfortunately the module can't register our middleware itself, so we still need to do it manually in `nuxt.config.js`:

```js
  middleware: [
    'middleware/feathers.js'
  ]
```

It's also up to us to make sure the redirect destination page actually exists.

References: [Feathers-Vuex](https://feathers-plus.github.io/v1/feathers-vuex/guide.html#Authentication-storage-with-Nuxt)

## Contact

You can often find me on official chats of either Feathers or Vue.

## Development

- Clone this repository
- Install dependencies using `yarn install` or `npm install`
- Start development server using `npm run dev`

## License

[MIT License](./LICENSE)

Copyright (c) Gusto JS <gustojs@protonmail.com>
