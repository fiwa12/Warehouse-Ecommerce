const adminReport = require("../model/adminReport");
const adminTransaction = require("../model/adminTransaction");
const invoice = require("../model/invoice");

// JS NUMBER FORMATTER
const { JS_NumberFormat } = require("js-number-formatter");
const numberFormatOptions = { op_AllowDecimal: false, op_DelimiterChar: "." };

exports.getShippingInfo = (req, res) => {
  adminTransaction
    .getShippingInfo(req.params.invoice_id)
    .then((result) => {
      res.json(result);
    })
    .catch((err) => console.log(err));
};

exports.getShippingInfoGrouped = (req, res) => {
  console.log("shipping grouped jalan");
  adminTransaction
    .getShippingInfoGrouped(req.params.invoice_id)
    .then((result) => {
      res.json(result);
    })
    .catch((err) => console.log(err));
};

exports.addStockRequest = (req, res) => {
  console.log("add stock request REQ : ", req.body);
  let invoice_head_id = req.body.invoice_head_id;
  let invoice_code = req.body.invoice_code;
  let location = req.body.location;
  let product_id = req.body.product_id;
  let quantity = req.body.quantity;

  let location_from1;
  let location_from2;

  if (location == "Jakarta Utara") {
    location_from1 = "Jakarta Pusat";
    location_from2 = "Jakarta Timur";
  } else if (location == "Jakarta Pusat") {
    location_from1 = "Jakarta Utara";
    location_from2 = "Jakarta Barat";
  } else if (location == "Jakarta Barat") {
    location_from1 = "Jakarta Pusat";
    location_from2 = "Jakarta Selatan";
  } else if (location == "Jakarta Timur") {
    location_from1 = "Jakarta Utara";
    location_from2 = "Jakarta Pusat";
  } else if (location == "Jakarta Selatan") {
    location_from1 = "Jakarta Barat";
    location_from2 = "Jakarta Pusat";
  }

  // if (location == "Jakarta Utara") {
  //   location = 1;
  //   location_from1 = 2;
  //   location_from2 = 4;
  // } else if (location == "Jakarta Pusat") {
  //   location = 2;
  //   location_from1 = 1;
  //   location_from2 = 3;
  // } else if (location == "Jakarta Barat") {
  //   location = 3;
  //   location_from1 = 2;
  //   location_from2 = 5;
  // } else if (location == "Jakarta Timur") {
  //   location = 4;
  //   location_from1 = 1;
  //   location_from2 = 2;
  // } else if (location == "Jakarta Selatan") {
  //   location = 5;
  //   location_from1 = 3;
  //   location_from2 = 2;
  // }

  console.log(
    "di add stock request parseee ",
    invoice_head_id,
    invoice_code,
    location,
    product_id,
    quantity,
    location_from1,
    location_from2
  );
  adminTransaction
    .addStockRequest(
      invoice_head_id,
      invoice_code,
      location,
      product_id,
      quantity,
      location_from1,
      location_from2
    )
    .then((result) => {
      res.json({ message: "berhasil masuk ke request" });
    })
    .catch((err) => console.log(err));
};

exports.substractStock = (req, res) => {
  console.log("req quesy substract stock : ", req.query);
  adminTransaction
    .substractStock(
      req.query.warehouse_id,
      req.query.product_id,
      req.query.quantity
    )
    .then((result) => {})
    .catch((err) => console.log(err));

  adminTransaction
    .changeSentStatus(req.query.invoice_id)
    .then((result) => {})
    .catch((err) => console.log(err));

  adminTransaction
    .changeSentStatusInvoiceDetails(req.query.invoice_id)
    .then((result) => {})
    .catch((err) => console.log(err));

  // adminTransaction
  //   .changeUserOrderHistoryStatus(req.query.invoice_id)
  //   .then((result) => {})
  //   .catch((err) => console.log(err));

  res.json({ message: "Items Substracted from stock" });
};

exports.getInvoiceHead = (req, res) => {
  console.log("req params invoice details : ", req.params);
  adminTransaction
    .getShippingInfoGrouped(req.params.invoice_id)
    .then((result) => {
      res.json(result);
    })
    .catch((err) => console.log(err));
};

