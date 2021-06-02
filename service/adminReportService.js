const adminReport = require("../model/adminReport");

// JS NUMBER FORMATTER
const { JS_NumberFormat } = require("js-number-formatter");
const numberFormatOptions = { op_AllowDecimal: false, op_DelimiterChar: "." };

exports.getMainDashboard = (req, res) => {
  adminReport
    .getMainDashboard()
    .then((result) => {
      res.json(result);
    })
    .catch((err) => console.log(err));
};

exports.getTransactionsList = (req, res) => {
  adminReport
    .getTransactionsList()
    .then((result) => {
      res.json(result);
    })
    .catch((err) => console.log(err));
};

exports.getTransactionsListDateASC = (req, res) => {
  adminReport
    .getTransactionsListDateASC()
    .then((result) => {
      res.json(result);
    })
    .catch((err) => console.log(err));
};

exports.getTransactionsListDateDESC = (req, res) => {
  adminReport
    .getTransactionsListDateDESC()
    .then((result) => {
      res.json(result);
    })
    .catch((err) => console.log(err));
};

exports.getSalesReport = async (req, res) => {
  let topSales;
  let totalSales = 0;
  let totalRevenue = 0;
  let totalCost = 0;

  await adminReport
    .getTopSales()
    .then((result) => {
      topSales = result;
      console.log("dari adminreport ", topSales);
    })
    .catch((err) => console.log(err));

  await adminReport
    .getTotalSales()
    .then((result) => {
      totalSales = result[0].total_sales;
      console.log("gettotalsales : ", result[0].total_sales);
    })
    .catch((err) => console.log(err));

  await adminReport
    .getTotalRevenue()
    .then((result) => {
      totalRevenue = result[0].total_revenue;
    })
    .catch((err) => console.log(err));

  await adminReport
    .getTotalCost()
    .then((result) => {
      totalCost = result[0].total_cost;
    })
    .catch((err) => console.log(err));

  let totalProfit = JS_NumberFormat(
    totalRevenue - totalCost,
    numberFormatOptions
  );

  totalRevenue = JS_NumberFormat(totalRevenue, numberFormatOptions);
  totalCost = JS_NumberFormat(totalCost, numberFormatOptions);

  console.log(
    "dari report sales numbers : ",
    topSales,
    totalSales,
    totalRevenue,
    totalCost,
    totalProfit
  );

  res.json({
    topSales: topSales,
    totalSales: totalSales,
    totalRevenue: totalRevenue,
    totalCost: totalCost,
    totalProfit: totalProfit,
  });
};
