select hanya year month dari datetime:
SELECT EXTRACT( YEAR_MONTH FROM `created_time` )
FROM invoice_head

-- untuk dapatkan invoice code
SELECT
id,
CONCAT(prefix,  EXTRACT( YEAR_MONTH FROM `created_time` ), id ) AS invoice_code
FROM invoice_head

-- untuk bikin kolom baru yang isinya concat
1
ALTER TABLE newtest ADD COLUMN combined VARCHAR(100);
2
UPDATE newtest SET combined = CONCAT(prefix, id);
3
CREATE TRIGGER inv_trigger
BEFORE INSERT ON newtest
FOR EACH ROW
SET new.combined = CONCAT(prefix, id);

CREATE TRIGGER invoice_trigger BEFORE INSERT ON newtest FOR EACH ROW
  SET NEW.combined = concat(prefix, id)

SELECT sku, name, price, user_id, quantity
FROM products
INNER JOIN cart ON products.id = cart.product_id WHERE user_id = 22

SELECT id FROM invoice_head WHERE user_id = 22

-- masukkin ke invoice detials:
INSERT INTO invoice_details (invoice_head_id, sku, name, price, quantity, user_id)
SELECT invoice_head.id, products.sku, products.name, products.price, cart.quantity, cart.user_id
FROM products
INNER JOIN cart ON products.id = cart.product_id
INNER JOIN invoice_head ON cart.user_id = invoice_head.user_id
WHERE invoice_head.user_id = 22


-- UNTUK SHOW DASHBOARD ADMIN
SELECT 
(select count(*) FROM products) as total_products,
(select count(*) FROM users)  as total_users,
(select count(*) FROM invoice_head WHERE payment_status = "unpaid")  as waiting_confirmation,
(select count(*) FROM invoice_head WHERE payment_status = "paid" AND shipping_status = "not sent" )  as on_going


-- UNTUK SALES REPORT ADMIN 

-- SHOP : ADD AMOUNT PURCHASED UNTUK PRODUCTS
UPDATE products
SET sold= sold + ${quantity}
WHERE id = ${product_id}


UPDATE
    products
SET
    products.amount_purchase = products.amount_purchase + cart.quantity
FROM
    products p
INNER JOIN
    invoice_details invd
ON 
    p.id = invd.product_id;


INSERT INTO products (amount_purchase)
set products.amount_purchase = products.amount_purchase + cart.quantity
SELECT cart.quantity
FROM cart
WHERE cart.product_id = products.id 
where product_id = ${asdasdasd}


-- add product amount works?
update products, cart
set products.sold = products.sold + cart.quantity
where cart.product_id = products.id && user_id = 22 


-- ambil data name of products yang dibeli dan stok di warehousenya
SELECT invoice_head.*, 
invoice_details.sku, 
invoice_details.name, 
invoice_details.price, 
invoice_details.quantity, 
CONCAT(prefix,  EXTRACT( YEAR_MONTH FROM created_time ), invoice_head.id ) AS invoice_code, 
warehouse.name,
warehouse.location,
products_stock.stock
FROM invoice_head
INNER JOIN invoice_details ON invoice_head.id = invoice_details.invoice_head_id
INNER JOIN products_stock ON invoice_details.product_id = products_stock.product_id
INNER JOIN warehouse ON products_stock.warehouse_id = warehouse.id
WHERE invoice_head.id = 0004




INSERT INTO `products_stock`( `warehouse_id`, `product_id`, `stock`)
VALUES
(1,13,500),
(2,13,500),
(3,13,500),
(4,13,500),
(5,13,500),

(1,14,500),
(2,14,500),
(3,14,500),
(4,14,500),
(5,14,500),

(1,15,500),
(2,15,500),
(3,15,500),
(4,15,500),
(5,15,500),

(1,16,500),
(2,16,500),
(3,16,500),
(4,16,500),
(5,16,500),

(1,17,500),
(2,17,500),
(3,17,500),
(4,17,500),
(5,17,500),

(1,18,500),
(2,18,500),
(3,18,500),
(4,18,500),
(5,18,500),

(1,19,500),
(2,19,500),
(3,19,500),
(4,19,500),
(5,19,500),

(1,20,500),
(2,20,500),
(3,20,500),
(4,20,500),
(5,20,500),

(1,21,500),
(2,21,500),
(3,21,500),
(4,21,500),
(5,21,500),

(1,22,500),
(2,22,500),
(3,22,500),
(4,22,500),
(5,22,500),

(1,23,500),
(2,23,500),
(3,23,500),
(4,23,500),
(5,23,500),

(1,24,500),
(2,24,500),
(3,24,500),
(4,24,500),
(5,24,500)


