const CompressionPlugin = require('compression-webpack-plugin')
// const proxy = require('http-proxy-middleware');

module.exports = {
  // 详细、更多配置请查看官网https://cli.vuejs.org/zh/config/#vue-config-js

  /** 区分打包环境与开发环境
   * process.env.NODE_ENV==='production'  (打包环境)
   * process.env.NODE_ENV==='development' (开发环境)
   * baseUrl: process.env.NODE_ENV==='production'?"https://cdn.didabisai.com/front/":'front/',
   */

  // publicPath 项目部署的基础路径
  // 从 Vue CLI 3.3 起已弃用baseUrl，请使用publicPath
  // 我们默认假设你的应用将会部署在域名的根部,
  // 例如 https://www.my-app.com/
  // 如果你的应用部署在一个子路径下，那么你需要在这里
  // 指定子路径。比如将你的应用部署在
  // https://www.foobar.com/my-app/
  // 那么将这个值改为 '/my-app/'
  publicPath: '',

  chainWebpack: config => {
    // 解决ie11兼容ES6
    // config.entry('main').add('babel-polyfill')
    // 开启图片压缩
    // config.module.rule('images')
    // .test(/\.(png|jpe?g|gif|svg)(\?.*)?$/)
    // .use('image-webpack-loader')
    // .loader('image-webpack-loader')
    // .options({ bypassOnDebug: true })
    // 开启js、css压缩
    if (process.env.NODE_ENV === 'production') {
      config.plugin('compressionPlugin')
        .use(new CompressionPlugin({
          test: /\.js$|\.html$|.\css/, // 匹配文件名
          threshold: 10240, // 对超过10k的数据压缩
          deleteOriginalAssets: false // 不删除源文件
        }))
    }
  },

  outputDir: 'D:\\phpstudy_pro\\WWW\\www.shuangfeiren.io\\public\\pid-vip', /* 当运行 npm run build 时生成的生产环境构建文件的目录。注意目标目录在构建之前会被清除 (构建时传入 --no-clean 可关闭该行为)。 */
  lintOnSave: false, /* 保存时是否执行 eslint-loader 的语法检查 */

  productionSourceMap: false, /* 默认值是true,如果你不需要生产环境的 source map，可以将其设置为 false 以加速生产环境构建 */
  css: { /* css相关配置 */
    extract: true, /* 默认值：生产环境下是 true，开发环境下是 false。是否将组件中的 CSS 提取至一个独立的 CSS 文件中 (而不是动态注入到 JavaScript 中的 inline 代码)。 */
    sourceMap: false, /* 默认值：false。是否为 CSS 开启 source map。设置为 true 之后可能会影响构建的性能 */
    loaderOptions: {
      less: {
        javascriptEnabled: true
      }
    }, /* 向 CSS 相关的 loader 传递选项 */
    modules: false
  },

  devServer: { /* 针对开发的配置 */
    open: true, /* 项目启动起来后自动在浏览器中打开首页。默认值：false string。true-使用默认浏览器；也可使用string类型配置浏览器名称，如 Google Chrome */
    // host: "0.0.0.0",    /* 主机配置，默认情况下是本机 localhost , 0.0.0.0 即本机*/
    // port: 8080,         /* 端口 */
    // https: false,       /* 默认通过HTTP提供服务。当为true时通过HTTPS提供服务 */
    proxy: { /* 设置代理服务器（前端应用和后端 API 服务器没有运行在同一个主机上时需要配置此项） */
      '/api': {
        target: 'http://www.shuangfeiren.io', /* 后端服务器ip */
        ws: true,
        secure: false,
        changeOrigin: true, /* 是否跨域，此项解决跨域问题 */
        pathRewrite: { /* 路径重写 */
          '^/api': '' /* 移除url中多于的 /api，当然，也可以配置成其它路径 */
        } /* 具体文档https://github.com/chimurai/http-proxy-middleware#proxycontext-config */
      }
    }
  }
}
