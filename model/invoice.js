const pool = require("../config/db.js");

exports.getInvoiceHead = (user_id) => {
  return new Promise(function (resolve, reject) {
    var sql = `
            SELECT *,
            CONCAT(prefix,  EXTRACT( YEAR_MONTH FROM created_time ), id ) AS invoice_code
            FROM invoice_head
            WHERE user_id = ${user_id}
          `;
    pool.query(sql, (err, result) => {
      if (err) reject(err);

      resolve(result);
    });
  });
};
exports.getInvoiceHeadByInvoiceId = (user_id, invoice_head_id) => {
  return new Promise(function (resolve, reject) {
    var sql = `
            SELECT *,
            CONCAT(prefix,  EXTRACT( YEAR_MONTH FROM created_time ), id ) AS invoice_code
            FROM invoice_head
            WHERE user_id = ${user_id} AND id = ${invoice_head_id}
          `;
    pool.query(sql, (err, result) => {
      if (err) reject(err);

      resolve(result);
    });
  });
};

exports.getInvoiceHeadByAddress = (address) => {
  return new Promise(function (resolve, reject) {
    var sql = `
            SELECT *,
            CONCAT(prefix,  EXTRACT( YEAR_MONTH FROM created_time ), id ) AS invoice_code
            FROM invoice_head
            WHERE address = "${address}"
          `;
    pool.query(sql, (err, result) => {
      if (err) reject(err);

      resolve(result);
    });
  });
};

exports.createInvoiceHead = (
  user_id,
  first_name,
  last_name,
  email,
  address,
  phone,
  postal,
  city,
  delivery_price,
  total,
  method
) => {
  return new Promise(function (resolve, reject) {
    var sql = `
    INSERT INTO invoice_head (user_id, first_name, last_name, email, address,phone,  postal_code,city,  delivery_price, grand_total, payment_method)
    VALUES (${user_id},'${first_name}','${last_name}','${email}','${address}','${phone}','${postal}','${city}', ${delivery_price}, ${total}, '${method}' );
            `;
    pool.query(sql, (err, result) => {
      if (err) reject(err);

      resolve(result);
    });
  });
};

exports.createInvoiceDetails = (user_id, invoice_head_id) => {
  return new Promise(function (resolve, reject) {
    var sql = `
            INSERT INTO invoice_details (invoice_head_id, product_id, sku, name, price, quantity, user_id)
            SELECT invoice_head.id,products.id, products.sku, products.name, products.price, cart.quantity, cart.user_id
            FROM products
            INNER JOIN cart ON products.id = cart.product_id
            INNER JOIN invoice_head ON cart.user_id = invoice_head.user_id
            WHERE invoice_head.user_id = ${user_id} && invoice_head.id = ${invoice_head_id}
            `;
    pool.query(sql, (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
};

exports.getOrderData = (user_id) => {
  return new Promise(function (resolve, reject) {
    var sql = `
        SELECT *,
        IF(NOW() > expired_time, true, false) as expired,
        CONCAT(invoice_head.prefix,  EXTRACT( YEAR_MONTH FROM invoice_head.created_time ), invoice_head.id ) AS invoice_code
        FROM invoice_head
        WHERE invoice_head.user_id = ${user_id}

              `;
    pool.query(sql, (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
};
// INNER JOIN invoice_details ON invoice_head.id = invoice_details.invoice_head_id
// GROUP BY invoice_head.id

// hanya untuk history (jadi cuma invoice head aja)
exports.getOrderHistoryData = (user_id) => {
  return new Promise(function (resolve, reject) {
    var sql = `
        SELECT *,
        CONCAT(invoice_head.prefix,  EXTRACT( YEAR_MONTH FROM invoice_head.created_time ), invoice_head.id ) AS invoice_code
        FROM invoice_head
        INNER JOIN invoice_details ON invoice_head.id = invoice_details.invoice_head_id
        WHERE invoice_head.user_id = ${user_id}
        GROUP BY invoice_head.id
              `;
    pool.query(sql, (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
};

exports.walletPayment = (user_id, remain) => {
  return new Promise(function (resolve, reject) {
    var sql = `
          UPDATE users
          SET wallet = ${remain}
          WHERE id = ${user_id}
              `;
    pool.query(sql, (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
};

exports.purchasePaid = (invoice_head_id) => {
  return new Promise(function (resolve, reject) {
    var sql = `
          UPDATE invoice_head
          SET payment_status = "paid", paid_time= CURRENT_TIME()
          WHERE id = ${invoice_head_id}
              `;
    pool.query(sql, (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
};

exports.getInvoiceDetails = (invoice_id) => {
  return new Promise(function (resolve, reject) {
    var sql = `
            SELECT invoice_head.*, invoice_details.sku, invoice_details.name, invoice_details.price, invoice_details.quantity,
            CONCAT(prefix,  EXTRACT( YEAR_MONTH FROM created_time ), invoice_head.id ) AS invoice_code
            FROM invoice_head
            INNER JOIN invoice_details ON invoice_head.id = invoice_details.invoice_head_id
            WHERE invoice_head.id = ${invoice_id}
              `;
    pool.query(sql, (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
};

exports.addPurchaseAmount = (user_id) => {
  return new Promise(function (resolve, reject) {
    var sql = `
          update products, cart
          set products.sold = products.sold + cart.quantity
          where cart.product_id = products.id && user_id = ${user_id} 
              `;
    pool.query(sql, (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
};

exports.addNotification = (user_id) => {
  return new Promise(function (resolve, reject) {
    var sql = `
          INSERT INTO notification
          (user_id, notification_title, notification_text) 
          VALUES 
          (${user_id},"Purchase Successful!","Thank you for your purchase. Please check your order history to view the transaction status.")
              `;
    pool.query(sql, (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
};

exports.getNotification = (user_id) => {
  return new Promise(function (resolve, reject) {
    var sql = `
            SELECT * FROM notification WHERE user_id = ${user_id} 
            ORDER BY id DESC
              `;
    pool.query(sql, (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
};

exports.patchNotification = (id) => {
  return new Promise(function (resolve, reject) {
    var sql = `
            UPDATE notification SET status= "read" WHERE id = ${id} 
              `;
    pool.query(sql, (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
};

exports.markNotificationRead = (user_id) => {
  return new Promise(function (resolve, reject) {
    var sql = `
            UPDATE notification SET status= "read" WHERE user_id = ${user_id}
              `;
    pool.query(sql, (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
};

exports.deleteNotification = (id) => {
  return new Promise(function (resolve, reject) {
    var sql = `
            DELETE FROM notification WHERE id = ${id} 
              `;
    pool.query(sql, (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
};

exports.countNotification = (user_id) => {
  return new Promise(function (resolve, reject) {
    var sql = `
              SELECT COUNT(*) as count FROM notification WHERE user_id = ${user_id} AND status = "unread"
              `;
    pool.query(sql, (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
};
