var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require(__dirname + '/webpack.config.js')

new WebpackDevServer(webpack(config), {
  hot: true,
  contentBase: __dirname + '/build',
  publicPath: config.output.publicPath
}).listen(3000, 'localhost', function(err) {
  if (err) {
    console.log(err);
  }
});
