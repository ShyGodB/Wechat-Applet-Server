rolerconst mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '1234qwer',
    database: 'oil'
});

const promisePool = pool.promise();


const object = {

    async addGasolineRecord(data) {
        const sql = "insert into record_gasoline(user_id, gasoline, price, num, cost, ms, time) values(?, ?, ?, ?, ?, ?, ?)";
        await promisePool.query(sql, data);
    },

    async listGasolineRecord(data) {
        const sql = "select * from record_gasoline where user_id=?";
        const [rows, fields] = await promisePool.query(sql, data);
        return rows;
    }

};


module.exports = object;
