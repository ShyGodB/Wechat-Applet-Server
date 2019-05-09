const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '1234qwer',
    database: 'oil'
});

const promisePool = pool.promise();


const object = {
    async addUser(data) {
        const sql = "insert into user(nickname, gender, avatarUrl, city, country, province, openid) values(?, ?, ?, ?, ?, ?, ?)";
        await promisePool.query(sql, data);
    },

    async listAllOpenid() {
        const sql = "select openid from user";
        const [rows, field] = await promisePool.query(sql);
	return rows;
    },

    async getUser(data) {
        const sql = "select * from user where openid = ?";
        const [rows, field] = await promisePool.query(sql, data);
        return rows;
    },

    async updateAmount(data) {
        const sql = "update user set amount=? where id=?";
        await promisePool.query(sql, data);
    },

    async updatePrice(data) {
        const sql = "update user set price=? where id = ?";
        await promisePool.query(sql, data);
    }

};


module.exports = object;