SELECT stock_request.from_warehouse1, products_stock.*
FROM stock_request
INNER JOIN products ON products.id = stock_request.product_id
INNER JOIN warehouse ON warehouse.location = stock_request.from_warehouse1
INNER JOIN products_stock ON products_stock.warehouse_id = warehouse.id 
WHERE products_stock.product_id = 1
GROUP BY warehouse_id 


-- UNTUK CART, UNTUK CHECK SUB TOTAL ITEM SEBELUM CHECKOUT (JADI TIDAK HITUNG DI FRONTEND) 
SELECT cart.*, products.name, products.price, products.price * cart.quantity as subitem_total from cart
INNER JOIN products on cart.product_id = products.id
WHERE cart.user_id = 1

-- untuk check user stock per item di cart 
SELECT cart.*, sum(products_stock.stock) as sumStock, SUM(invoice_details.quantity) as invstats
FROM cart 
JOIN products ON products.id = cart.product_id
JOIN img_url ON img_url.product_id = products.id
JOIN products_stock ON products_stock.product_id = products.id
LEFT JOIN invoice_details ON invoice_details.product_id = cart.product_id
WHERE cart.user_id = 1 AND invoice_details.status = "reserved"
GROUP BY img_url.product_id


select cart.*, invoice_details.quantity, invoice_details.status, sum(invoice_details.quantity) as qty
from cart 
LEFT JOIN invoice_details ON invoice_details.product_id = cart.product_id
where cart.user_id = 1 
AND invoice_details.status = "reserved" OR invoice_details.status IS NULL
group by cart.product_id

SELECT 
cart.*,
products.*,
img_url.url,
invoice_details.quantity, invoice_details.status, sum(invoice_details.quantity) as qty
FROM cart 
JOIN products ON products.id = cart.product_id
JOIN img_url ON img_url.product_id = products.id
LEFT JOIN invoice_details ON invoice_details.product_id = cart.product_id
WHERE cart.user_id = 1
AND invoice_details.status = "reserved"
OR invoice_details.status IS NULL
GROUP BY cart.product_id


-- sumstock not working
SELECT 
cart.*,
products.*,
img_url.url,
sum(products_stock.stock) as sumStock,
invoice_details.status, COALESCE(sum(invoice_details.quantity),0) as qty
FROM cart 
JOIN products ON products.id = cart.product_id
JOIN img_url ON img_url.product_id = products.id
JOIN products_stock ON products_stock.product_id = products.id
LEFT JOIN invoice_details ON invoice_details.product_id = cart.product_id
WHERE cart.user_id = 1
AND invoice_details.status = "reserved"
OR invoice_details.status IS NULL
GROUP BY cart.product_id

SELECT 
cart.*,
products.*,
img_url.url,
invoice_details.status, COALESCE(sum(invoice_details.quantity),0) as qty
FROM cart 
JOIN products ON products.id = cart.product_id
JOIN img_url ON img_url.product_id = products.id
LEFT JOIN invoice_details ON invoice_details.product_id = cart.product_id
WHERE cart.user_id = 1
AND invoice_details.status = "reserved"
OR invoice_details.status IS NULL
GROUP BY cart.product_id


-- yang lain udah jalan kecuali sum_stokk masih 2x lipat terus bikin qty jadi 3x lipat for some reason
SELECT 
cart.*,
products.name,
products.price,
img_url.url,
sum(products_stock.stock) as sum_stock,
invoice_details.status,
COALESCE(sum(invoice_details.quantity),0) as qty
FROM cart 
JOIN products ON products.id = cart.product_id
JOIN img_url ON img_url.product_id = products.id
LEFT JOIN products_stock ON products_stock.product_id = cart.product_id
LEFT JOIN invoice_details ON invoice_details.product_id = cart.product_id
WHERE cart.user_id = 1
AND invoice_details.status = "reserved"
OR invoice_details.status IS NULL
GROUP BY cart.product_id


-- works, but hanya show stock. BUT WORKS
select cart.*, sum(products_stock.stock) as sum_stock
from cart
left join products_stock on products_stock.product_id = cart.product_id
WHERE cart.user_id = 1
GROUP BY cart.product_id


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
WHERE cart.user_id = 1
GROUP BY cart.product_id

SELECT 
cart.*,
invoice_details.status,
COALESCE(sum(invoice_details.quantity),0) as qty
FROM cart 
LEFT JOIN invoice_details ON invoice_details.product_id = cart.product_id
WHERE cart.user_id = 1
AND invoice_details.status = "reserved"
OR invoice_details.status IS NULL
GROUP BY cart.product_id


-- untuk dapat stock total doang 
SELECT 
sum(products_stock.stock) as sum_stock
FROM cart 
LEFT JOIN products_stock ON products_stock.product_id = cart.product_id
WHERE cart.user_id = 2
GROUP BY cart.product_id