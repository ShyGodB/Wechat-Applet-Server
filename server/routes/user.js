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
router.post('/user/updateUser', async (ctx) => {
    const data = ctx.request.body;
    const id = data[0];
    const name = data[1];
    console.log(data);
    switch(name) {
    	case 'price':
    	    const price1 = data[2];
    	    const data1 = [price1, id];
    	    const updatePricePromise1 = user.updatePrice(data1);
    	    await updatePricePromise1;
    	    ctx.body = {msg: '成功'};
    	    break;
        case '价格':
            const price2 = data[2];
            const data2 = [price2, id];
            const updatePricePromise2 = user.updatePrice(data2);
            await updatePricePromise2;
            ctx.body = {msg: '成功'};
            break;
    	case 'amount':
    	    const amount1 = data[2];
            const data3 = [amount1, id];
            const updateAmountPromise1 = user.updateAmount(data3);
            await updateAmountPromise1;
            ctx.body = {msg: '成功'};
            break;
    	case '油耗':
            const amount2 = data[2];
            const data4 = [amount2, id];
            const updateAmountPromise2 = user.updateAmount(data4);
            await updateAmountPromise2;
            ctx.body = {msg: '成功'};
            break;
        case '油型':
            const gasoline = data[2];
            const data5 = [gasoline, id];
            const updateGasolinePromise = user.updateGasoline(data5);
            await updateGasolinePromise;
            ctx.body = {msg: '成功'};
            break;
    	case '昵称':
            const nickname = data[2];
            const data6 = [nickname, id];
            const updateNicknamePromise = user.updateNickname(data6);
            await updateNicknamePromise;
            ctx.body = {msg: '成功'};
            break;
        case '手机':
            const mobile = data[2];
            const data7 = [mobile, id];
            const updateMobilePromise = user.updateMobile(data7);
            await updateMobilePromise;
            ctx.body = {msg: '成功'};
            break;
        case '性别':
            const gender = data[2];
            const data8 = [gender, id];
            const updateGenderPromise = user.updateGender(data8);
            await updateGenderPromise;
            ctx.body = {msg: '成功'};
            break;
        case '国籍':
            const country = data[2];
            const data9 = [country, id];
            const updateCountryPromise = user.updateCountry(data9);
            await updateCountryPromise;
            ctx.body = {msg: '成功'};
            break;
        case '生日':
            const birthday = data[2];
            const data10 = [birthday, id];
            const updateBirthdayPromise = user.updateBirthday(data10);
            await updateBirthdayPromise;
            ctx.body = {msg: '成功'};
            break;
        case '地址':
            const address = data[2];
            const data11 = [address, id];
            const updateAddressPromise = user.updateAddress(data11);
            await updateAddressPromise;
            ctx.body = {msg: '成功'};
            break;
        }
});

// 添加用户反馈
router.post('/user/feedback', async (ctx) => {
    const data = ctx.request.body;
    // console.log(data);
    await user.addFeedback(data);
    ctx.body = {msg: '成功'};
});



module.exports = router;
