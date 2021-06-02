const pool = require("../config/db.js");

// untuk halaman Cart. Supaya keliatan semua daftar barang di Cart
// exports.getCartLists = (user_id) => {
//   return new Promise(function (resolve, reject) {
//     var sql = `
//           SELECT *
//           FROM cart
//           JOIN products ON products.id = cart.product_id
//           JOIN img_url ON img_url.product_id = products.id
//           WHERE user_id = ${user_id}
//           GROUP BY img_url.product_id
//         `;
//     pool.query(sql, (err, result) => {
//       if (err) reject(err);

//       resolve(result);
//     });
//   });
// };

exports.getCartLists = (user_id) => {
  return new Promise(function (resolve, reject) {
    var sql = `
        SELECT 
        cart.*,
        products.name,
        products.price,
        img_url.url,
        sum(products_stock.stock) as sum_stock
        FROM cart 
        JOIN products ON products.id = cart.product_id
        JOIN img_url ON img_url.product_id = products.id
        LEFT JOIN products_stock ON products_stock.product_id = cart.product_id
        WHERE cart.user_id = ${user_id}
        GROUP BY cart.product_id
        `;
    pool.query(sql, (err, result) => {
      if (err) reject(err);

      resolve(result);
    });
  });
};

exports.getCartListsWarehouseStock = (user_id) => {
  return new Promise(function (resolve, reject) {
    var sql = `
        SELECT 
        sum(products_stock.stock) as sum_stock
        FROM cart 
        LEFT JOIN products_stock ON products_stock.product_id = cart.product_id
        WHERE cart.user_id = ${user_id}
        GROUP BY cart.product_id
        `;
    pool.query(sql, (err, result) => {
      if (err) reject(err);

      resolve(result);
    });
  });
};

exports.getCartListsReservedStock = (user_id) => {
  return new Promise(function (resolve, reject) {
    var sql = `
    SELECT 
    cart.*,
    invoice_details.status,
    COALESCE(sum(invoice_details.quantity),0) as qty
    FROM cart 
    LEFT JOIN invoice_details ON invoice_details.product_id = cart.product_id
    WHERE cart.user_id = ${user_id}
    AND invoice_details.status = "reserved"
    OR invoice_details.status IS NULL
    GROUP BY cart.product_id
        `;
    pool.query(sql, (err, result) => {
      if (err) reject(err);

      resolve(result);
    });
  });
};

exports.getCartSubtotal = (user_id) => {
  return new Promise(function (resolve, reject) {
    var sql = `
          SELECT SUM(products.price * cart.quantity) as sub_total from cart
          INNER JOIN products on cart.product_id = products.id
          WHERE cart.user_id =  ${user_id}
        `;
    pool.query(sql, (err, result) => {
      if (err) reject(err);

      resolve(result);
    });
  });
};

exports.getWallet = (user_id) => {
  return new Promise(function (resolve, reject) {
    var sql = `
        SELECT wallet
        FROM users
        WHERE id = ${user_id};
        `;
    pool.query(sql, (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
};

exports.getCountCart = (user_id) => {
  return new Promise(function (resolve, reject) {
    var sql = `
        SELECT count(*) as count
        FROM cart
        WHERE user_id = ${user_id};
        `;
    pool.query(sql, (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
};

exports.addNewCartItem = (user_id, product_id) => {
  return new Promise(function (resolve, reject) {
    var sql = `
          INSERT INTO cart (user_id,product_id,quantity)
          VALUES (${user_id},${product_id}, 1)
        `;
    pool.query(sql, (err, result) => {
      if (err) reject(err);

      resolve(result);
    });
  });
};

exports.addCartItem = (user_id, product_id) => {
  return new Promise(function (resolve, reject) {
    var sql = `
          UPDATE cart 
          set quantity = quantity + 1
          WHERE user_id = ${user_id} AND product_id = ${product_id}
        `;
    pool.query(sql, (err, result) => {
      if (err) reject(err);

      resolve(result);
    });
  });
};

exports.minCartItem = (user_id, product_id) => {
  return new Promise(function (resolve, reject) {
    var sql = `
          UPDATE cart SET quantity = CASE
          WHEN quantity > 1 THEN quantity - 1
          ELSE quantity 
          END
          WHERE user_id = ${user_id} AND product_id = ${product_id}
        `;
    pool.query(sql, (err, result) => {
      if (err) reject(err);

      resolve(result);
    });
  });
};

exports.deleteCartItem = (user_id, product_id) => {
  return new Promise(function (resolve, reject) {
    var sql = `
          DELETE from cart
          WHERE user_id = ${user_id} AND product_id = ${product_id}
        `;
    pool.query(sql, (err, result) => {
      if (err) reject(err);

      resolve(result);
    });
  });
};

exports.deleteFromCart = (user_id) => {
  return new Promise(function (resolve, reject) {
    var sql = `
          DELETE FROM cart WHERE user_id = ${user_id}
        `;
    pool.query(sql, (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
};

exports.addWarehouseID = (user_id) => {
  return new Promise(function (resolve, reject) {
    var sql = `
          DELETE FROM cart WHERE user_id = ${user_id}
        `;
    pool.query(sql, (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
};
