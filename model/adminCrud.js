const pool = require("../config/db.js");
const url = require("url");
const querystring = require("querystring");

exports.requestTable = () => {
  return new Promise(function (resolve, reject) {
    var sql = `
    SELECT invoice_head.id as invoice_id, invoice_head.prefix, invoice_head.created_time, invoice_head.paid_time, invoice_head.payment_status, invoice_head.verified_status, warehouse.name, warehouse.location,
      CONCAT(prefix, EXTRACT( YEAR_MONTH FROM created_time ), invoice_head.id) as invoice_code
      FROM invoice_head
      JOIN warehouse ON warehouse.id = invoice_head.warehouse_id
        `;
    pool.query(sql, (err, result) => {
      if (err) reject(err);

      resolve(result);
    });
  });
};

exports.searchRequestTable = (s) => {
  return new Promise(function (resolve, reject) {
    var sql = `
            SELECT *, 
            CONCAT(prefix, EXTRACT( YEAR_MONTH FROM created_time ), invoice_head.id) as invoice_code
            FROM invoice_head
            JOIN warehouse ON warehouse.id = invoice_head.warehouse_id
            WHERE warehouse.name LIKE '%${s}%' OR warehouse.location LIKE '%${s}%' OR invoice_head.payment_status LIKE '%${s}%' OR CONCAT(prefix, EXTRACT( YEAR_MONTH FROM created_time ), invoice_head.id) LIKE '%${s}%'
            `;
    pool.query(sql, (err, result) => {
      if (err) reject(err);

      resolve(result);
    });
  });
};

exports.editProducts = (
  id,
  sku,
  category_id,
  name,
  price,
  description,
  modal
) => {
  return new Promise(function (resolve, reject) {
    var sql = `
    UPDATE products
    SET sku = "${sku}", category_id = ${category_id}, name = "${name}", price = ${price}, description = "${description}", modal = ${modal}
    WHERE id = ${id}
      `;
    pool.query(sql, (err, result) => {
      if (err) reject(err);

      resolve(result);
    });
  });
};

exports.editProductStock = (
  id,
  stockKelapaGading,
  stockKemayoran,
  stockPalmerah,
  stockCakung,
  stockPasarMinggu
) => {
  return new Promise(function (resolve, reject) {
    console.log(id, "stock");
    var sql = `
    UPDATE products_stock 
    SET stock = CASE  
      WHEN warehouse_id = 1 THEN ${stockKelapaGading}
      WHEN warehouse_id = 2 THEN ${stockKemayoran}
      WHEN warehouse_id = 3 THEN ${stockPalmerah}
      WHEN warehouse_id = 4 THEN ${stockCakung}
      WHEN warehouse_id = 5 THEN ${stockPasarMinggu}
      END
    WHERE product_id = ${id}
      `;
    pool.query(sql, (err, result) => {
      if (err) reject(err);

      resolve(result);
    });
  });
};

exports.editProductImage = (id, url1, url2, url3) => {
  return new Promise(function (resolve, reject) {
    console.log(id, " image");
    var sql = `
    UPDATE img_url 
    SET url = CASE
      WHEN image_num = 1 THEN "${url1}"
      WHEN image_num = 2 THEN "${url2}"
      WHEN image_num = 3 THEN "${url3}"
    END
    WHERE product_id = ${id}
      `;
    pool.query(sql, (err, result) => {
      if (err) reject(err);

      resolve(result);
    });
  });
};

exports.deleteProduct = (id) => {
  return new Promise(function (resolve, reject) {
    console.log(id);
    var sql = `
      DELETE products.*, products_stock.*, img_url.* FROM products
      LEFT JOIN products_stock ON products_stock.product_id = products.id
      LEFT JOIN img_url ON img_url.product_id = products.id
      WHERE products.id = ${id} OR products_stock.product_id = ${id} OR img_url.product_id = ${id}
      `;
    pool.query(sql, (err, result) => {
      if (err) reject(err);

      resolve(result);
    });
  });
};

exports.getInitVal = (id) => {
  return new Promise(function (resolve, reject) {
    console.log(id);
    var sql = `
    SELECT 
    products.id as product_id, 
    products.sku, 
    products.price, 
    products.name,
    products.category_id,
    products.description,
    products.modal,
    products_stock.*,
    img_url.url,
    img_url.image_num
    FROM products
    		LEFT JOIN products_stock ON products_stock.product_id = products.id
        LEFT JOIN img_url ON img_url.product_id = products_stock.product_id
	  WHERE products.id = ${id}
      `;
    pool.query(sql, (err, result) => {
      if (err) reject(err);

      resolve(result);
    });
  });
};
