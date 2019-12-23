module.exports = {
   presets: [
      [
         "@babel/preset-env",
         {
            useBuiltIns: "usage",
            corejs: 3,
            targets: "> 5% and not dead",
         },
      ],
      "@babel/preset-react",
   ],
   plugins: [
      [
         "babel-plugin-styled-components",
         { displayName: true },
      ],
      "@babel/plugin-syntax-dynamic-import",
   ],
};
