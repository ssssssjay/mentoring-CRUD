const mysql = require("mysql");
const sql = require("./sql");

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  connectionLimit: process.env.DB_CONNECTION_LIMIT,
});

//  쿼리문을 실행하고 결과를 반환하는 함수
const query = async (alias, values) => {
  return new Promise((resolve, reject) =>
    pool.query(sql[alias], values, (err, results) => {
      if (err) {
        console.log("err :", err);
        reject({ err });
      } else {
        resolve(results);
      }
    })
  );
};

const getConnection = async () => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        console.log("err :", err);
        reject({ err });
      } else {
        resolve(connection);
      }
    });
  });
};

module.exports = {
  query,
  getConnection,
};
