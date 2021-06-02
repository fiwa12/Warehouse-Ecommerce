const cart = require("../model/cart");
const products = require("../model/products");
const users = require("../model/users");
const invoice = require("../model/invoice");
const distance = require("../model/distance");

var dateFormat = require("dateformat");
const { JS_NumberFormat } = require("js-number-formatter");

const uniqid = require("uniqid");

// ARYA

// NIJIKO
exports.getCartLists = (req, res) => {
  console.log("req params cartlist: ", req.params);
  cart
    .getCartLists(req.params.user_id)
    .then((result) => {
      let cartList = result;

      cart
        .getCartListsWarehouseStock(req.params.user_id)
        .then((result) => {
          for (let i = 0; i < cartList.length; i++) {
            cartList[i].sum_stock = result[i].sum_stock;
          }
          cart
            .getCartListsReservedStock(req.params.user_id)
            .then((result) => {
              for (let i = 0; i < cartList.length; i++) {
                cartList[i].reserved_stock = result[i].qty;
              }
              res.json(cartList);
            })
            .catch((err) => console.log(err));
        })
        .catch((err) => console.log(err));

      cart
        .getCartListsReservedStock(req.params.user_id)
        .then((result) => {
          for (let i = 0; i < cartList.length; i++) {
            cartList[i].reserved_stock = result[i].qty;
          }
          res.json(cartList);
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
};

exports.getCartSubtotal = (req, res) => {
  console.log("req params cartlist: ", req.params);
  cart
    .getCartSubtotal(req.params.user_id)
    .then((result) => {
      res.json(result);
    })
    .catch((err) => console.log(err));
};

exports.getCountCart = (req, res) => {
  // console.log("req params COUNT CART: ", req.params);
  cart
    .getCountCart(req.params.user_id)
    .then((result) => {
      res.json(result);
    })
    .catch((err) => console.log(err));
};

exports.modifyCartItem = (req, res) => {
  console.log("req params cartlist: ", req.params);
  console.log("req query cartlist: ", req.query);

  if (req.query.type == "add") {
    cart
      .addCartItem(req.params.user_id, req.query.product_id)
      .then((result) => {
        res.json(result);
      });
  } else if (req.query.type == "min") {
    cart
      .minCartItem(req.params.user_id, req.query.product_id)
      .then((result) => {
        res.json(result);
      });
  }
};

exports.deleteCartItem = (req, res) => {
  console.log("req params cartlist: ", req.params);
  console.log("req query cartlist: ", req.query);
  cart
    .deleteCartItem(req.params.user_id, req.query.product_id)
    .then((result) => {
      res.json(result);
    });
};

exports.createInvoiceHead = (req, res) => {
  console.log("req body dari add user address crudeservice: ", req.body);
  console.log("req params cartlist: ", req.params);
  invoice
    .createInvoiceHead(
      req.params.user_id,
      req.body.firstName,
      req.body.lastName,
      req.body.email,
      req.body.address,
      req.body.phone,
      req.body.postal,
      req.body.selectedCity,
      25000,
      parseInt(req.body.grandTotal),
      req.body.testChecked
    )
    .then((result) => {
      invoice.getInvoiceHeadByAddress(req.body.address).then((res) => {
        let invoiceID = res[0].id;
        console.log("get invoice by adres return INVOICE ID: ", res[0].id);
        distance.getClosestWarehouse(invoiceID).then(async (res) => {
          console.log("res dari getclosest warehouse : ", res);
          let warehouseID;
          if ((await res) == "Kelapa Gading, Jakarta Utara") {
            warehouseID = 1;
          } else if ((await res) == "Kemayoran, Jakarta Pusat") {
            warehouseID = 2;
          } else if ((await res) == "Palmerah, Jakarta Barat") {
            warehouseID = 3;
          } else if ((await res) == "Cakung, Jakarta Timur") {
            warehouseID = 4;
          } else if ((await res) == "Pasar Minggu, Jakarta Selatan") {
            warehouseID = 5;
          }
          console.log(
            "isi warehouse ID di closes warehosur: ",
            warehouseID,
            invoiceID
          );

          distance
            .updateCustomerNearestWarehouse(warehouseID, req.body.address)
            .then((res) => {
              console.log("customer's warehouse name updated");
            });
        });
      });
    });

  res.json({
    message: "Address Added/Changed, nearest warehouse updated",
  });
};

exports.getUserDetail = (req, res) => {
  users
    .getUserDetail(req.params.user_id)
    .then((result) => {
      res.json(result);
    })
    .catch((err) => console.log(err));
};

exports.paymentFileUpload = (req, res) => {
  if (req.files === null) {
    return res.status(400).json({ msg: "No File Uploaded" });
  }

  let file = req.files.file;
  let extension = file.name.split(".");
  extension = extension[extension.length - 1];
  let filename = `${uniqid()}.${extension}`;
  console.log("FILE : ", file);
  file.mv(`./assets/images/${filename}`, (err) => {
    if (err) {
      console.log(err);
    }
  });
  res.json({ fileName: filename });
  //   data.image_filename = filename;
};

exports.addWallet = (req, res) => {
  console.log("params from ADD WALLET: ", req.params);
  console.log("body from ADD WALLET: ", req.body);
  res.send("yey");
  users
    .addWallet(req.params.user_id, req.body.amount)
    .then((result) => {
      res.json({ message: "wallet amount added" });
    })
    .catch((err) => console.log(err));
};

// SAFIRA
exports.getProducts = (req, res) => {
  products.getProducts().then((result) => {
    console.log("dari getproducts: ", result);
    res.json(result);
  });
};

exports.getProductsByCategory = (req, res) => {
  console.log("req: ", req.params.category_id);
  products
    .getProductsByCategory(req.params.category_id)
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      res.json({
        err,
      });
      console.log("error crudservice", err);
    });
};

exports.getdbProducts = (req, res) => {
  // let stock;
  console.log("params from getproduct detail: ", req.params.product_id);
  // products
  //   .getProductStock(req.params.product_id)
  //   .then((result) => {
  //     console.log(result);
  //   })
  //   .catch((err) => {
  //     res.json({ err });
  //   });
  products
    .getdbProducts(req.params.product_id)
    .then((result) => {
      res.json({ result });
    })
    .catch((err) => {
      res.json({
        err,
      });
    });
};

exports.getProductImage = (req, res) => {
  console.log(req.body);
  products.getProductImage().then((result) => {
    res
      .json({
        success: true,
        result: result,
      })
      .catch((err) => {
        res.json({
          success: false,
          message: err,
        });
      });
  });
};

exports.getCategories = (req, res) => {
  products
    .getCategories()
    .then((result) => {
      // console.log(result);
      res.json({ result });
    })
    .catch((err) => {
      res.json({ err });
    });
};

exports.getProductsByCategory = (req, res) => {
  console.log(req.params.category);
  console.log(req.query);
  if (req.query.category == 0) {
    if (req.query.sort == "default") {
      products
        .getProductsByCategory()
        .then((result) => {
          res.json({
            success: true,
            result: result,
          });
        })
        .catch((err) => {
          res.json({
            success: false,
            message: err,
          });
        });
    } else if (req.query.sort == "priceLowToHigh") {
      products
        .getProductsLowToHigh()
        .then((result) => {
          res.json({
            success: true,
            result: result,
          });
        })
        .catch((err) => {
          res.json({
            success: false,
            message: err,
          });
        });
    } else if (req.query.sort == "priceHighToLow") {
      products
        .getProductsHighToLow()
        .then((result) => {
          res.json({
            success: true,
            result: result,
          });
        })
        .catch((err) => {
          res.json({
            success: false,
            message: err,
          });
        });
    }
  } else if (req.query.category != 0) {
    if (req.query.sort == "default") {
      products
        .getProductsByCategoryDefault(req.query.category)
        .then((result) => {
          res.json({
            success: true,
            result: result,
          });
        })
        .catch((err) => {
          res.json({
            success: false,
            message: err,
          });
        });
    } else if (req.query.sort == "priceLowToHigh") {
      products
        .getProductsByCategoryLowToHigh(req.query.category)
        .then((result) => {
          res.json({
            success: true,
            result: result,
          });
        })
        .catch((err) => {
          res.json({
            success: false,
            message: err,
          });
        });
    } else if (req.query.sort == "priceHighToLow") {
      products
        .getProductsByCategoryHighToLow(req.query.category)
        .then((result) => {
          res.json({
            success: true,
            result: result,
          });
        })
        .catch((err) => {
          res.json({
            success: false,
            message: err,
          });
        });
    }
  }
};

exports.sortProductsByPrice = (req, res) => {
  console.log(req.params.sort_params);
  if (req.params.sort_params === "priceLowToHigh") {
    products
      .sortProductsByLowestPrice()
      .then((result) => {
        res.json({
          result,
        });
      })
      .catch((err) => {
        res.json({ err });
      });
  }
  if (req.params.sort_params === "priceHighToLow") {
    products
      .sortProductsByHighestPrice()
      .then((result) => {
        res.json({ result });
      })
      .catch((err) => {
        res.json({ err });
      });
  }
};

exports.addToCart = (req, res) => {
  console.log(req.body);
  products
    .addToCart(req.body.product_id, req.body.user_id, req.body.qty)
    .then((result) => {
      res.json({
        result,
      });
    })
    .catch((err) => {
      res.json({ err });
    });
};

exports.getProductById = (req, res) => {
  console.log(req.params);
  products
    .getProductById(req.params.product_id)
    .then((result) => {
      res.json({
        success: true,
        result: result,
      });
    })
    .catch((err) => {
      res.json({
        success: false,
        message: err,
      });
    });
};

exports.getProductStock = (req, res) => {
  console.log("req params product stock: ", req.params);
  let reservedStock; // yang masih nyangkut di invoice details
  let databaseStock; // ini yang totoal semua di warehouse
  products
    .getProductStock(req.params.product_id)
    .then((result) => {
      databaseStock = result[0].stock;
      products
        .getProductStockForUser(req.params.product_id)
        .then((result) => {
          reservedStock = result[0].stock;
          let realTimeStock = databaseStock - reservedStock;
          res.json({
            databaseStock: databaseStock,
            reservedStock: reservedStock,
            realTimeStock: realTimeStock,
          });
        })
        .catch((err) => {
          res.json({
            success: false,
            message: err,
          });
        });
    })
    .catch((err) => {
      res.json({
        success: false,
        message: err,
      });
    });
};
