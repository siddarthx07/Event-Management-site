module.exports = {
  configureWebpack: {
    plugins: [
      new (require('webpack')).DefinePlugin({
        __VUE_OPTIONS_API__: true,
        __VUE_PROD_DEVTOOLS__: false,
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false,  // Add this flag here
      })
    ]
  }
};
