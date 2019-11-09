module.exports = {
   presets: [
      [
         "@babel/preset-env",
         {
            corejs: 3,
            targets: "> 5% and not dead",
         },
      ],
      "@babel/preset-react",
   ],
   plugins: [
      "babel-plugin-styled-components",
      "@babel/plugin-syntax-dynamic-import",
   ],
};
