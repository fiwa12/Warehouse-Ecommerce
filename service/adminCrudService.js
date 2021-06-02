const products = require("../model/products");
const adminCrud = require("../model/adminCrud");

exports.addProducts2 = (req, res) => {
  let sku = req.body.sku;
  let category_id = req.body.category_id;
  let name = req.body.name;
  let price = req.body.price;
  let description = req.body.description;
  let modal = req.body.modal;
  products
    .addProducts2(
      `"${sku}"`,
      category_id,
      `"${name}"`,
      price,
      `"${description}"`,
      modal
    )
    .then((result) => {
      products
        .getLastProductId()
        .then((res) => {
          let id = res[0].LastID;
          let url1 = req.body.imageUrl1;
          let url2 = req.body.imageUrl2;
          let url3 = req.body.imageUrl3;
          products
            .addProductImage(id, url1, url2, url3)
            .then((result) => {
              let stockKelapaGading = req.body.stockKelapaGading;
              let stockKemayoran = req.body.stockKemayoran;
              let stockPalmerah = req.body.stockPalmerah;
              let stockCakung = req.body.stockCakung;
              let stockPasarMinggu = req.body.stockPasarMinggu;
              products
                .addProductStock(
                  id,
                  stockKelapaGading,
                  stockKemayoran,
                  stockPalmerah,
                  stockCakung,
                  stockPasarMinggu
                )
                .then((result) => {})
                .catch((err) => console.log(err));
            })
            .catch((err) => console.log("err get product id", err));
        })
        .catch((err) => console.log("error add product image ", err));
      res.json(result);
    })
    .catch((err) => console.log("err add product", err));
};

exports.addProducts = (req, res) => {
  let id = req.body.id;
  let sku = req.body.sku;
  let category_id = req.body.category_id;
  let name = req.body.name;
  let price = req.body.price;
  let description = req.body.description;
  let modal = req.body.modal;
  products
    .addProducts(
      `"${id}"`,
      `"${sku}"`,
      category_id,
      `"${name}"`,
      price,
      `"${description}"`,
      modal
    )
    .then((result) => {
      console.log(result);
      res.json(result);
    })
    .catch((err) => console.log(err));
};

exports.addProductStock = (req, res) => {
  let id = req.body.id;
  let stockKelapaGading = req.body.stockKelapaGading;
  let stockKemayoran = req.body.stockKemayoran;
  let stockPalmerah = req.body.stockPalmerah;
  let stockCakung = req.body.stockCakung;
  let stockPasarMinggu = req.body.stockPasarMinggu;
  products
    .addProductStock(
      id,
      stockKelapaGading,
      stockKemayoran,
      stockPalmerah,
      stockCakung,
      stockPasarMinggu
    )
    .then((result) => {
      res.json(result);
    })
    .catch((err) => console.log(err));
};

exports.addProductImage = (req, res) => {
  let id = req.body.id;
  let url1 = req.body.imageUrl1;
  let url2 = req.body.imageUrl2;
  let url3 = req.body.imageUrl3;
  products
    .addProductImage(id, url1, url2, url3)
    .then((result) => {
      res.json(result);
    })
    .catch((err) => console.log(err));
};

exports.getWarehouseData = (req, res) => {
  // console.log("get warehouse data :", res);
  products
    .getWarehouseData()
    .then((result) => {
      res.json(result);
    })
    .catch((err) => console.log(err));
};

exports.productTable = (req, res) => {
  // console.log("get product table : ", res);
  products
    .productTable()
    .then((result) => {
      res.json(result);
    })
    .catch((err) => res.json(err));
};

exports.requestTable = (req, res) => {
  // console.log("get product table : ", res);
  adminCrud
    .requestTable()
    .then((result) => {
      res.json(result);
    })
    .catch((err) => res.json(err));
};

exports.searchRequestTable = (req, res) => {
  console.log("get search request from request table : ", res);
  adminCrud
    .searchRequestTable()
    .then((result) => {
      res.json(result);
    })
    .catch((err) => res.json(err));
};

exports.editProducts = (req, res) => {
  let id = req.params.product_id;
  let sku = req.body.sku;
  let category_id = req.body.category_id;
  let name = req.body.name;
  let price = req.body.price;
  let description = req.body.description;
  let modal = req.body.modal;
  adminCrud
    .editProducts(id, sku, category_id, name, price, description, modal)
    .then((result) => {
      let id = req.params.product_id;
      let url1 = req.body.imageUrl1;
      let url2 = req.body.imageUrl2;
      let url3 = req.body.imageUrl3;
      adminCrud
        .editProductImage(id, url1, url2, url3)
        .then((result) => {
          let id = req.params.product_id;
          let stockKelapaGading = req.body.stockKelapaGading;
          let stockKemayoran = req.body.stockKemayoran;
          let stockPalmerah = req.body.stockPalmerah;
          let stockCakung = req.body.stockCakung;
          let stockPasarMinggu = req.body.stockPasarMinggu;
          adminCrud
            .editProductStock(
              id,
              stockKelapaGading,
              stockKemayoran,
              stockPalmerah,
              stockCakung,
              stockPasarMinggu
            )
            .then((result) => {})
            .catch((err) => console.log(err));
        })
        .catch((err) => console.log("error edit product image ", err));
      res.json(result);
    })
    .catch((err) => console.log("err edit product", err));
};

exports.deleteProduct = (req, res) => {
  let id = req.params.id;
  console.log("req body delete product : ", id);
  adminCrud
    .deleteProduct(id)
    .then((result) => {
      res.json(result);
    })
    .catch((err) => console.log(err));
};

exports.getInitVal = (req, res) => {
  let id = req.params.product_id;
  console.log("req params getInitVal product : ", id);
  adminCrud
    .getInitVal(id)
    .then((result) => {
      res.json(result);
    })
    .catch((err) => console.log(err));
};
