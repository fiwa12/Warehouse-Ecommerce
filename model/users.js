const pool = require("../config/db.js");

exports.getUsers = (user_id) => {
  return new Promise(function (resolve, reject) {
    var sql = "select * from users";
    if (user_id) {
      sql += ` where id = ${user_id}`;
    }
    pool.query(sql, (err, result) => {
      if (err) reject(err);

      resolve(result);
    });
  });
};

exports.getEmail = (email) => {
  return new Promise(function (resolve, reject) {
    var sql = `select id FROM users WHERE email = '${email}'`;
    pool.query(sql, (err, result) => {
      if (err) reject(err);

      resolve(result);
    });
  });
};

exports.insert = (data) => {
  return new Promise(function (resolve, reject) {
    var sql = `insert into users set ?`;
    pool.query(sql, [data], (err, result) => {
      if (err) reject(err);

      resolve(true);
    });
  });
};

exports.patchPassword = (email, password) => {
  return new Promise(function (resolve, reject) {
    var sql = `UPDATE users SET password = "${password}" WHERE email = "${email}"`;
    pool.query(sql, (err, result) => {
      if (err) reject(err);

      resolve(result);
    });
  });
};

exports.getUserDetailByEmail = (email) => {
  return new Promise(function (resolve, reject) {
    var sql = `
            select id, first_name, last_name, email, password, security_answer, status, wallet
            from users
            where email = '${email}'
        `;
    pool.query(sql, (err, result) => {
      if (err) reject(err);

      resolve(result);
    });
  });
};

exports.getUserDetailByEmailAndPassword = (email, password) => {
  return new Promise(function (resolve, reject) {
    var sql = `
            select id, first_name, last_name, email, password, security_answer
            from users
            where email = '${email}' and password = '${password}'
        `;
    pool.query(sql, (err, result) => {
      if (err) reject(err);

      resolve(result);
    });
  });
};

exports.getUserDetailByEmailAndSecurityAnswer = (email, security_answer) => {
  return new Promise(function (resolve, reject) {
    var sql = `
            select id, first_name, last_name, email, password, security_answer
            from users
            where email = '${email}' and security_answer = '${security_answer}'
        `;
    pool.query(sql, (err, result) => {
      if (err) reject(err);

      resolve(result);
    });
  });
};

exports.loginStatus = (email) => {
  return new Promise(function (resolve, reject) {
    var sql = `
            update users set isLoggedin = 1
            where email = "${email}"`;
    pool.query(sql, (err, result) => {
      if (err) reject(err);

      resolve(result);
    });
  });
};

exports.getLoginStatus = (email) => {
  return new Promise(function (resolve, reject) {
    var sql = `
            select isLoggedin, email from users
            where email = "${email}"`;
    pool.query(sql, (err, result) => {
      if (err) reject(err);

      resolve(result);
    });
  });
};

exports.update = (data, user_id) => {
  return new Promise(function (resolve, reject) {
    var sql = `update users set ? where id = ${user_id}`;
    pool.query(sql, [data], (err, result) => {
      if (err) reject(err);

      resolve(true);
    });
  });
};

exports.getUserDetail = (user_id) => {
  return new Promise(function (resolve, reject) {
    var sql = `
            SELECT * FROM users WHERE id = ${user_id}
        `;

    pool.query(sql, (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
};

exports.addWallet = (user_id, amount) => {
  return new Promise(function (resolve, reject) {
    var sql = `
          UPDATE users SET wallet = wallet + ${amount} WHERE id = ${user_id}
        `;
    pool.query(sql, (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
};

exports.deactiveUser = (user_id) => {
  return new Promise(function (resolve, reject) {
    var sql = `
            update users set status = "inactive"
            where id = "${user_id}"`;
    pool.query(sql, (err, result) => {
      if (err) reject(err);

      resolve(result);
    });
  });
};

exports.activeUser = (user_id) => {
  return new Promise(function (resolve, reject) {
    var sql = `
            update users set status = "active"
            where id = "${user_id}"`;
    pool.query(sql, (err, result) => {
      if (err) reject(err);

      resolve(result);
    });
  });
};

exports.searchFirstName = (search) => {
  return new Promise(function (resolve, reject) {
    var sql = `
            SELECT * FROM users
            WHERE first_name LIKE
            "%${search}%"  
          `;
    pool.query(sql, (err, result) => {
      if (err) reject(err);

      resolve(result);
    });
  });
};

exports.searchLastName = (search) => {
  return new Promise(function (resolve, reject) {
    var sql = `
            SELECT * FROM users
            WHERE last_name LIKE
            "%${search}%"  
          `;
    pool.query(sql, (err, result) => {
      if (err) reject(err);

      resolve(result);
    });
  });
};

exports.getActiveUser = () => {
  return new Promise(function (resolve, reject) {
    var sql = `
            SELECT * FROM users WHERE status = "active"
        `;

    pool.query(sql, (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
};

exports.getInactiveUser = () => {
  return new Promise(function (resolve, reject) {
    var sql = `
            SELECT * FROM users WHERE status = "inactive"
        `;

    pool.query(sql, (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
};
