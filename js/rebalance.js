// Usage: `node rebalance.js <username> <password> <quantity>`
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


/**
 * This example submits a simple rebalance: 
 *  - It only does a single asset portfolio (that asset being ETH).
 *  - It rebalances to `ethQty` ETH.
 * @param {number as string} ethQty 
 * @param {string} uid 
 * @param {string} token 
 */
function postRebal(ethQty, uid, token) {
  // Setting URL and headers for request
  var headers = {"Authorization": ("Bearer " + token)}
  var data = {
  "uid": uid,
  "time_in_force_hr": 1,
  "portfolio_target": [
    {
      "asset": "eth",
      "limit_price": {
        "value": "",
        "currency": "usd"
      },
      "quantity": ethQty
    }
  ]
};
  var options = {
      url: 'https://routefire.io/api/v1/portfolio-rebalance',
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
	      try {
                 let res = JSON.parse(body);
                 resolve(res);
	      } catch(e) {
                 resolve(body);
	      }
          }
      })
  })
}

/**
 * Get rebalance status
 * @param {string} oid rebalance order ID
 * @param {string} uid user ID
 * @param {string} token auth (JWT) token
 * The status response looks like this:
 * Currently working status -> {"state":"selling","filled_percentage":0.4,"Errors":null}
 * Currently not working status -> {"state":"completed","filled_percentage":0,"Errors":null}
 */
function getStatus(oid, uid, token) {
  // Setting URL and headers for request
  var headers = {"Authorization": ("Bearer " + token)}
  var data = {"uid": uid, "oid": oid}
  var options = {
      url: 'https://routefire.io/api/v1/portfolio-rebalance/status',
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
            console.log(`Body: ${body}\n`)
              //let res = JSON.parse(body);
              //resolve(res);
              resolve(body);
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
    var qty = process.argv[4] // quantity to target

    if((!uid) || (!pwd)) {
      console.log("Usage: nodejs rebalane.js <uid> <password> <quantity>\nWill rebalance to <quantity> ETH using rebalance engine.");
      return;
    }

    var token = await authenticate(uid, pwd);
    var resp = await postRebal(qty, uid, token);
    var orderId = resp["order_id"];
    var i = 0;

    while (true) {
      console.log(`Checking order ID ${orderId}....`)
      
      var status = await getStatus(orderId, uid, token)

      console.log(`Round ${i}...`)
      console.log("status ->", status)

      await sleep(10000)
      i ++
    }
}

main();

