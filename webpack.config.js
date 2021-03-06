const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');
// 将css文件单独提取出来 ExtractTextWebpackPlugin 报错 文档上不建议使用
// const extractCss = new ExtractTextWebpackPlugin('css/css.css');
// const extractLess = new ExtractTextWebpackPlugin('css/less.css');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  // entry: ['./src', './src/base'],
  entry: { // 多入口，每个入口根据其内部依赖生成对应chunk，最后经过一些操作(比如代码分割),写入dist目录，生成一些assets
    // index: './src/index.js',
    // base: './src/base.js',
    // vendor: 'jquery',
    // common: './src/common.js', // 公共模块的引入

    main: './src_02/main.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    // 单入口文件默认name为main hash是32位根据打包内容生成的hash序列(可以指定为8位)
    filename: '[name].[hash:8].js',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        // css-loader 处理样式表中的url路径的资源打包，将css当做一个模块处理
        // style- loader会将样式文件作为style标签插入到head元素内
        // 注意书写顺序，编译时loader会从右至左使用
        // use: ['style-loader', 'css-loader'],
        // loader: extractCss.extract({
        //   use: ['css-loader'],
        // }),
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: './css'
            }
          },
          "css-loader",
        ],
      },
      {
        test: require.resolve('jquery'),
        // loader: 'expose-loader?$',
        use: [
          {
            loader: 'expose-loader',
            options: '$',
          },
        ],
      },
      // 解析任意的二进制文件(图片文件/word等。。。)，拷贝文件至指定位置
      {
        test: /\.(png|jpeg|gif)$/,
        // use: ['file-loader'],
        use: {
          // loader: 'file-loader',
          // options: {
          //   outputPath: 'images', // 通过use对象指定输出目录
          // } 
          loader: 'url-loader', // 在文件比较小时，可通过url-loader将图片转为base64嵌入在页面中，减少请求次数
          options: {
            limit: 8*1024*1024, // 此处设置8M的限制
            outputPath: 'images',
          },
        },
      },
      {
        test: /\.less$/,
        // use: ['style-loader', 'css-loader', 'less-loader'],
        // loader: extractCss.extract({
        //   use: ['css-loader', 'less-loader'],
        // }),
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          "css-loader",
          "less-loader",
        ]
      },
    ],
  },
  plugins: [
    // new webpack.ProvidePlugin({ // 全部模块 按需的变量注入
    //   $: 'jquery',
    // }),
    new HtmlWebpackPlugin({
      template: './src/index.html', // html模板（此处使用ejs模板，可以使用ejs语法手动插入一些数据）
      filename: 'index.html', // 打包后命名
      hash: true, // html引入的js文件加入查询字符串避免缓存（此处和output的hash功能重复了）
      // chunks: ['vendor','index', 'common'], // 决定了引入哪些chunk
      minify: {
        removeAttributeQuotes: true, // 移除属性的双引号
      }
    }),
    // new HtmlWebpackPlugin({
    //   template: './src/index.html', // html模板（此处使用ejs模板，可以使用ejs语法手动插入一些数据）
    //   filename: 'base.html', // 打包后命名
    //   chunks: ['vendor', 'base', 'common'],
    //   hash: true, // html引入的js文件加入查询字符串避免缓存（此处和output的hash功能重复了）
    //   minify: {
    //     removeAttributeQuotes: true, // 移除属性的双引号
    //   }
    // }),
    new CleanWebpackPlugin(),
    // extractCss,
    // extractLess,
    new MiniCssExtractPlugin({
      filename: "css/[name].css",
    }),
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

