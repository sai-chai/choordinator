const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const BabelMinifyPlugin = require('babel-minify-webpack-plugin');
const path = require('path');

module.exports = {
   entry: {
      polyfills: path.join(__dirname, "src", "polyfills.js"),
      index: path.join(__dirname, "src", "client", "index.js"),
      app: path.join(__dirname, "src", "containers", "App", "index.js")
   },
   output: {
      path: path.join(__dirname, "build"),
      publicPath: "/",
      filename: "[name].bundle.js"
   },
   devServer: {
      contentBase: path.join(__dirname, "build"),
      compress: true,
      hot: true,
      port: 3000
   },
   devtool: "inline-source-map",
   watchOptions: {
      poll: 5000
   },
   plugins: [
      new CleanWebpackPlugin(),
      new BabelMinifyPlugin(),
      new HtmlWebpackPlugin({
         template: path.join(__dirname, "src", "client", "index.html"),
         filename: "index.html"
      })
   ],
   resolve: {
      modules: [
         path.resolve(__dirname, "src", "containers"),
         "node_modules"
      ]
   },
   module: {
      rules: [
         {
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            use: ["babel-loader", "eslint-loader"]
         },
         {
            test: /\.html$/,
            use: [
               {
                  loader: "html-loader"
               }
            ]
         },
         {
            test: /\.s[ac]ss$/i,
            use: [
               "style-loader",
               "css-loader",
               "sass-loader"
            ]
         },
         {
            test: /\.svg$/,
            use: ['svg-inline-loader?classPrefix&idPrefix']
         }
      ]
   }
};
