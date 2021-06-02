const pool = require("../config/db.js");

//UNTUK NGECEK DISTANCE GEOLIB
const geolib = require("geolib");

// THOUSAND SEPARATOR
const { JS_NumberFormat } = require("js-number-formatter");
const numberFormatOptions = {
  op_AllowDecimal: false,
  op_DecimalDelimiterChar: ",",
  op_DelimiterChar: ".",
};

// untuk halaman Cart. Supaya keliatan semua daftar barang di Cart
exports.getClosestWarehouse = (invoice_id) => {
  return new Promise(function (resolve, reject) {
    let warehouseList = [];
    var warehouses = `
                SELECT Name, Latitude, Longitude FROM location
                ORDER BY case when Name = 'kelapa gading' then 1
                when Name = 'kemayoran ' then 2
                when Name = 'palmerah ' then 3
                when Name = 'cakung ' then 4
                when Name = 'pasar minggu' then 5
                else 6
                end asc
                limit 5
    `;

    var customer = `
    SELECT Name, Latitude, Longitude from location WHERE Postal LIKE CONCAT('%' , (SELECT postal_code from invoice_head WHERE id = ${invoice_id} )  ,'%')
   `;

    //  SELECT Name from location WHERE Postal LIKE '%' || (SELECT postal_code from invoice_head WHERE user_id = 22 )  || '%'

    pool.query(warehouses, (err, result) => {
      for (let i = 0; i < 5; i++) {
        warehouseList.push(result[i]);
      }

      pool.query(customer, (err, result) => {
        let warehouseArray = [
          {
            latitude: warehouseList[0].Latitude,
            longitude: warehouseList[0].Longitude,
          },
          {
            latitude: warehouseList[1].Latitude,
            longitude: warehouseList[1].Longitude,
          },
          {
            latitude: warehouseList[2].Latitude,
            longitude: warehouseList[2].Longitude,
          },
          {
            latitude: warehouseList[3].Latitude,
            longitude: warehouseList[3].Longitude,
          },
          {
            latitude: warehouseList[4].Latitude,
            longitude: warehouseList[4].Longitude,
          },
        ];

        let findNearest = geolib.findNearest(
          {
            latitude: result[0].Latitude,
            longitude: result[0].Longitude,
          },
          warehouseArray
        );

        let message = "";
        let index1 = warehouseArray.indexOf(findNearest);
        const terdekat1 = () => {
          if (index1 == 0) {
            message = "Kelapa Gading, Jakarta Utara";
          } else if (index1 == 1) {
            message = "Kemayoran, Jakarta Pusat";
          } else if (index1 == 2) {
            message = "Palmerah, Jakarta Barat";
          } else if (index1 == 3) {
            message = "Cakung, Jakarta Timur";
          } else if (index1 == 4) {
            message = "Pasar Minggu, Jakarta Selatan";
          }
        };
        terdekat1();
        warehouseArray.splice(index1, 1);

        console.log("dari model distance : ", result);
        if (err) reject(err);
        resolve(message);
      });
    });
  });
};

exports.updateCustomerNearestWarehouse = (warehouseID, address) => {
  return new Promise(function (resolve, reject) {
    var sql = `
            UPDATE invoice_head
            SET warehouse_id=${warehouseID}
            WHERE address= "${address}"
          `;
    pool.query(sql, (err, result) => {
      if (err) reject(err);

      resolve(result);
    });
  });
};

// untuk melihat warehouse terdekat dari masing2 warehouse
exports.warehouseToWarehouse = (invoice_id) => {
  return new Promise(function (resolve, reject) {
    let warehouseList = [];
    var warehouses = `
                SELECT Name, Latitude, Longitude FROM location 
                ORDER BY case when Name = 'kelapa gading' then 1
                when Name = 'kemayoran ' then 2
                when Name = 'palmerah ' then 3
                when Name = 'cakung ' then 4
                when Name = 'pasar minggu' then 5
                else 6
                end asc
                limit 5
    `;

    pool.query(warehouses, (err, result) => {
      for (let i = 0; i < 5; i++) {
        warehouseList.push(result[i]);
      }
      let findNearest = geolib.findNearest(
        {
          latitude: result[4].Latitude,
          longitude: result[4].Longitude,
        },
        [
          {
            latitude: result[0].Latitude,
            longitude: result[0].Longitude,
          },
          {
            latitude: result[1].Latitude,
            longitude: result[1].Longitude,
          },

          {
            latitude: result[3].Latitude,
            longitude: result[3].Longitude,
          },
        ]
      );
      if (err) reject(err);
      resolve(findNearest);
    });
  });
};
