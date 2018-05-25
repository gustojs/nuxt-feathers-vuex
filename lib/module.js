const { resolve } = require('path')
const { existsSync } = require('fs')

module.exports = function module (globalOptions) {
  /*
  * default options
  */
  const options = Object.assign(
    {
      url: 'http://localhost:3030',
      id: 'id',
      userService: 'users',
      moduleName: 'auth',
      cookieName: 'feathers-jwt',
      generate: []
    },
    globalOptions
  )

  /*
  * plugin
  */
  this.addPlugin({
    src: resolve(__dirname, 'templates/plugin.js'),
    fileName: 'feathers.js',
    options
  })

  /*
  * generate middleware
  */
  if (options.generate.includes('middleware') && !existsSync('./middleware/feathers.js')) {
    this.addTemplate({
      src: resolve(__dirname, 'templates/middleware.js'),
      fileName: '../middleware/feathers.js',
      options
    })
  }

  /*
  * generate store
  */
  if (options.generate.includes('store') && !existsSync('./store/index.js')) {
    this.addTemplate({
      src: resolve(__dirname, 'templates/store.js'),
      fileName: '../store/index.js',
      options
    })
  }

  /*
  * generate auth
  */
  if (options.generate.includes('auth') && !existsSync('./store/services/auth.js')) {
    this.addTemplate({
      src: resolve(__dirname, 'templates/auth.js'),
      fileName: '../store/services/auth.js',
      options
    })
  }

  /*
  * generate services
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
