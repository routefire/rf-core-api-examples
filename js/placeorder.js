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


function inquire(buy, sell, qty, uid, token) {
  // Setting URL and headers for request
  var headers = {"Authorization": ("Bearer " + token)}
  // The algorithm parameters are documented at: https://routefire.io/algo-docs
  var data = {
    "uid": uid, 
    "buy_asset": buy, 
    "sell_asset": sell, 
    "qty": qty,  // must be a string
  };
  var options = {
      url: 'https://routefire.io/api/v1/data/inquire',
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
              resolve(res);
          }
      })
  })
}

function getOrderBook(buy, sell, uid, token) {
  // Setting URL and headers for request
  var headers = {"Authorization": ("Bearer " + token)}
  // The algorithm parameters are documented at: https://routefire.io/algo-docs
  var data = {
    "uid": uid, 
    "buy_asset": buy, 
    "sell_asset": sell, 
    "qty": "0.0", 
  };
  var options = {
      url: 'https://routefire.io/api/v1/data/consolidated',
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
              resolve(res);
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

// To go short, the changes required are extra algo params:
//   1. `exchanges_specified`: allowed exchanges, comma-delimited (currently only `BITFINEX` and `KRAKEN` are available)
//   2. `borrow_instruction`: type of borrows to perform, comma-delimited (currently only `margin` is available) 
//   3. `order_type`: `short` or `cover` for short positions; levered long support TBD. 
function postShort(crypto, fiat, qty, uid, token) {
   let buy = crypto;
   let sell = fiat;
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
    "algo_params": {"iwould":"", "target_seconds": "300", "backfill": "1.0", "max_participation": "1.0", "aggression": "0.0", "exchanges_specified": "BITFINEX,KRAKEN", "borrow_instruction": "margin", "order_type": "short"}
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
    if((!uid) || (!pwd)) {
      console.log("Usage: nodejs report.js <uid> <password> <quantity>\nWill buy <quantity> BTC using a TWAP algorithm for execution.");
      return;
    }

    var token = await authenticate(uid, pwd);
    if((!qty)) {
      console.log("No quantity, just inquiring...");
      var rig = await getOrderBook("btc","usd",uid,token);
      console.log(JSON.stringify(rig));
      var rig2 = await inquire("btc","usd","0.5",uid,token);
      console.log(JSON.stringify(rig2));
      return;
    }

    var orderId = undefined;

    if(qty < 0) {
      qty = -1 * parseFloat(JSON.stringify(qty));
      orderId = await postShort("btc","usd",qty, uid, token)
    } else {
      orderId = await postOrder("btc","usd",qty, uid, token)
    }

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

