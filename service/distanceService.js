const distance = require("../model/distance");

exports.getClosestWarehouse = (req, res) => {
  console.log("req params jarak : ", req.params);
  distance.getClosestWarehouse(req.params.invoice_id).then((result) => {
    console.log("dari distance service : ", result);

    res.json({ result });
  });
};

exports.warehouseToWarehouse = (req, res) => {
  console.log("req params jarak : ", req.params);
  distance.warehouseToWarehouse(req.params.invoice_id).then((result) => {
    console.log("dari distance service : ", result);

    res.json({ result: "yey" });
  });
};
