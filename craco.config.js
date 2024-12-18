const Dotenv = require("./config-env");
const webpack = require("webpack");
module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.resolve.fallback = {
        stream: false, // Không sử dụng polyfill cho stream
        buffer: false,
      };
      return webpackConfig;
    },
    plugins: [new Dotenv()],
  },
  style: {
    postcss: {
      plugins: [require("tailwindcss"), require("autoprefixer")],
    },
  },
  typescript: {
    enableTypeChecking: true,
  },
};
