const webpack = require('webpack');
const devMW = require('webpack-dev-middleware');
const hotMW = require("webpack-hot-middleware");
const express = require('express');
const notifier = require('node-notifier');
const config = require('../webpack/dev.config.js');

const PORT = process.env.PORT || 3000;
const app = express();

const compiler = webpack(config);

const server = devMW(compiler, {
   publicPath: config.output.publicPath,
});

server.waitUntilValid(() => {
   notifier.notify({
      title: "npm run start:dev",
      message: "Compilation complete",
   });
});

app.use(server);
app.use(hotMW(compiler));

app.listen(PORT, () => console.log(`Choordinator listening on port ${PORT}`));
