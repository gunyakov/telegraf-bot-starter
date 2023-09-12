import queries from "./queries";

import Log from "../src/log";

import { DB, MODE } from "../config";

import { createPool, RowDataPacket } from "mysql2";

type QueryKeys = typeof queries;

const mysqlConfig = {
  host: DB.HOST[MODE],
  user: DB.USER[MODE],
  password: DB.PASSWORD[MODE],
  database: DB.DATABASE[MODE],
  waitForConnections: true,
  connectionLimit: 20,
  queueLimit: 0,
};

// Create the connection pool. The pool-specific settings are the defaults
const pool = createPool(mysqlConfig);

export default async function (
  key: keyof QueryKeys,
  params: Array<any>,
  onlyFirstRow = false,
  timeout = 3000
) {
  return new Promise(function (resolve, reject) {
    pool.getConnection(function (err, conn) {
      if (!err && conn) {
        //Release connection if more than 3 seconds SQL statement execution
        let timeOutFunc = setTimeout(() => {
          conn.release();
          resolve(false);
          Log.error("DB", `Query: ${queries[key]}, Timeout`);
        }, timeout);
        // Do something with the connection
        conn.query(
          queries[key],
          params,
          function (err2, rows: RowDataPacket[][], fields) {
            //Clear connection timeout wating
            clearTimeout(timeOutFunc);
            //Release connection
            conn.release();
            if (err2 == null) {
              if (rows.length < 1) {
                resolve(false);
              } else if (rows.length == 1 && onlyFirstRow) {
                resolve(rows[0]);
              } else {
                resolve(rows);
              }
            } else {
              Log.info("DB", err2.message);
              Log.error("DB", `Query: ${queries[key]}, PARAMS: ${params}`);
              resolve(false);
            }
          }
        );
      } else {
        Log.warning("DB", "Cant get connection from pool.");
        resolve(false);
      }
    });
  });
}
