const pool = require("../config/db.js");
const url = require("url");
const querystring = require("querystring");

// untuk halaman Cart. Supaya keliatan semua daftar barang di Cart
exports.getProducts = () => {
  return new Promise(function (resolve, reject) {
    var sql = `
          SELECT *
          FROM products
          JOIN img_url ON products.id = img_url.product_id
          GROUP BY img_url.product_id
        `;
    pool.query(sql, (err, result) => {
      if (err) reject(err);

      resolve(result);
    });
  });
};

exports.getLastProductId = () => {
  return new Promise(function (resolve, reject) {
    var sql = `
        SELECT MAX(ID) AS LastID FROM products
        `;
    pool.query(sql, (err, result) => {
      if (err) reject(err);

      resolve(result);
    });
  });
};

exports.getCategories = () => {
  return new Promise(function (resolve, reject) {
    var sql = `
          SELECT name, id
          FROM categories
        `;
    pool.query(sql, (err, result) => {
      if (err) reject(err);

      resolve(result);
    });
  });
};

// exports.getProductsByCategory = (category_id) => {
//   return new Promise(function (resolve, reject) {
//     var sql = `
//       SELECT * FROM products
//       JOIN img_url ON products.id = img_url.product_id
//       WHERE category_id = ${category_id}
//       GROUP BY img_url.product_id
//       `;
//     pool.query(sql, (err, result) => {
//       if (err) reject(err);

//       resolve(result);
//     });
//   });
// };

exports.getProductsByCategory = () => {
  return new Promise(function (resolve, reject) {
    var sql = `
      SELECT * FROM products 
      JOIN img_url ON products.id = img_url.product_id 
      GROUP BY img_url.product_id
      `;
    pool.query(sql, (err, result) => {
      if (err) reject(err);

      resolve(result);
    });
  });
};

exports.getProductsLowToHigh = () => {
  return new Promise(function (resolve, reject) {
    var sql = `
      SELECT * FROM products 
      JOIN img_url ON products.id = img_url.product_id 
      GROUP BY img_url.product_id
      ORDER BY products.price ASC
      `;
    pool.query(sql, (err, result) => {
      if (err) reject(err);

      resolve(result);
    });
  });
};

exports.getProductsByCategoryDefault = (category) => {
  return new Promise(function (resolve, reject) {
    var sql = `
      SELECT * FROM products 
      JOIN img_url ON products.id = img_url.product_id 
      WHERE category_id = ${category}
      GROUP BY img_url.product_id
      `;
    pool.query(sql, (err, result) => {
      if (err) reject(err);

      resolve(result);
    });
  });
};

exports.getProductsHighToLow = () => {
  return new Promise(function (resolve, reject) {
    var sql = `
      SELECT * FROM products 
      JOIN img_url ON products.id = img_url.product_id 
      GROUP BY img_url.product_id
      ORDER BY products.price DESC
      `;
    pool.query(sql, (err, result) => {
      if (err) reject(err);

      resolve(result);
    });
  });
};

exports.getProductsByCategoryLowToHigh = (category) => {
  return new Promise(function (resolve, reject) {
    var sql = `
      SELECT * FROM products 
      JOIN img_url ON products.id = img_url.product_id 
      WHERE category_id = ${category} 
      GROUP BY img_url.product_id
      ORDER BY products.price ASC
      `;
    pool.query(sql, (err, result) => {
      if (err) reject(err);

      resolve(result);
    });
  });
};

exports.getProductsByCategoryHighToLow = (category) => {
  return new Promise(function (resolve, reject) {
    var sql = `
      SELECT * FROM products 
      JOIN img_url ON products.id = img_url.product_id 
      WHERE category_id = ${category} 
      GROUP BY img_url.product_id
      ORDER BY products.price DESC
      `;
    pool.query(sql, (err, result) => {
      if (err) reject(err);

      resolve(result);
    });
  });
};

