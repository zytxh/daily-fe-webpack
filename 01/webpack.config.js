const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  entry: ['./src', './src/base'],
  output: {
    path: path.resolve(__dirname, 'dist'),
    // 单入口文件默认name为main hash是32位根据打包内容生成的hash序列(可以指定为8位)
    filename: 'bundle.[hash:8].js',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        // css-loader 处理样式表中的url路径的资源打包，将css当做一个模块处理
        // style- loader会将样式文件作为style标签插入到head元素内
        // 注意书写顺序，编译时loader会从右至左使用
        use: ['style-loader', 'css-loader'], 
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html', // html模板（此处使用ejs模板，可以使用ejs语法手动插入一些数据）
      filename: 'index.html', // 打包后命名
      hash: true, // html引入的js文件加入查询字符串避免缓存（此处和output的hash功能重复了）
      minify: {
        removeAttributeQuotes: true, // 移除属性的双引号
      }
    }),
    new CleanWebpackPlugin()
  ],
  // 配合package.json中的dev命令使用
  /**
   *  "dev": "webpack-dev-server --mode development --open"
   */
  // 注意devServer访问的文件是在内存中的,即使没有dist目录,只要启动了devServer也是能够访问到bundle.js的
  // (index.html目前是人为加的，所以如果被删除了，是访问不到的)
  devServer: {
    contentBase: 'dist', // 服务的根目录
    host: 'localhost',
    port: 8080,
    compress: true, // 服务返回给浏览器启用gzip压缩
  }
}

// webServer会监听源文件目录的改动，自动打包
// 同时通知客户端进行刷新(通过打包的时候注入的websocket实现的)

