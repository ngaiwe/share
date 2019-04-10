const path = require('path')

module.exports = {
  mode: 'development',
  entry: path.resolve(__dirname, 'index.js'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'build.js'
  },
  devtool: 'source-map',
  resolveLoader: {
    modules: ['node_module','loaders']
  },
  watch: true,
  module: {
    rules: [
      {
        test: /\.less$/,
        use:['style-loader','css-loader','less-loader']
      }
    ]
    // rules: [
    //   {
    //     test: /\.jpg$/,
    //     use: {
    //       loader: 'url-loader',
    //       options: {
    //         limit: 200 * 1000
    //       }
    //     }
    //   },
    //   {
    //     test: /\.js$/,
    //     use: {
    //       loader: 'banner-loader',
    //       options: {
    //         text: '魏燃',
    //         filename: path.resolve(__dirname, 'contain.js')
    //       }
    //     }
    //   }
    // ]
    // rules: [
    //   {
    //     test:/\.js$/,
    //     use: {
    //       loader: 'babel-loader',
    //       options:{
    //         presets: [
    //           '@babel/preset-env'
    //         ]
    //       }
    //     }
    //   }
    // ]
  }
}