exports.sortProductsByLowestPrice = () => {
  return new Promise(function (resolve, reject) {
    var sql = `
        SELECT * FROM products 
        JOIN img_url ON products.id = img_url.product_id 
        GROUP BY img_url.product_id
        ORDER BY products.price ASC
        `;
    pool.query(sql, (err, result) => {
      if (err) reject(err);

      resolve(result);
    });
  });
};

exports.addToCart = (product_id, user_id, qty) => {
  return new Promise(function (resolve, reject) {
    var sql = `
          INSERT INTO cart (user_id, product_id, quantity) VALUES (${user_id}, ${product_id}, ${qty}) ON DUPLICATE KEY UPDATE quantity = quantity + ${qty}
        `;
    pool.query(sql, (err, result) => {
      if (err) reject(err);

      resolve(result);
    });
  });
};

exports.sortProductsByHighestPrice = () => {
  return new Promise(function (resolve, reject) {
    var sql = `
        SELECT * FROM products 
        JOIN img_url ON products.id = img_url.product_id 
        GROUP BY img_url.product_id
        ORDER BY products.price DESC
        `;
    pool.query(sql, (err, result) => {
      if (err) reject(err);

      resolve(result);
    });
  });
};

exports.getdbProducts = () => {
  return new Promise(function (resolve, reject) {
    var sql = `
          SELECT *  
          FROM products as p
          INNER JOIN img_url as iu ON iu.product_id=p.id 
        `;
    pool.query(sql, (err, result) => {
      if (err) reject(err);

      resolve(result);
    });
  });
};

exports.getProductImages = (product_id) => {
  return new Promise(function (resolve, reject) {
    var sql = `
          SELECT *  
          FROM products as p
          INNER JOIN img_url as iu ON iu.product_id=p.id 
          WHERE product_id = ${product_id}
        `;
    pool.query(sql, (err, result) => {
      if (err) reject(err);

      resolve(result);
    });
  });
};

