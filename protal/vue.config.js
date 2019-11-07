module.exports = {
  lintOnSave: false,
  publicPath: process.env.NODE_ENV === 'production' ? '/protal/' : '/',
  chainWebpack: config => {
  },
  devServer: {
    port: 5000,
    proxy: {
        '/gateway': {
            target: 'http://dms-admin.dev.cloudyigou.com',
            changeOrigin: true
        }
    },
    overlay: {
        warnings: false,
        errors: false
    }
  }
}
