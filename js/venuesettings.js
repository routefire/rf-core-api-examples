// Usage: `node venuesettings.js <username> <password> <Binance key> <Binance secret>`
var request = require("request");

var urlBase = "https://routefire.io"

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


function configureBinance(uid, token, binanceKey, binanceSec) {
  // Setting URL and headers for request
  var headers = {"Authorization": ("Bearer " + token)}
  // The algorithm parameters are documented at: https://routefire.io/algo-docs
  var data = {
    "user_id": uid, 
    "binance_key": binanceKey, 
    "binance_secret": binanceSec, 
    "binance_maker_fee": "0.001", 
    "binance_taker_fee": "0.001", 
  };
  var options = {
      url: urlBase + '/api/v1/venues/submit',
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


function sleep(ms){
  return new Promise(resolve=>{
      setTimeout(resolve,ms)
  })
}

var main = async () => {
  var uid =  process.argv[2] // your userid 
  var pwd =  process.argv[3] // your password
  var key = process.argv[4] // key 
  var sec = process.argv[5] // secret 

  let token = await authenticate(uid, pwd);


  console.log(`Got auth token: ${token}`);

  configureBinance(uid, token, key, sec).then((res) => {
    console.log(`Success setting Binance key: ${JSON.stringify(res)}`);
  })

  await sleep(5000)
}

main();

