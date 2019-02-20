# Routefire API: example code and SDKs 

This repository contains examples of using the Routefire REST API for algorithmic execution of cryptocurrency trades, which we're developing into a set of full SDKs supporting all major functionality in both Node.js/TypeScript and Go.

## Usage

### Node

Enter the `js/` subdirectory of this repository and run `npm install` to install dependencies.

#### Reporting

To run a full trading activity report, you would execute a command such as:

```bash
node report.js "me@mydomain.com" "myPa$$w0rd" "2018-11-01T00:00:00.000Z" > november-snapshot.jsonp 
```

#### Order entry and status

To submit an order and watch it until completion using the API, one could buy 0.02 BTC using the TWAP execution algorithm via:

```bash
node placeorder.js "me@mydomain.com" "myPa$$w0rd" "0.02"
```

#### Shorting example

To place a margin short and watch it until completion using the API, one could buy 0.02 BTC using the TWAP execution algorithm via:

```bash
node placeorder.js "me@mydomain.com" "myPa$$w0rd" "-0.02"
```

This particular example watches the order until its completion, printing the latest status to the screen every 5 seconds.

#### Market inquiries and order book data 

The `placeorder.js` example will obtain full depth-of-book data as well as a top-of-book inquiry for 0.5 BTC if you omit the quantity:

```bash
node placeorder.js "me@mydomain.com" "myPa$$w0rd"
```

This is primarily an example of how to use the functions `getOrderBook` and `inquire` contained in the file `placeorder.js`, which demonstrate how to pull market data from Routefire.

## Dependencies

### Node

To run the Node examples, you'll need to [download and install](https://nodejs.org/en/) the latest version of Node.js/NPM. Then, follow the usage instructions above (the only dependency will be automatically pulled down by running `npm install` in the `js` directory).
