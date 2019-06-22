const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '1234qwer',
    database: 'movement'
});

const promisePool = pool.promise();


const object = {
    /* 增增增增增增增增增增增增增增增增增增增增增增增增增增增增增增增增增增增增增增增增增增 */
    async addUser(data) {
        const sql = "insert into user(nickname, avatarUrl, openid) values(?, ?, ?)";
        await promisePool.query(sql, data);
    },

    async getUser(data) {
        const sql = "select * from user where openid = ?";
        const [rows, field] = await promisePool.query(sql, data);
        return rows;
    },

};


module.exports = object;
