// This example demonstrates the usage of the `venues/submit` endpoint by setting a given user's Binance
// key and secret.
// Usage: `node venuesettings.js <username> <password> <Binance key> <Binance secret>`
var request = require("request");

var urlBase = "https://routefire.io"

// This function obtains a JWT token for a givern user given their access credential.
function authenticate(uid, password) {
    // Setting URL and headers for request
    var options = {
        url: urlBase + '/api/v1/authenticate',
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


// This function calls the venue settings endpoint to establish connectivity with Binance.
function configureBinance(uid, token, binanceKey, binanceSec) {
  // Setting URL and headers for request
  var headers = {"Authorization": ("Bearer " + token)}
  // The keys for all venues follow this convention; see schema documentation for more info.
  var data = {
    "user_id": uid, 
    "binance_key": binanceKey, 
    "binance_secret": binanceSec, 
    "binance_maker_fee": "0.001", // Fees are given in ratio (not percentage) form, and *always* as strings 
    "binance_taker_fee": "0.001", 
  };
  var options = {
      url: urlBase + '/api/v1/venues/submit',
      headers: headers,
      body: JSON.stringify(data)
  };
  // Return new promise 
  return new Promise(function(resolve, reject) {
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

// Utility function
function sleep(ms){
  return new Promise(resolve=>{
      setTimeout(resolve,ms)
  })
}

// Main function
var main = async () => {
  // Grab command-line args
  var uid =  process.argv[2] // your userid 
  var pwd =  process.argv[3] // your password
  var key = process.argv[4] // key 
  var sec = process.argv[5] // secret 

  // Use our auth function to get a JWT token (as a string).
  let token = await authenticate(uid, pwd);
  console.log(`Got auth token: ${token}`);

  // Pass that token into the endpoint with the Binance key and secret.
  configureBinance(uid, token, key, sec).then((res) => {
    console.log(`Success setting Binance key: ${JSON.stringify(res)}`);
  })

  // Allow async jobs to complete.
  await sleep(5000)
}

main();

