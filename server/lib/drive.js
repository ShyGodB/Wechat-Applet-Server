const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '1234qwer',
    database: 'oil'
});

const promisePool = pool.promise();


const object = {

    async addTripRecord(data) {
        const sql = "insert into record_driving(user_id, price, amount, trip, cost, ms, time) values(?, ?, ?, ?, ?, ?, ?)";
        await promisePool.query(sql, data);
    },

    async getTripRecord(data) {
        const sql = "select * from record_driving where user_id=?";
        const [rows, fields] = await promisePool.query(sql, data);
	return rows;
    }

};


module.exports = object;
