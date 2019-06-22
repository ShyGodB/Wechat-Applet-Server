const Router = require('koa-router');
const user = require('../lib/movement/user');
const axios = require('axios');
const router = new Router();
const md5 = require('md5');


// 新增用户
router.post("/movement/addUser", async (ctx) => {
    const userInfo = ctx.request.body.userInfo;
    const code = ctx.request.body.code;
    let data;
    const appId = 'wxd769fd7ca8895e6e';
    const appSecret = '6a91717350ce071f0a0477d097fde800';
    const aCode = 'authorization_code';
    const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${appId}&secret=${appSecret}&js_code=${code}&grant_type=${aCode}`;
    await axios.get(url)
        .then((response) => {
            data = response.data;
        })
        .catch((error) => {
            ctx.body = {code: '失败', msg: error}
        });
    const getUserPromise1 = user.getUser(data.openid);
    const rows = await getUserPromise1;
    if(rows.length === 0) {
	const data1 = [userInfo.nickName, userInfo.gender, userInfo.avatarUrl, userInfo.city, userInfo.country, userInfo.province, data.openid];
    	const addUserPromise = user.addUser(data1);
    	await addUserPromise;
    }
    const getUserPromise = user.getUser(data.openid);
    const userData = await getUserPromise;
    ctx.body = {session_key: md5(data.session_key) ,userData: userData};
});

router.post("/movement/onLogin", async (ctx) => {
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

module.exports = router;
