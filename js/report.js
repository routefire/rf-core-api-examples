// Usage: `node index.js <username> <password> [<minimum submit date/time in ISO format>]`
var request = require("request");

function authenticate(uid, password) {
    // Setting URL and headers for request
    var options = {
        url: 'https://routefire.io/api/v1/authenticate',
        headers: {
            'User-Agent': 'request'
        },
        body: JSON.stringify({
          uid: uid, 
          password: password
        })
    };
    // Return new promise 
    return new Promise(function(resolve, reject) {
    	// Do async job
        request.post(options, function(err, resp, body) {
            if (err) {
                reject(err);
            } else {
                res = JSON.parse(body)
                resolve(res['token'])
            }
        })
    })
}

function postOrder(buy, sell, qty, uid, token) {
  // Setting URL and headers for request
  var headers = {"Authorization": ("Bearer " + token)}
  // The algorithm parameters are documented at: https://routefire.io/algo-docs
  var data = {
    "user_id": uid, 
    "buy_asset": buy, 
    "sell_asset": sell, 
    "quantity": qty, 
    "price": "0.0", 
    "algo": "twap", 
    "algo_params": {"iwould":"", "target_seconds": "300", "backfill": "1.0", "max_participation": "1.0", "aggression": "0.0"}
  };
  var options = {
      url: 'https://routefire.io/api/v1/orders/submit',
      headers: headers,
      body: JSON.stringify(data)
  };
  // Return new promise 
  return new Promise(function(resolve, reject) {
    // Do async job
      request.post(options, function(err, resp, body) {
          if (err) {
              reject(err);
          } else {
              res = JSON.parse(body)
              resolve(res['order_id'])
          }
      })
  })
}

function getStatus(oid, uid, token) {
  // Setting URL and headers for request
  var headers = {"Authorization": ("Bearer " + token)}
  var data = {"user_id": uid, "order_id": oid}
  var options = {
      url: 'https://routefire.io/api/v1/orders/status',
      headers: headers,
      body: JSON.stringify(data)
  };
  // Return new promise 
  return new Promise(function(resolve, reject) {
    // Do async job
      request.post(options, function(err, resp, body) {
          if (err) {
              reject(err);
          } else {
              res = JSON.parse(body)
              resolve(res['status'])
          }
      })
  })
}

function getFilled(oid, uid, token) {
  // Setting URL and headers for request
  var headers = {"Authorization": ("Bearer " + token)}
  var data = {"user_id": uid, "order_id": oid}
  var options = {
      url: 'https://routefire.io/api/v1/orders/status',
      headers: headers,
      body: JSON.stringify(data)
  };
  // Return new promise 
  return new Promise(function(resolve, reject) {
    // Do async job
      request.post(options, function(err, resp, body) {
          if (err) {
              reject(err);
          } else {
              res = JSON.parse(body)
              resolve(res['filled'])
          }
      })
  })
}

function getOrderInfo(oid, uid, token) {
  // Setting URL and headers for request
  var headers = {"Authorization": ("Bearer " + token)}
  var data = {
    "user_id": uid, 
    "routefire_order_id": oid
  }
  var options = {
      url: 'https://routefire.io/api/v1/order-report',
      headers: headers,
      body: JSON.stringify(data)
  };
  // Return new promise 
  return new Promise(function(resolve, reject) {
    // Do async job
      request.post(options, function(err, resp, body) {
          if (err) {
              reject(err);
          } else {
              res = JSON.parse(body)
              resolve(res)
          }
      })
  })
}

function getOrderHistory(uid, token) {
  // Setting URL and headers for request
  var headers = {"Authorization": ("Bearer " + token)}
  var data = {
    "uid": uid
  }
  var options = {
      url: 'https://routefire.io/api/v1/all-historical-trades',
      headers: headers,
      body: JSON.stringify(data)
  };
  // Return new promise 
  return new Promise(function(resolve, reject) {
    // Do async job
      request.post(options, function(err, resp, body) {
          if (err) {
              reject(err);
          } else {
              res = JSON.parse(body)
              resolve(res['data'])
          }
      })
  })
}

function sleep(ms){
  return new Promise(resolve=>{
      setTimeout(resolve,ms)
  })
}

var main = async () => {
    var uid = process.argv[2]; // with your userid 
    var pwd = process.argv[3]; // with your password
    if((!uid) || (!pwd)) {
      console.log("Usage: nodejs report.js <uid> <password> [<minimum submit date/time in ISO format>]");
      return;
    }
    var minDtStr = process.argv[4];
    let minDt = undefined; 
    try {
      if((!!process.argv[4]) && process.argv[4].length > 0) {
        minDt = Date.parse(minDtStr);
      }
    } catch(e) {
      console.log("Bad date format\n")
      return
    }

    var token = await authenticate(uid, pwd);
    //var orderId = await postOrder("btc","usd","0.006", uid, token)
    //console.log(`Token: ${token}`);

    var orderHistory = await getOrderHistory(uid, token)
    //console.log(`History: ${JSON.stringify(orderHistory)}`);
    //return;
    var ctr = 0
    for(var k in orderHistory) {
      var rfoid = orderHistory[k].RoutefireOrderId;
      var dtStr = orderHistory[k].SubmissionTime;
      var dt = Date.parse(orderHistory[k].SubmissionTime);
      if((!!minDt) && (minDt > dt)) {
        continue
      }
      //console.log("Order info: " + rfoid);
      var orderInfo = await getOrderInfo(rfoid, uid, token)
      console.log(JSON.stringify(orderInfo));
      ctr += 1
    }

}


main();