exports.verifyRejectPurchase = (req, res) => {
  console.log("req params invoice details : ", req.query);

  if (req.query.type == "verify") {
    adminTransaction
      .verifyPurchase(req.query.invoice_id)
      .then((result) => {
        console.log(result);
      })
      .catch((err) => console.log(err));
  } else if (req.query.type == "reject") {
    adminTransaction
      .rejectPurchase(req.query.invoice_id)
      .then((result) => {
        console.log(result);
        adminTransaction
          .cancelInvoiceDetails(req.query.invoice_id)
          .then((result) => {
            console.log(result);
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  }

  res.json({ message: "yess" });
};

exports.searchTransactionInvoiceID = (req, res) => {
  console.log("QUERY SEARCH TRANSACTION : ", req.query);
  adminTransaction
    .searchTransactionInvoiceID(req.query.search)
    .then((result) => {
      res.json(result);
    })
    .catch((err) => console.log(err));
};

exports.getStockTransfer = (req, res) => {
  adminTransaction
    .getStockTransfer()
    .then((result) => {
      res.json(result);
    })
    .catch((err) => console.log(err));
};

exports.moveStockTransfer = (req, res) => {
  console.log("MOVE STOCK REQ QUERY : ", req.query);
  let product_id = req.query.product_id;
  let to_warehouse_id = req.query.to_warehouse_id;
  let from_warehouse_id1 = req.query.from_warehouse_id1;
  let from_warehouse_id2 = req.query.from_warehouse_id2;
  let requestQuantity = req.query.quantity;
  let id = req.query.id;

  if (to_warehouse_id == "Jakarta Utara") {
    to_warehouse_id = 1;
  } else if (to_warehouse_id == "Jakarta Pusat") {
    to_warehouse_id = 2;
  } else if (to_warehouse_id == "Jakarta Barat") {
    to_warehouse_id = 3;
  } else if (to_warehouse_id == "Jakarta Timur") {
    to_warehouse_id = 4;
  } else if (to_warehouse_id == "Jakarta Selatan") {
    to_warehouse_id = 5;
  }

  if (from_warehouse_id1 == "Jakarta Utara") {
    from_warehouse_id1 = 1;
  } else if (from_warehouse_id1 == "Jakarta Pusat") {
    from_warehouse_id1 = 2;
  } else if (from_warehouse_id1 == "Jakarta Barat") {
    from_warehouse_id1 = 3;
  } else if (from_warehouse_id1 == "Jakarta Timur") {
    from_warehouse_id1 = 4;
  } else if (from_warehouse_id1 == "Jakarta Selatan") {
    from_warehouse_id1 = 5;
  }

  if (from_warehouse_id2 == "Jakarta Utara") {
    from_warehouse_id2 = 1;
  } else if (from_warehouse_id2 == "Jakarta Pusat") {
    from_warehouse_id2 = 2;
  } else if (from_warehouse_id2 == "Jakarta Barat") {
    from_warehouse_id2 = 3;
  } else if (from_warehouse_id2 == "Jakarta Timur") {
    from_warehouse_id2 = 4;
  } else if (from_warehouse_id2 == "Jakarta Selatan") {
    from_warehouse_id2 = 5;
  }

  console.log("to warehouse : ", to_warehouse_id);
  console.log("from warehouse 1 : ", from_warehouse_id1);
  console.log("from warehouse 2 : ", from_warehouse_id2);

  adminTransaction.getFromWarehouse1Stock(product_id).then((res) => {
    console.log("result getFromWarehouse1Stock : ", res[0].stock);
    let stockFromWarehouse1 = res[0].stock;
    if (stockFromWarehouse1 > requestQuantity) {
      adminTransaction
        .subtractFromWarehouse(product_id, requestQuantity, from_warehouse_id1)
        .then((result) => {
          adminTransaction
            .addToWarehouse(product_id, requestQuantity, to_warehouse_id)
            .then((result) => {
              adminTransaction
                .patchStockTransferStatus(id)
                .then((result) => {
                  console.log(
                    "Restock successful. Stock transfered, status patched."
                  );
                })
                .catch((err) => console.log(err));
            })
            .catch((err) => console.log(err));
        })
        .catch((err) => console.log(err));
    } else {
      let allowedTransferAmount = stockFromWarehouse1;
      let restOfTransferAmount = requestQuantity - stockFromWarehouse1;
      adminTransaction
        .subtractFromWarehouse(
          product_id,
          allowedTransferAmount,
          from_warehouse_id1
        )
        .then((result) => {
          adminTransaction
            .subtractFromWarehouse(
              product_id,
              restOfTransferAmount,
              from_warehouse_id2
            )
            .then((result) => {
              adminTransaction
                .addToWarehouse(product_id, requestQuantity, to_warehouse_id)
                .then((result) => {
                  adminTransaction
                    .patchStockTransferStatus(id)
                    .then((result) => {
                      console.log(
                        "Restock successful. Stock transfered, status patched."
                      );
                    })
                    .catch((err) => console.log(err));
                })
                .catch((err) => console.log(err));
            })
            .catch((err) => console.log(err));
        });
    }
  });

  res.json({
    message: "Restock successful. Stock transfered, status patched.",
  });
};

exports.searchStockTransfer = (req, res) => {
  adminTransaction
    .searchStockTransfer(req.query.search)
    .then((result) => {
      res.json(result);
    })
    .catch((err) => console.log(err));
};

exports.filterStockTransfer = (req, res) => {
  console.log("FILTER TRANSFER STOCK BODY : ", req.query);
  adminTransaction
    .filterStockTransfer(req.query.from, req.query.to)
    .then((result) => {
      res.json(result);
    })
    .catch((err) => console.log(err));
};
