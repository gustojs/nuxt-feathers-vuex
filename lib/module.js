const { resolve } = require('path')
const { existsSync } = require('fs')

module.exports = function module (globalOptions) {
  /*
  * Default options
  */
  const options = Object.assign(
    {
      url: 'http://localhost:3030',
      id: 'id',
      userService: 'users',
      authModule: 'auth',
      cookie: 'feathers-jwt',
      middleware: true,
      redirect: 'login',
      plugin: true,
      generate: true,
      verbose: false,
      services: [],
      srcDir: ''
    },
    globalOptions
  )

  /**
   * Build file path.
   *
   * @param to
   * @returns {string}
   */
  const path = (to) => {
    return '../' + options.srcDir.replace(/^\/+|\/+$/g, '/') + to.replace(/^\/+/, '/')
  }

  /*
  * Plugin
  */
  this.addPlugin({
    src: resolve(__dirname, 'templates/plugin.js'),
    fileName: path('/plugins/feathers.js'),
    options
  })

  /*
  * Generate middleware
  */
  if (options.generate && options.middleware && !existsSync('./middleware/feathers.js')) {
    this.addTemplate({
      src: resolve(__dirname, 'templates/middleware.js'),
      fileName: path('/middleware/feathers.js'),
      options
    })
  }

  /*
  * Generate store
  */
  if (options.generate && !existsSync('./store/index.js')) {
    this.addTemplate({
      src: resolve(__dirname, 'templates/store.js'),
      fileName: path('/store/index.js'),
      options
    })
  }

  /*
  * Generate auth
  */
  if (options.generate && !existsSync('./store/services/' + options.authModule + '.js')) {
    this.addTemplate({
      src: resolve(__dirname, 'templates/auth.js'),
      fileName: path('/store/services/' + options.authModule + '.js'),
      options
    })
  }

  /*
  * Generate services
  */
  if (options.generate) {
    options.services.forEach((name) => {
      if (!existsSync('./store/services/' + name + '.js')) {
        this.addTemplate({
          src: resolve(__dirname, 'templates/service.js'),
          fileName: path('/store/services/' + name + '.js'),
          options
        })
      }
    })
  }
}
