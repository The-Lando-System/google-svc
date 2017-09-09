var express = require('express')
var request = require('request')
var pathLib = require('path')

// App Setup =========================

var base = pathLib.resolve(__dirname);
var configFile = require(base + '/config');

var app = express()

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Global Vars =====================

var _placesApiKey = configFile.placesApiKey;

var _placesTextSearchUrl = 'https://maps.googleapis.com/maps/api/place/textsearch/json';

// Routes ===========================

app.get('/google/places/query/:location/:radius/:search_terms', function (req, res) {

  var url = 'https://maps.googleapis.com/maps/api/place/textsearch/json';

  var url = _placesTextSearchUrl + buildRequestParams({
    'location': req.params.location,
    'radius': req.params.radius,
    'key': _placesApiKey,
    'query': req.params.search_terms
  });

  var options = {
      url: url,
      method: 'GET'
  }

  request(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      res.send(JSON.parse(body));
    }
  });

});


app.listen(3002, function () {
  console.log('google-svc app listening on port 3002!');
});

// Helper Functions =========================

var buildRequestParams = function(params) {
  var reqParamStr = '?';
  for (var paramKey in params) {
    reqParamStr += paramKey + '=' + params[paramKey];
    reqParamStr += '&'
  }
  return reqParamStr.slice(0, -1);
};