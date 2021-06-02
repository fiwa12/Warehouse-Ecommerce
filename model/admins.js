const pool = require("../config/db.js");

exports.getAdminDetailByEmailAndPassword = (email, password) => {
  return new Promise(function (resolve, reject) {
    var sql = `
              select id, first_name, last_name, email, password
              from admin
              where email = '${email}' and password = '${password}'
          `;
    pool.query(sql, (err, result) => {
      if (err) reject(err);

      resolve(result);
    });
  });
};

exports.deactiveUser = (email) => {
  return new Promise(function (resolve, reject) {
    var sql = `
            update users set status = "inactive"
            where email = "${email}"`;
    pool.query(sql, (err, result) => {
      if (err) reject(err);

      resolve(result);
    });
  });
};

exports.activeUser = (email) => {
  return new Promise(function (resolve, reject) {
    var sql = `
            update users set status = "active"
            where email = "${email}"`;
    pool.query(sql, (err, result) => {
      if (err) reject(err);

      resolve(result);
    });
  });
};

exports.getAdminDetailByEmail = (email) => {
  return new Promise(function (resolve, reject) {
    var sql = `
            select id, first_name, last_name, email, password
            from admin
            where email = '${email}'
        `;
    pool.query(sql, (err, result) => {
      if (err) reject(err);

      resolve(result);
    });
  });
};

exports.patchPassword = (email, password) => {
  return new Promise(function (resolve, reject) {
    var sql = `UPDATE admin SET password = "${password}" WHERE email = "${email}"`;
    pool.query(sql, (err, result) => {
      if (err) reject(err);

      resolve(result);
    });
  });
};
