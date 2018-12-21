// Usage: `node placeorder.js <username> <password>`
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
    var uid =  process.argv[2] // your userid 
    var pwd =  process.argv[3] // your password
    var qty = process.argv[4] // quantity to buy
    if((!uid) || (!pwd) || (!qty)) {
      console.log("Usage: nodejs report.js <uid> <password> <quantity>\nWill buy <quantity> BTC using a TWAP algorithm for execution.");
      return;
    }

    var token = await authenticate(uid, pwd);
    var orderId = await postOrder("btc","usd",qty, uid, token)

    var i = 0
    while (true) {
      console.log("Checking ....")
      
      var status = await getStatus(orderId, uid, token)
      var filled = await getFilled(orderId, uid, token)

      console.log(`Round ${i}...`)
      console.log("status ->", status)
      console.log("filled ->", filled)

      if (status == "COMPLETE") {
        console.log("Order completed.")
        break
      }

      await sleep(5000)
      i ++
    }
}

main();