exports.setCart = (product_id, user_id, qty) => {
  return new Promise(function (resolve, reject) {
    var sql = `INSERT INTO cart (product_id, user_id, quantity) VALUES (${product_id}, ${user_id}, ${qty})`;
    pool.query(sql, (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
};

exports.getProductStock = (product_id) => {
  return new Promise(function (resolve, reject) {
    var sql = `
        SELECT SUM(stock) as stock FROM products_stock WHERE product_id = "${product_id}"
    `;
    pool.query(sql, (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
};

exports.getProductStockForUser = (product_id) => {
  return new Promise(function (resolve, reject) {
    var sql = `
    SELECT SUM(quantity) as stock FROM invoice_details WHERE product_id = "${product_id}" AND status="reserved"
    `;
    pool.query(sql, (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
};

exports.searchProducts = (s) => {
  return new Promise(function (resolve, reject) {
    var sql = `
      SELECT *
      FROM products
      JOIN img_url ON products.id = img_url.product_id
      WHERE name LIKE '%${s}%'
      GROUP BY img_url.product_id 
    `;
    pool.query(sql, (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
};

exports.searchProductTable = (s) => {
  return new Promise(function (resolve, reject) {
    var sql = `
    SELECT 
    invoice_head.verified_status, 
    invoice_head.warehouse_id as warehouse_from, 
    invoice_details.status, 
    invoice_details.quantity as reserved_stock, 
    CASE WHEN invoice_details.quantity > 0 THEN products_stock.stock - invoice_details.quantity ELSE products_stock.stock END as user_stock,
    products.id, 
    products.sku, 
    products.price, 
    products.name, 
    products_stock.stock as op_stock,
    warehouse.location, 
    warehouse.id as warehouse_id,
    CASE WHEN warehouse.id = invoice_head.warehouse_id AND invoice_details.status = "reserved" THEN invoice_details.quantity ELSE 0 END as requested_stock,
    CASE WHEN warehouse.id = invoice_head.warehouse_id AND invoice_head.verified_status = "verified" THEN invoice_details.quantity ELSE 0 END as in_transit_stock
    FROM products
    		LEFT JOIN invoice_details ON invoice_details.product_id = products.id
        LEFT JOIN products_stock ON products.id = products_stock.product_id
        LEFT JOIN warehouse ON products_stock.warehouse_id = warehouse.id
        LEFT JOIN invoice_head ON invoice_head.id = invoice_details.invoice_head_id
    WHERE products.name LIKE '%${s}%' OR products.sku LIKE '%${s}%' OR warehouse.location LIKE '%${s}%'
    `;
    pool.query(sql, (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
};

exports.addProducts2 = (sku, category_id, name, price, description, modal) => {
  return new Promise(function (resolve, reject) {
    var sql = `
    INSERT INTO products ( sku, category_id, name, price, description, modal)
    VALUES (${sku}, ${category_id}, ${name}, ${price}, ${description}, ${modal})
      `;
    pool.query(sql, (err, result) => {
      if (err) reject(err);

      resolve(result);
    });
  });
};

exports.addProducts = (
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
    INSERT INTO products (id, sku, category_id, name, price, description, modal)
    VALUES (${id}, ${sku}, ${category_id}, ${name}, ${price}, ${description}, ${modal})
      `;
    pool.query(sql, (err, result) => {
      if (err) reject(err);

      resolve(result);
    });
  });
};

exports.addProductStock = (
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
    INSERT INTO products_stock (warehouse_id, product_id, stock)
    VALUES 
    (1, "${id}", "${stockKelapaGading}"),
    (2, "${id}", "${stockKemayoran}"),
    (3, "${id}", "${stockPalmerah}"),
    (4, "${id}", "${stockCakung}"),
    (5, "${id}", "${stockPasarMinggu}")
      `;
    pool.query(sql, (err, result) => {
      if (err) reject(err);

      resolve(result);
    });
  });
};

exports.addProductImage = (id, url1, url2, url3) => {
  return new Promise(function (resolve, reject) {
    console.log(id, " image");
    var sql = `
    INSERT INTO img_url (url, product_id)
    VALUES 
    ("${url1}", "${id}"),
    ("${url2}", "${id}"),
    ("${url3}", "${id}")
      `;
    pool.query(sql, (err, result) => {
      if (err) reject(err);

      resolve(result);
    });
  });
};

exports.getWarehouseData = () => {
  return new Promise(function (resolve, reject) {
    var sql = `
    SELECT * FROM warehouse 
      `;
    pool.query(sql, (err, result) => {
      if (err) reject(err);

      resolve(result);
    });
  });
};

exports.productTable = () => {
  return new Promise(function (resolve, reject) {
    var sql = `
    SELECT 
    invoice_head.verified_status, 
    invoice_head.warehouse_id as warehouse_from, 
    invoice_details.status, 
    invoice_details.quantity as reserved_stock, 
    CASE WHEN invoice_details.quantity > 0 THEN products_stock.stock - invoice_details.quantity ELSE products_stock.stock END as user_stock,
    products.id, 
    products.sku, 
    products.price, 
    products.name, 
    products_stock.stock as op_stock,
    warehouse.location, 
    warehouse.id as warehouse_id,
    CASE WHEN warehouse.id = invoice_head.warehouse_id AND invoice_details.status = "reserved" THEN invoice_details.quantity ELSE 0 END as requested_stock,
    CASE WHEN warehouse.id = invoice_head.warehouse_id AND invoice_head.verified_status = "verified" THEN invoice_details.quantity ELSE 0 END as in_transit_stock
    FROM products
    		LEFT JOIN invoice_details ON invoice_details.product_id = products.id
        LEFT JOIN products_stock ON products.id = products_stock.product_id
        LEFT JOIN warehouse ON products_stock.warehouse_id = warehouse.id
        LEFT JOIN invoice_head ON invoice_head.id = invoice_details.invoice_head_id
      `;
    pool.query(sql, (err, result) => {
      if (err) reject(err);

      resolve(result);
    });
  });
};
