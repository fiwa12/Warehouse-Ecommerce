const express = require("express");
const router = express.Router();

const authService = require("./service/authUser");
const authAdminService = require("./service/authAdmin");
const crudService = require("./service/crudService");
const distanceService = require("./service/distanceService");
const transactionService = require("./service/transactionService");
const adminReportService = require("./service/adminReportService");
const adminTransactionService = require("./service/adminTransactionService");
const adminCrudService = require("./service/adminCrudService");
const searchService = require("./service/searchService");

const uniqid = require("uniqid");

// AUTH --- ARYA --- User --
router.get("/auth/user/:user_id?", authService.getUsers);
router.post("/auth/user/register", authService.register);
router.post("/auth/user/login", authService.login);
router.get("/auth/token/decode/:token", authService.decodeToken);
router.patch("/auth/user/login", authService.loginStatus);
router.get("/auth/user/login", authService.getLoginStatus);
router.patch("/auth/user/resetpassword", authService.resetpassword);
router.post("/auth/user/change-pass", authService.forgetPassword);
// router.post("/auth/user/keep-login", authService.getLoginStatus);
router.post("/auth/user/email-verification", authService.getLoginStatus);
router.get("/auth/users/search-first-name-id", authService.searchFirstName);
router.get("/auth/users/search-last-name-id", authService.searchLastName);
router.get("/auth/users/active", authService.getActiveUser);
router.get("/auth/users/inactive", authService.getInactiveUser);
router.patch("/users/deactivate/:user_id?", authService.deactiveUser);
router.patch("/users/activate/:user_id?", authService.activeUser);

// ARYA --- Admin --
router.post("/auth/admin/login", authAdminService.login);
// router.get("/users/detail/:user_id?", authAdminService.login);
router.post("/auth/admin/change-pass", authAdminService.forgetPassword);
router.patch("/auth/admin/resetpassword", authAdminService.resetpassword);

// -- SAFIRA -- CLIENT
router.get("/products/all", crudService.getProducts);
router.get("/product/filter", crudService.getProductsByCategory);
router.get("/product/categories", crudService.getCategories);
router.get(
  "/product/categories/:categories_id",
  crudService.getProductsByCategory
);
router.get("/product/sort/:sort_params", crudService.sortProductsByPrice);
router.patch("/product/addtocart/", crudService.addToCart);
router.get("/product", crudService.getProducts);
router.get("/product/:product_id", crudService.getdbProducts);
router.get("/product/stock/:product_id", crudService.getProductStock);
router.get("/search", searchService.searchProducts);

// SAFIRA -- ADMIN
router.patch("/admin/products/add", adminCrudService.addProducts);
router.patch("/admin/products/add2", adminCrudService.addProducts2);
router.patch("/admin/products/edit/:product_id", adminCrudService.editProducts);
router.get("/admin/products/getProductTable", adminCrudService.productTable);
router.get("/admin/warehouse", adminCrudService.getWarehouseData);
router.get("/admin/search", searchService.searchProductTable);
router.get("/admin/requests/all", adminCrudService.requestTable);
router.get("/admin/requests/search", searchService.searchRequestTable);
router.get("/admin/productDetails/:product_id", adminCrudService.getInitVal);
router.delete("/admin/delete/:id", adminCrudService.deleteProduct);

// -- NIJIKO -- Cart --
router.get("/users/:user_id/cart", crudService.getCartLists);
router.get("/users/:user_id/cart/subtotal", crudService.getCartSubtotal);
router.get("/users/cart/count/:user_id", crudService.getCountCart);
router.patch("/users/:user_id/cart", crudService.modifyCartItem);
router.delete("/users/:user_id/cart", crudService.deleteCartItem);
router.get("/users/detail/account/:user_id", crudService.getUserDetail);
router.patch("/users/addwallet/:user_id", crudService.addWallet);

// NIJIKO - invoice, transactions
router.post("/users/verify", crudService.paymentFileUpload);
router.patch("/users/checkout/:user_id", crudService.createInvoiceHead); // masuk ke invoice head
router.get("/users/:user_id/wallet", transactionService.getWallet);
router.get("/users/:user_id/invoicehead", transactionService.getInvoiceHead); // untuk dari direct checkout
router.get(
  "/users/:user_id/invoiceheadbyid",
  transactionService.getInvoiceHeadByInvoiceId
); // untuk kalau misalnya dari order history
router.post("/users/invoice/:user_id", transactionService.createInvoiceDetails);
router.get("/users/orders/:user_id", transactionService.getOrderData);
router.patch("/users/walletpay/:user_id", transactionService.walletPayment); // masuk ke invoice head
router.patch("/users/addPurchaseAmount/", transactionService.addPurchaseAmount);
router.post("/users/notification/:user_id", transactionService.addNotification);
router.get("/users/notification/:user_id", transactionService.getNotification);
router.get(
  "/users/count-notification/:user_id",
  transactionService.countNotification
);
router.patch("/users/notification/:id", transactionService.patchNotification);
router.delete("/users/notification/:id", transactionService.deleteNotification);
router.patch(
  "/users/notification/read-all/:user_id",
  transactionService.markNotificationRead
);
router.get(
  "/users/invoice/detail/:invoice_id",
  transactionService.getInvoiceDetails
);

// -- NIJIKO -- Admin --
router.get("/admin/dashboard", adminReportService.getMainDashboard);
router.get("/admin/report", adminReportService.getSalesReport);
router.get("/admin/transaction", adminReportService.getTransactionsList);
router.get(
  "/admin/transaction/asc",
  adminReportService.getTransactionsListDateASC
);
router.get(
  "/admin/transaction/desc",
  adminReportService.getTransactionsListDateDESC
);
router.get(
  "/admin/transaction/invoice/:invoice_id",
  adminTransactionService.getInvoiceHead
);
router.patch(
  "/admin/transaction/stock/subtract",
  adminTransactionService.substractStock
);
router.post(
  "/admin/transaction/stock/request",
  adminTransactionService.addStockRequest
);
router.get(
  "/admin/transaction/shipping/:invoice_id",
  adminTransactionService.getShippingInfo
);
router.get(
  "/admin/transaction/stock-transfer",
  adminTransactionService.getStockTransfer
);
router.patch(
  "/admin/transaction/stock-transfer/warehouse",
  adminTransactionService.moveStockTransfer
);
router.get(
  "/admin/transaction/shipping/grouped/:invoice_id",
  adminTransactionService.getShippingInfoGrouped
);
router.patch(
  "/admin/transaction/verify-invoice",
  adminTransactionService.verifyRejectPurchase
);
router.get(
  "/admin/transaction/search-transaction-invoice-id",
  adminTransactionService.searchTransactionInvoiceID
);
router.get(
  "/admin/transaction/search-stock-transfer",
  adminTransactionService.searchStockTransfer
);
router.get(
  "/admin/transaction/filter-stock-transfer",
  adminTransactionService.filterStockTransfer
);

// NIJIKO CHECK WAREHOUSE LOCATION
router.get("/jarak/:invoice_id", distanceService.getClosestWarehouse);
router.get("/warehouse/distance", distanceService.warehouseToWarehouse);

module.exports = router;
