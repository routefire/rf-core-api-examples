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

To submit an order and watch it until completion using the API, one could buy 0.01 BTC using the TWAP execution algorithm via:

```bash
node placeorder.js "me@mydomain.com" "myPa$$w0rd" "0.01"
```

This particular example watches the order until its completion, printing the latest status to the screen every 5 seconds.

## Dependencies

### Node

To run the Node examples, you'll need to [download and install](https://nodejs.org/en/) the latest version of Node.js/NPM. Then, follow the usage instructions above (the only dependency will be automatically pulled down by running `npm install` in the `js` directory).
