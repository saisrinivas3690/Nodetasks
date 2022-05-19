const mysql = require('mysql2')

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'test',
  password: '78930108@sS',
})

module.exports = connection
