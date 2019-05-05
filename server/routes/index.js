const Router = require('koa-router');
const router = new Router();
const axios = require('axios');
const user = require('../lib/user');


// 请求主页
router.get("/", async (ctx) => {
    await ctx.render("index");
});

router.post("/onLogin", async (ctx) => {
    const code = ctx.request.body.code;
    let data, openid;
    const appId = 'wxd769fd7ca8895e6e';
    const appSecret = '6a91717350ce071f0a0477d097fde800';
    const aCode = 'authorization_code';
    const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${appId}&secret=${appSecret}&js_code=${code}&grant_type=${aCode}`;
    await axios.get(url)
     	.then((response) => {
            data = response.data;
            openid = data.openid;
     	})
     	.catch((error) => {
            ctx.body = {msg: error}
     	});
    const getUserPromise = user.getUser(openid);
    const rows = await getUserPromise;
    if(rows.length === 0) {
        ctx.body = {msg: '新用户'}
    } else {
        ctx.body = {msg: '老用户'}
    }
});


module.exports = router;
