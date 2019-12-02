var mysql = require('mysql2/promise');

var setari = require.main.require("./setari");


//console.log(setari)
var pool = mysql.createPool(
    setari.mysqlConfig
)

pool.getConnection((err, connection) => {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('Database connection was closed.')
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('Database has too many connections.')
        }
        if (err.code === 'ECONNREFUSED') {
            console.error('Database connection was refused.')
        }
    }
    if (connection) connection.release()
    return
})

module.exports = pool

//https://evertpot.com/executing-a-mysql-query-in-nodejs/