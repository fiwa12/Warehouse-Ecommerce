const pool = require("../config/db.js");

exports.getMainDashboard = () => {
  return new Promise(function (resolve, reject) {
    var sql = `
    SELECT 
    (select count(*) FROM products) as total_products,
    (select count(*) FROM users)  as total_users,
    (select count(*) FROM invoice_head WHERE verified_status = "waiting for verification")  as waiting_confirmation,
    (select count(*) FROM invoice_head WHERE payment_status = "paid" AND shipping_status = "not sent" )  as on_going
          `;

    pool.query(sql, (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
};

exports.getTransactionsList = () => {
  return new Promise(function (resolve, reject) {
    var sql = `
    SELECT *,
    CONCAT(prefix,  EXTRACT( YEAR_MONTH FROM created_time ), id ) AS invoice_code
    FROM invoice_head
    WHERE invoice_head.verified_status = "verified"
            `;

    pool.query(sql, (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
};

exports.getTransactionsListDateASC = () => {
  return new Promise(function (resolve, reject) {
    var sql = `
    SELECT *,
    CONCAT(prefix,  EXTRACT( YEAR_MONTH FROM created_time ), id ) AS invoice_code
    FROM invoice_head
    WHERE invoice_head.verified_status = "verified"
    ORDER BY paid_time ASC
            `;

    pool.query(sql, (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
};

exports.getTransactionsListDateDESC = () => {
  return new Promise(function (resolve, reject) {
    var sql = `
    SELECT *,
    CONCAT(prefix,  EXTRACT( YEAR_MONTH FROM created_time ), id ) AS invoice_code
    FROM invoice_head
    WHERE invoice_head.verified_status = "verified"
    ORDER BY paid_time DESC
            `;

    pool.query(sql, (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
};

exports.getTopSales = () => {
  return new Promise(function (resolve, reject) {
    var sql = `
          SELECT name,sold FROM products
          ORDER BY sold DESC limit 3
            `;

    pool.query(sql, (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
};

exports.getTotalSales = () => {
  return new Promise(function (resolve, reject) {
    var sql = `
          SELECT SUM(sold) as total_sales
          FROM products
            `;

    pool.query(sql, (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
};

exports.getTotalRevenue = () => {
  return new Promise(function (resolve, reject) {
    var sql = `
          SELECT SUM(price*sold) as total_revenue
          FROM products
            `;

    pool.query(sql, (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
};

exports.getTotalCost = () => {
  return new Promise(function (resolve, reject) {
    var sql = `
          SELECT SUM(modal*sold) as total_cost
          FROM products
            `;

    pool.query(sql, (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
};
