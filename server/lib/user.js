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
    },

    async updateNickname(data) {
        const sql = "update user set nickname=? where id = ?";
        await promisePool.query(sql, data);
    },

    async updateGender(data) {
        const sql = "update user set gender=? where id = ?";
        await promisePool.query(sql, data);
    },

    async updateGasoline(data) {
        const sql = "update user set gasoline=? where id = ?";
        await promisePool.query(sql, data);
    },

    async updateMobile(data) {
        const sql = "update user set mobile=? where id = ?";
        await promisePool.query(sql, data);
    },

    async updateCountry(data) {
        const sql = "update user set country=? where id = ?";
        await promisePool.query(sql, data);
    },

    async updateBirthday(data) {
        const sql = "update user set birthday=? where id = ?";
        await promisePool.query(sql, data);
    },

    async updateAddress(data) {
        const sql = "update user set address=? where id = ?";
        await promisePool.query(sql, data);
    },

    async addFeedback(data) {
        const sql = "insert into feedback(user_id, user_name, type, title, msg, mobile, email, qq) values(?, ?, ?, ?, ?, ?, ?, ?)";
        await promisePool.query(sql, data);
    }

};


module.exports = object;
