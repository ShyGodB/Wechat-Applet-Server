const Router = require('koa-router');
const drive = require('../lib/drive');
const router = new Router();


// 添加用户出行记录
router.post("/addTripRecord", async (ctx) => {
    const uploadedData = ctx.request.body;
    const userId = uploadedData.userId;
    const price = uploadedData.price;
    const amount = uploadedData.amount;
    const trip = uploadedData.trip;
    const cost = uploadedData.cost;
    const data = [userId, price, amount, trip, cost];
    console.log(data);
    const addTripRecordPromise = drive.addTripRecord(data);
    await addTripRecordPromise;
    ctx.body = {cost: cost}
});

// 获取用户出行记录
router.post("/getUserTripRecord", async (ctx) => {
    const userId = ctx.request.body.userId;
    const getTripRecordPromise = drive.getTripRecord(userId);
    const rows = await getTripRecordPromise;
    ctx.body = rows;
});



module.exports = router;
