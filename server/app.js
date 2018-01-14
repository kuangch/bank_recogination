const Koa = require('koa')
const app = new Koa()
const debug = require('debug')('koa-weapp-demo')
const response = require('./middlewares/response')
const bodyParser = require('koa-bodyparser')
const config = require('./config')
const path = require('path')
const fs = require('fs')

// 使用响应处理中间件
app.use(response)

// 解析请求体
app.use(bodyParser())

// 引入路由分发
const router = require('./routes')
app.use(router.routes())


// 配置缓存文件目录
if (!fs.existsSync(config.cache_dir)){
    fs.mkdirSync(config.cache_dir)
}
app.global = {
    cache_dir:config.cache_dir
}
debug(`cache file dir: ${app.global.cache_dir}`)

// 启动程序，监听端口
app.listen(config.port, () => debug(`listening on port ${config.port}`))
