var mongoose = require('mongoose');
var Loc = mongoose.model('Location');

/* Helper Functions */
var sendJsonResponse = function (res, status, content) {
  res.status(status);
  res.json(content);
}
/*
var theEarth = (function() {
  var earthRadius = 6371; // km, miles is 3959

  var getDistanceFromRads = function(rads) {
    return parseFloat(rads * earthRadius);
  };

  var getRadsFromDistance = function(distance) {
    return parseFloat(distance / earthRadius);
  };

  return{
    getDistanceFromRads : getDistanceFromRads,
    getRadsFromDistance : getRadsFromDistance
  };
})();
*/

// NOTE: Model.geoNear() was removed in Mongoose v5 becuase the MongoDB (v4.0) driver no longer supports it
// https://github.com/mongodb/node-mongodb-native/blob/master/CHANGES_3.0.0.md#geonear-command-helper

module.exports.locationsListByDistance = function (req, res) {
  var lng = parseFloat(req.query.lng);
  var lat = parseFloat(req.query.lat);
  var point = {
    type: "Point",
    cooridnates: [lng, lat]
  };
  var geoOptions = {
    spherical: true,
    maxDistance: theEarth.getRadsFromDistance(20),
    num: 10
  };
  if (!lng || !lat) {
    sendJsonResponse(res, 404, {
      "message": "lng and lat query parameters are required"
    });
    return;
  }
  Loc.geoNear(point, options, function (err, results, stats) {
    var locations = [];
    if (err) {
      sendJsonResponse(res, 404, err);
    } else {
      results.forEach(function(doc) {
        locations.push({
          distance: theEarth.getDistanceFromRads(doc.dis),
          name: doc.obj.name,
          address: doc.obj.address,
          rating: doc.obj.rating,
          facilities: doc.obj.facilities,
          _id: docObj._id
        });
      });
      sendJsonResponse(res, 200, locations);
    }
  });
};

module.exports.locationsCreate = function (req, res) {};
module.exports.locationsReadOne = function (req, res) {
  if (req.params && req.params.locationid){
    Loc
    .findById(req.params.locationid)
    .exec(function(err, location) {
      if (!location) {
        sendJsonResponse (res, 404, {
          "message": "locationid not found"
        });
        return;
      } else if (err) {
        sendJsonResponse (res, 404, err);
        return;
      }
      sendJsonResponse (res, 200, location);
    });    
  } else {
    sendJsonResponse (res, 404, {
      "message": "No locationid in request"
    });
  }
};
module.exports.locationsUpdateOne = function (req, res) {};
module.exports.locationsDeleteOne = function (req, res) {};

