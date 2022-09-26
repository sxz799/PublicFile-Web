# publicfile-web

使用 vue + ant design vue 搭建的临时网盘系统前端页面

## 后端仓库

[PublicFile-Server](https://github.com/sxz799/PublicFile-Server)

## 编译命令
```
npm install
```
```
npm run build
```


## 配置nginx配置文件解决跨域问题
```
location /file {
                proxy_pass http://124.223.7.129:9091;
        }
```