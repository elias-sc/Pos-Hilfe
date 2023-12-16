const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool(process.env.DATABASE_URL);


module.exports = pool.promise();

/*
    Connect
    ------
    const connection = await db.getConnection();
    const [rows, fields] = await connection.execute('SELECT * FROM exercises');
    connection.release();
    console.log(rows)

*/
