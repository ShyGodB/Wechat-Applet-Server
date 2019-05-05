const Router = require('koa-router');
const router = new Router();
const axios = require('axios');
const user = require('../lib/user');
const md5 = require('md5');

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
            ctx.body = {code: '失败', msg: error}
     	});
    const getUserPromise = user.getUser(openid);
    const rows = await getUserPromise;
    if(rows.length === 0) {
        ctx.body = {code: '成功', msg: '新用户'}
    } else {
        ctx.body = {code: '成功', msg: '老用户', userInfo: rows[0]};
    }
});

router.post("/getSessionKey", async (ctx) => {
    const code = ctx.request.body.code;
    let data;
    const appId = 'wxd769fd7ca8895e6e';
    const appSecret = '6a91717350ce071f0a0477d097fde800';
    const aCode = 'authorization_code';
    const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${appId}&secret=${appSecret}&js_code=${code}&grant_type=${aCode}`;
    await axios.get(url)
        .then((response) => {
            data = response.data;
  	    ctx.body = {session_key: md5(data.session_key)};
        })
        .catch((error) => {
            ctx.body = {code: '失败', msg: error}
        });
});


module.exports = router;
