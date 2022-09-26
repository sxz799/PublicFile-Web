const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    port: 4000,
    proxy: {
      '/file': {
        ws: false,
        target: "http://127.0.0.1:9091",
        changeOrigin: true
      }
    }
  },
})
