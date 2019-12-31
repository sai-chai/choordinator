const webpack = require('webpack');
const express = require('express');
const config = require('../webpack/prod.config.js');

const PORT = process.env.PORT || 80;
const app = express();

try {
   webpack(config, (err, stats) => {
      if (err) {
         console.error(err.stack || err);
         if (err.details) {
            console.error(err.details);
         }
         return;
      }
      const info = stats.toJson();
      console.log(stats.toString());
      if (stats.hasErrors()) {
         console.error(info.errors);
      }
      if (stats.hasWarnings()) {
         console.warn(info.warnings);
      }
      app.use(express.static('build'));
      app.listen(PORT, () => console.log(`Choordinator listening on port ${PORT}`));
   });
} catch (err) {
   process.exit(1);
}
