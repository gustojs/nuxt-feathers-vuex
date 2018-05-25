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
      plugin: true,
      verbose: false,
      redirect: 'login',
      generate: []
    },
    globalOptions
  )

  /*
  * Plugin
  */
  this.addPlugin({
    src: resolve(__dirname, 'templates/plugin.js'),
    fileName: 'feathers.js',
    options
  })

  /*
  * Generate middleware
  */
  if (options.generate.includes('middleware') && !existsSync('./middleware/feathers.js')) {
    this.addTemplate({
      src: resolve(__dirname, 'templates/middleware.js'),
      fileName: '../middleware/feathers.js',
      options
    })
  }

  /*
  * Generate store
  */
  if (options.generate.includes('store') && !existsSync('./store/index.js')) {
    this.addTemplate({
      src: resolve(__dirname, 'templates/store.js'),
      fileName: '../store/index.js',
      options
    })
  }

  /*
  * Generate auth
  */
  if (options.generate.includes(options.auth) && !existsSync('./store/services/' + options.auth + '.js')) {
    this.addTemplate({
      src: resolve(__dirname, 'templates/auth.js'),
      fileName: '../store/services/' + options.auth + '.js',
      options
    })
  }

  /*
  * Generate services
  */
  const services = options.generate.filter((name) => ![ 'store', 'auth' ].includes(name))

  services.forEach((name) => {
    if (!existsSync('./store/services/' + name + '.js')) {
      this.addTemplate({
        src: resolve(__dirname, 'templates/service.js'),
        fileName: '../store/services/' + name + '.js',
        options
      })
    }
  })
}
