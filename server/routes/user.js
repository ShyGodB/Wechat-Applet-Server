const Router = require('koa-router');
const user = require('../lib/user');
const axios = require('axios');
const router = new Router();
const md5 = require('md5');


// 新增用户
router.post("/addUser", async (ctx) => {
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

// 获取所有用户的openid
router.post("/listAllOpenid", async (ctx) => {
    const listAllOpenidPromise = user.listAllOpenid();
    const allOpendiArray = await listAllOpenidPromise;
    let openidArray = [];
    for(let i = 0; i < allOpendiArray.length; i++) {
    	openidArray.push(allOpendiArray[i].openid)
    }
    ctx.body = openidArray;
});

// 获取单个用户的所有信息
router.post("/getUser", async (ctx) => {
    const openid = ctx.request.body.openid;
    const getUserPromise = user.getUser(openid);
    const userInfo = await getUserPromise;
    // console.log(userInfo);
    ctx.body = userInfo;
});

// 更新用户部分信息
router.post('/updateUser', async (ctx) => {
    const data = ctx.request.body;
    const id = data[0];
    const name = data[1];
    switch(name) {
	case 'price':
	    const price = data[2];
	    const data1 =  [price, id];
	    const updatePricePromise = user.updatePrice(data1);
	    await updatePricePromise;
	    ctx.body = {msg: '成功'};
	    break;
	case 'amount':
	    const amount = data[2];
            const data2 =  [amount, id];
            const updateAmountPromise = user.updateAmount(data2);
            await updateAmountPromise;
            ctx.body = {msg: '成功'};
            break;
    }
});


module.exports = router;
