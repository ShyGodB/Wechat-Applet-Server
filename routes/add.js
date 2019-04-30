const Router = require('koa-router');
const add = require('../lib/add');
const router = new Router();


// 添加用户出行记录
router.post("/addGasolineRecord", async (ctx) => {
    const uploadedData = ctx.request.body;
    const userId = uploadedData.userId;
    const price = uploadedData.price;
    const num = uploadedData.num;
    const cost = uploadedData.cost;
    const data = [userId, price, num, cost];
    console.log(data);
    const addGasolineRecordPromise = add.addGasolineRecord(data);
    await addGasolineRecordPromise;
    ctx.body = {cost: cost}
});


// 获取用户出行记录
router.post("/listGasolineRecord", async (ctx) => {
    const userId = ctx.request.body.userId;
    const listGasolineRecordPromise = add.listGasolineRecord(userId);
    const rows = await listGasolineRecordPromise;
    ctx.body = rows;
});



module.exports = router;
