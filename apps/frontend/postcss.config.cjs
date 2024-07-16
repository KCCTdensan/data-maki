const browserslist = require("browserslist");

module.exports = {
  plugins: {
    "@pandacss/dev/postcss": {},
    "postcss-lightningcss": {
      browsers: browserslist(),
    },
  },
};
