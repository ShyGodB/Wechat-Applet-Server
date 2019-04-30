const Koa = require('koa');
const path = require('path');
const json = require('koa-json');
const render = require('koa-ejs');
const bodyParser = require('koa-bodyparser');

const addRouter = require('./routes/add');
const userRouter = require('./routes/user');
const driveRouter = require('./routes/drive');
const indexRouter = require('./routes/index');

const app = new Koa();


app.use(json());
app.use(bodyParser());
app.use(require('koa-static')(__dirname));


//配置模版引擎
render(app, {
    root: path.join(__dirname, 'views'),
    layout: 'layouts/layout',
    viewExt: 'html',
    cache: false,
    debug: false
});


// 配置路由模块
app.use(userRouter.routes()).use(userRouter.allowedMethods());
app.use(driveRouter.routes()).use(driveRouter.allowedMethods());
app.use(addRouter.routes()).use(addRouter.allowedMethods());
app.use(indexRouter.routes()).use(indexRouter.allowedMethods());


app.listen(8080, () => {
    console.log("Server is running at http://127.0.0.1:8080");
});
