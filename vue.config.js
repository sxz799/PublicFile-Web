const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    port: 3000,
    proxy: {
      '/file': {
        ws: false,
        target: "http://124.223.7.129:9091",
        changeOrigin: true
      }
    }
  },
})
