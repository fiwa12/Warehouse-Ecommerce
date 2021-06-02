const pool = require("../config/db.js");

exports.getShippingInfo = (invoice_id) => {
  return new Promise(function (resolve, reject) {
    var sql = `
      SELECT invoice_head.*, 
      invoice_details.sku, 
      invoice_details.name as product_name, 
      invoice_details.price, 
      invoice_details.quantity, 
      CONCAT(prefix,  EXTRACT( YEAR_MONTH FROM created_time ), invoice_head.id ) AS invoice_code, 
      warehouse.name as warehouse_name,
      warehouse.location,
      products_stock.stock,
      products_stock.product_id as product_id
      FROM invoice_head
      INNER JOIN invoice_details ON invoice_head.id = invoice_details.invoice_head_id
      INNER JOIN products_stock ON invoice_details.product_id = products_stock.product_id
      INNER JOIN warehouse ON products_stock.warehouse_id = warehouse.id
      WHERE invoice_head.id = ${invoice_id} 
      ORDER BY invoice_details.name ASC
                `;
    pool.query(sql, (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
};

exports.getShippingInfoGrouped = (invoice_id) => {
  return new Promise(function (resolve, reject) {
    var sql = `
      SELECT invoice_head.*, 
      invoice_details.sku, 
      invoice_details.name as product_name, 
      invoice_details.price, 
      invoice_details.quantity, 
      CONCAT(prefix,  EXTRACT( YEAR_MONTH FROM created_time ), invoice_head.id ) AS invoice_code, 
      warehouse.name as warehouse_name,
      warehouse.location,
      products_stock.stock,
      products_stock.product_id as product_id
      FROM invoice_head
      INNER JOIN invoice_details ON invoice_head.id = invoice_details.invoice_head_id
      INNER JOIN products_stock ON invoice_details.product_id = products_stock.product_id
      INNER JOIN warehouse ON products_stock.warehouse_id = warehouse.id
      WHERE invoice_head.id = ${invoice_id} 
      GROUP BY invoice_details.name 
                `;
    pool.query(sql, (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
};

exports.addStockRequest = (
  invoice_head_id,
  invoice_code,
  location,
  product_id,
  quantity,
  location_from1,
  location_from2
) => {
  return new Promise(function (resolve, reject) {
    var sql = `
    INSERT INTO stock_request (invoice_head_id, invoice_code, product_id, quantity, to_warehouse, from_warehouse1, from_warehouse2  )
    VALUES (${invoice_head_id},"${invoice_code}",${product_id},${quantity},'${location}', '${location_from1}', '${location_from2}')
          `;
    pool.query(sql, (err, result) => {
      if (err) reject(err);

      resolve(result);
    });
  });
};

exports.substractStock = (warehouse_id, product_id, quantity) => {
  return new Promise(function (resolve, reject) {
    var sql = `
          UPDATE products_stock
          SET stock = stock - ${quantity}
          WHERE warehouse_id = ${warehouse_id} AND product_id = ${product_id}
          `;
    pool.query(sql, (err, result) => {
      if (err) reject(err);

      resolve(result);
    });
  });
};

exports.getInvoiceHead = (invoice_id) => {
  return new Promise(function (resolve, reject) {
    var sql = `
            SELECT *,
            CONCAT(prefix,  EXTRACT( YEAR_MONTH FROM created_time ), id ) AS invoice_code
            FROM invoice_head
            WHERE id = ${invoice_id}
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
            SELECT *,
            CONCAT(prefix,  EXTRACT( YEAR_MONTH FROM created_time ), id ) AS invoice_code
            FROM invoice_head
            WHERE id = ${invoice_id}
          `;
    pool.query(sql, (err, result) => {
      if (err) reject(err);

      resolve(result);
    });
  });
};

exports.verifyPurchase = (invoice_id) => {
  return new Promise(function (resolve, reject) {
    var sql = `
    UPDATE invoice_head
    SET verified_status = "verified"
    WHERE id = ${invoice_id}
          `;
    pool.query(sql, (err, result) => {
      if (err) reject(err);

      resolve(result);
    });
  });
};

exports.rejectPurchase = (invoice_id) => {
  return new Promise(function (resolve, reject) {
    var sql = `
    UPDATE invoice_head
    SET verified_status = "rejected"
    WHERE id = ${invoice_id}
          `;
    pool.query(sql, (err, result) => {
      if (err) reject(err);

      resolve(result);
    });
  });
};

exports.cancelInvoiceDetails = (invoice_id) => {
  return new Promise(function (resolve, reject) {
    var sql = `
    UPDATE invoice_details
    SET status = "cancelled"
    WHERE invoice_head_id = ${invoice_id}
          `;
    pool.query(sql, (err, result) => {
      if (err) reject(err);

      resolve(result);
    });
  });
};

exports.changeSentStatus = (invoice_id) => {
  return new Promise(function (resolve, reject) {
    var sql = `
    UPDATE invoice_head
    SET shipping_status = "sent"
    WHERE id = ${invoice_id}
          `;
    pool.query(sql, (err, result) => {
      if (err) reject(err);

      resolve(result);
    });
  });
};
exports.changeSentStatusInvoiceDetails = (invoice_id) => {
  return new Promise(function (resolve, reject) {
    var sql = `
    UPDATE invoice_details
    SET status = "sent"
    WHERE invoice_head_id = ${invoice_id}
          `;
    pool.query(sql, (err, result) => {
      if (err) reject(err);

      resolve(result);
    });
  });
};

exports.searchTransactionInvoiceID = (search) => {
  return new Promise(function (resolve, reject) {
    var sql = `
            SELECT *,
            CONCAT(prefix,  EXTRACT( YEAR_MONTH FROM created_time ), id ) AS invoice_code
            FROM invoice_head
            WHERE invoice_head.verified_status = "verified"
            AND CONCAT(prefix,  EXTRACT( YEAR_MONTH FROM created_time ), id ) LIKE "%${search}%"  
          `;
    pool.query(sql, (err, result) => {
      if (err) reject(err);

      resolve(result);
    });
  });
};

exports.getStockTransfer = () => {
  return new Promise(function (resolve, reject) {
    var sql = `
            SELECT stock_request.*, products.name, products.sku FROM stock_request
            INNER JOIN products ON products.id = stock_request.product_id 
          `;
    pool.query(sql, (err, result) => {
      if (err) reject(err);

      resolve(result);
    });
  });
};

exports.getFromWarehouse1Stock = (product_id) => {
  return new Promise(function (resolve, reject) {
    var sql = `
              SELECT products_stock.stock
              FROM stock_request
              INNER JOIN products ON products.id = stock_request.product_id
              INNER JOIN warehouse ON warehouse.location = stock_request.from_warehouse1
              INNER JOIN products_stock ON products_stock.warehouse_id = warehouse.id 
              WHERE products_stock.product_id = ${product_id}
              GROUP BY warehouse_id 
          `;
    pool.query(sql, (err, result) => {
      if (err) reject(err);

      resolve(result);
    });
  });
};

exports.searchStockTransfer = (search) => {
  return new Promise(function (resolve, reject) {
    var sql = `
            SELECT stock_request.*, products.name, products.sku FROM stock_request
            INNER JOIN products ON products.id = stock_request.product_id 
            WHERE products.name LIKE '%${search}%' OR products.sku LIKE '%${search}%' OR stock_request.to_warehouse LIKE '%${search}%' OR stock_request.from_warehouse1 LIKE '%${search}%'
          `;
    pool.query(sql, (err, result) => {
      if (err) reject(err);

      resolve(result);
    });
  });
};

exports.filterStockTransfer = (from, to) => {
  return new Promise(function (resolve, reject) {
    var sql = `
            SELECT stock_request.*, products.name, products.sku FROM stock_request
            INNER JOIN products ON products.id = stock_request.product_id 
            WHERE stock_request.from_warehouse1 LIKE '%${from}%' AND stock_request.to_warehouse LIKE '%${to}%' 
          `;
    pool.query(sql, (err, result) => {
      if (err) reject(err);

      resolve(result);
    });
  });
};

exports.subtractFromWarehouse = (product_id, quantity, from_warehouse_id) => {
  return new Promise(function (resolve, reject) {
    var sql = `
            UPDATE products_stock 
            SET stock = stock - ${quantity}
            WHERE product_id = ${product_id} AND warehouse_id = ${from_warehouse_id}
          `;
    pool.query(sql, (err, result) => {
      if (err) reject(err);

      resolve(result);
    });
  });
};

exports.addToWarehouse = (product_id, quantity, to_warehouse_id) => {
  return new Promise(function (resolve, reject) {
    var sql = `
            UPDATE products_stock 
            SET stock = stock + ${quantity}
            WHERE product_id = ${product_id} AND warehouse_id = ${to_warehouse_id}
          `;
    pool.query(sql, (err, result) => {
      if (err) reject(err);

      resolve(result);
    });
  });
};

exports.patchStockTransferStatus = (id) => {
  return new Promise(function (resolve, reject) {
    var sql = `
            UPDATE stock_request
            SET status = "completed"
            WHERE id = ${id}
          `;
    pool.query(sql, (err, result) => {
      if (err) reject(err);

      resolve(result);
    });
  });
};

exports.changeUserOrderHistoryStatus = (id) => {
  return new Promise(function (resolve, reject) {
    var sql = `
            UPDATE stock_request
            SET status = "completed"
            WHERE id = ${id}
          `;
    pool.query(sql, (err, result) => {
      if (err) reject(err);

      resolve(result);
    });
  });
};
