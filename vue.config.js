const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    port: 3000,
    proxy: {
      '/file': {
        ws: false,
        target: "http://127.0.0.1:9090",
        changeOrigin: true
      }
    }
  },
})
