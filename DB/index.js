const queries = require("./queries.js");

const { DB, MODE } = require('../config.js');

const mysql = require('mysql2');

const mysqlConfig = {
  host     : DB.HOST[MODE],
  user     : DB.USER[MODE],
  password : DB.PASSWORD[MODE],
  database : DB.DATABASE[MODE],
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Create the connection pool. The pool-specific settings are the defaults
const pool = mysql.createPool(mysqlConfig);

module.exports = async (key, params, autoRow = true) => {
  console.log(key, params);
  //console.log(params);
  return new Promise(function(resolve, reject) {
    pool.getConnection(function(err, conn) {
      if (!err) {
        // Do something with the connection
        conn.query(queries[key], params, function(err2, rows, fields) {
          pool.releaseConnection(conn);
          if(!err2) {
            if(rows.length < 1) {
              resolve(false);
            }
            else if (rows.length == 1 && autoRow){
              resolve(rows[0]);
            }
            else {
              resolve(rows);
            }
          }
          else {
            Log.info("DB", err2);
            Log.error("DB", `KEY: ${key}, PARAMS: ${params}`)
            resolve(false);
          }
        });
      }
      else {
        Log.warning("DB", "Cant get connection from pool.");
        resolve(false);
      }
    });
  });
}
