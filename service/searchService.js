const products = require("../model/products");
const adminCrud = require("../model/adminCrud");
const url = require("url");
const querystring = require("querystring");

exports.searchProducts = (req, res) => {
  let s = req.query.s;
  console.log("req params search products : ", req.query.s);
  products
    .searchProducts(req.query.s)
    .then((result) => {
      res.json(result);
    })
    .catch((err) => console.log(err));
};

exports.searchProductTable = (req, res) => {
  let s = req.query.s;
  console.log("req params search products : ", req.query.s);
  products
    .searchProductTable(req.query.s)
    .then((result) => {
      res.json(result);
    })
    .catch((err) => console.log(err));
};

exports.searchRequestTable = (req, res) => {
  let s = req.query.s;
  console.log("req params search Requests : ", req.query.s);
  adminCrud
    .searchRequestTable(req.query.s)
    .then((result) => {
      res.json(result);
    })
    .catch((err) => console.log(err));
};
