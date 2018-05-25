const path = require('path')
const rules = require('vue-webpack-loaders')
const resolve = path.resolve
const join = path.join

const materialPaths = {
  includePaths: [
    resolve(__dirname, 'node_modules')
  ],
  alias: {
    '@material/': resolve(__dirname, 'node_modules/@material')
  }
}

rules.push({
  test: /\.scss$/,
  loaders: [
    'style-loader',
    'css-loader',
    'sass-loader'
  ]
})

const generateCSSLoaders = loaders => {
  return loaders.map(loader => {
    if (typeof loader === 'object') {
      loader.options = {...loader.options, ...materialPaths}
      return loader
    }
    return loader
  })
}

module.exports = {
  components: 'src/components/**/*.vue',
  require: [
    join(__dirname, 'src/plugins/vue-bem.js'),
    join(__dirname, 'styleguidist/index.js'),
    join(__dirname, 'styleguidist/overrides.css')
  ],
  template: {
    head: {
      links: [
        {
          href: 'https://fonts.googleapis.com/css?family=Roboto:300,300i,400,400i,500,500i,700,700i|Material+Icons',
          rel: 'stylesheet'
        }
      ]
    }
  },
  webpackConfig: {
    resolve: {
      extensions: ['.vue'],
      alias: {
        '~': resolve(__dirname, 'src'),
        '@': resolve(__dirname, 'src')
      }
    },
    module: {
      rules
    }
  },
  dangerouslyUpdateWebpackConfig (webpackConfig, env) {
    let vueLoader = webpackConfig.module.rules.find((rule) => {
      return rule.loader === 'vue-loader'
    })
    let loaders = vueLoader.options.loaders
    loaders.sass = generateCSSLoaders(loaders.sass)
    loaders.scss = generateCSSLoaders(loaders.scss)
    return webpackConfig
  },
  showUsage: true,
  showCode: true
}
