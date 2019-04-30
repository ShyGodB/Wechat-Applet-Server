const Router = require('koa-router');
const user = require('../lib/user');
const router = new Router();



// 新增用户
router.post("/addUser", async (ctx) => {
    const userInfo = ctx.request.body.userInfo;
    const userTicket = ctx.request.body.userTicket;
    const data = [userInfo.nickName, userInfo.gender, userInfo.avatarUrl, userInfo.city, userInfo.country, userInfo.province, userTicket.openid, userTicket.session_key];
    const addUserPromise = user.addUser(data);
    await addUserPromise;
    ctx.body = {msg: "成功"};
});

// 获取所有用户信息

router.post("/listAllOpenid", async (ctx) => {
    const listAllOpenidPromise = user.listAllOpenid();
    const allOpendiArray = await listAllOpenidPromise;
    let openidArray = [];
    for(let i = 0; i < allOpendiArray.length; i++) {
    	openidArray.push(allOpendiArray[i].openid)
    }
    ctx.body = openidArray;
});

// 获取单个用户信息
router.post("/getUser", async (ctx) => {
    const openid = ctx.request.body.openid;
    const getUserPromise = user.getUser(openid);
    const userInfo = await getUserPromise;
    // console.log(userInfo);
    ctx.body = userInfo;
});

// 更新用户信息
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
	case 'spend':
	    const spend = data[2];
        const data2 =  [spend, id];
        const updateCarSpendPromise = user.updateCarSpend(data2);
        await updateCarSpendPromise;
        ctx.body = {msg: '成功'};
        break;
    }
});

module.exports = router;
