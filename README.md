# Routefire API: example code and SDKs 

This repository contains examples of using the Routefire REST API for algorithmic execution of cryptocurrency trades, which we're developing into a set of full SDKs supporting all major functionality in both Node.js/TypeScript and Go.

## Usage

### Node

Enter the `js/` subdirectory of this repository and run `npm install` to install dependencies.

To run a full trading activity report, you could do something like:

```nodejs
node report.js "me@mydomain.com" "myPa$$w0rd" "2018-11-01T18:58:46.755Z" > data-out.jsonp 
```
