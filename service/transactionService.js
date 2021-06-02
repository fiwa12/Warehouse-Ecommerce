const cart = require("../model/cart");
const products = require("../model/products");
const users = require("../model/users");
const invoice = require("../model/invoice");
const distance = require("../model/distance");

var dateFormat = require("dateformat");
const { JS_NumberFormat } = require("js-number-formatter");

const uniqid = require("uniqid");

exports.getWallet = (req, res) => {
  console.log("req params cartlist: ", req.params);
  cart
    .getWallet(req.params.user_id)
    .then((result) => {
      let wallet = JS_NumberFormat(result[0].wallet, {
        op_AllowDecimal: false,
        op_DelimiterChar: ".",
      });
      res.json({ wallet: wallet });
    })
    .catch((err) => console.log(err));
};

// for the last result of the id
exports.getInvoiceHead = (req, res) => {
  console.log("req params inoivcehead: ", req.params);
  console.log("req query invoicehead : ", req.query);
  invoice
    .getInvoiceHead(req.params.user_id)
    .then((result) => {
      // console.log("RESULT FROM GETINVOICEHEAD : ", result);
      let completeDate = result[result.length - 1].expired_time;
      completeDate = completeDate.toString(0);
      let date = dateFormat(completeDate, "default");
      let total = result[result.length - 1].grand_total;
      let invoice_code = result[result.length - 1].invoice_code;
      let invoice_head_id = result[result.length - 1].id;
      res.json([
        {
          expired_time: date,
          grand_total: total,
          invoice_code: invoice_code,
          invoice_head_id: invoice_head_id,
        },
      ]);
    })
    .catch((err) => console.log(err));
};

exports.getInvoiceHeadByInvoiceId = (req, res) => {
  console.log("req params inoivcehead IDDD: ", req.params);
  console.log("req query invoicehead IDDDD: ", req.query);
  invoice
    .getInvoiceHeadByInvoiceId(req.params.user_id, req.query.invoice_head_id)
    .then((result) => {
      res.json(result);
    })
    .catch((err) => console.log(err));
};

exports.createInvoiceDetails = (req, res) => {
  let warehouse_idNew;

  invoice
    .createInvoiceDetails(req.params.user_id, req.query.invoice_head_id)
    .then((result) => {
      invoice
        .addPurchaseAmount(req.params.user_id)
        .then((result) => {
          cart
            .deleteFromCart(req.params.user_id)
            .then((result) => {
              console.log("result deleteFromCart: ", res);
            })
            .catch((err) => console.log(err));
        })
        .catch((err) => console.log(err));

      console.log("result creatInvoiceDetails: ", res);
    })
    .catch((err) => console.log(err));

  invoice
    .purchasePaid(req.query.invoice_head_id)
    .then((result) => {
      console.log("is paid");
    })
    .catch((err) => {
      console.log(err);
    });

  res.json({ message: "invoice details generated, cart has been deleted" });
};

exports.getOrderData = (req, res) => {
  invoice
    .getOrderData(req.params.user_id)
    .then((result) => {
      // console.log("orderdata result : ", result);
      res.json(result);
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.walletPayment = (req, res) => {
  console.log("params from gerproduct detail: ", req.params); // return user id
  console.log("ini req body untuk wallet", req.body); // return wallet credit andn total payment
  let wallet = req.body.walletCredit;
  let total = req.body.paymentTotal;
  let remain = wallet - total;

  invoice
    .walletPayment(req.params.user_id, remain)
    .then((result) => {
      console.log(result);
    })
    .catch((err) => {
      console.log(err);
    });

  invoice
    .purchasePaid(req.query.invoice_head_id)
    .then((result) => {
      console.log("is paid");
    })
    .catch((err) => {
      console.log(err);
    });

  invoice
    .createInvoiceDetails(req.params.user_id, req.query.invoice_head_id)
    .then((result) => {
      invoice
        .addPurchaseAmount(req.params.user_id)
        .then((result) => {
          cart
            .deleteFromCart(req.params.user_id)
            .then((result) => {
              console.log("result deleteFromCart: ", res);
            })
            .catch((err) => console.log(err));
        })
        .catch((err) => console.log(err));
      console.log("result creatInvoiceDetails: ", res);
    })
    .catch((err) => console.log(err));

  console.log("REMAIN : ", remain);
  res.json({ remain: remain });
};

exports.getInvoiceDetails = (req, res) => {
  console.log("params from gerproduct detail: ", req.params);
  invoice
    .getInvoiceDetails(req.params.invoice_id)
    .then((result) => {
      console.log("oget invoice details result : ", result);
      res.json(result);
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.addPurchaseAmount = (req, res) => {
  console.log("req query for add purchase ammount ", req.query);

  invoice
    .addPurchaseAmount(req.query.product_id, req.query.quantity)
    .then((result) => {
      console.log("oget invoice details result : ", result);
      res.json({ message: "submitted" });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.addNotification = (req, res) => {
  invoice
    .addNotification(req.params.user_id)
    .then((result) => {
      res.json({ message: "notification submitted" });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getNotification = (req, res) => {
  invoice
    .getNotification(req.params.user_id)
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.patchNotification = (req, res) => {
  invoice
    .patchNotification(req.params.id)
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.markNotificationRead = (req, res) => {
  invoice
    .markNotificationRead(req.params.user_id)
    .then((result) => {
      res.json({ message: "all notifications read" });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.deleteNotification = (req, res) => {
  invoice
    .deleteNotification(req.params.id)
    .then((result) => {
      res.json({ message: "Notification Deleted" });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.countNotification = (req, res) => {
  invoice
    .countNotification(req.params.user_id)
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      console.log(err);
    });
};
