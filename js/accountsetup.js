// Usage: `node accountsetup.js <username> <password> <signup code>`
var request = require("request");

var urlBase = "https://routefire.io"

// This function obtains a JWT token for a givern user given their access credential.
function signupNew(uid, password, signupCode) {
    // Setting URL and headers for request
    var options = {
        url: urlBase + '/api/v1/add-user',
        headers: {
            'User-Agent': 'request'
        },
        body: JSON.stringify({
          uid: uid, 
          signup_code: signupCode, 
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
                //console.log(`Got back: ${JSON.stringify(body)}`)
                res = JSON.parse(body)["error"]
                resolve(res)
            }
        })
    })
}



// Main function
var main = async () => {
  // Grab command-line args
  var uid =  process.argv[2] // your userid 
  var pwd =  process.argv[3] // your password
  var key = process.argv[4] // signup code 

  // Use our singup function to register a new user..
  let token = await signupNew(uid, pwd, key);

  // Empty string is the correct answer!
  console.log(`Got result: ${token}`);

}

main();

