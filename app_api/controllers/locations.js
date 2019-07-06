var mongoose = require('mongoose');
var Loc = mongoose.model('Location');


// Private Helper Methods

const _buildLocationList = (req, res, results, stats) => {
  let locations = [];
  results.forEach((doc) => {
    locations.push({
      distance: doc.dis,
      name: doc.name,
      address: doc.rating,
      facilities: doc.facilities,
      _id: doc._id
    });
  });
  return locaitons;
}

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

// Public Mehtods
const locationsListByDistance = (req, res) => {
  const lng = parseFloat(req.query.lng);
  const lat = parseFloat(req.query.lat);
  const maxDistance = parseFloat(req.query.maxDistance);
  const point = {
    type: "Point",
    coordinates: [lng, lat]
  };
  var geoOptions = {
    spherical: true,
    maxDistance: theEarth.getRadsFromDistance(6370),
    num: 10
  };
  if (!lng || !lat || !maxDistance) {
    res
      .status(404)
      .json({
        message: 'lng, lat and maxDistance query parameters are required'
      });
    return;
  }
  Loc.aggregate([
        {
            $geoNear: {
                near: point,
                maxDistance: 20,
                distanceField: "dist.calculated",
                num: 10,
                spherical: true
            }
        }
    ],
    (err, results, stats) => {
      // _buildLocationList(req, res, results, stats); Using _buildLocaitonsList causes locations to become "undefined".
      let locations = [];
      results.forEach((doc) => {
        locations.push({
          distance: doc.dis,
          name: doc.name,
          address: doc.rating,
          facilities: doc.facilities,
          _id: doc._id
        });
      });
      console.log('Geo Results', results);
      console.log('Geo Stats', stats); // stats undefined
      res
        .status(200)
        .json(locations);
  });
};
/*
const locationsListByDistance = async (req, res) => {
  const lng = parseFloat(req.query.lng);
  const lat = parseFloat(req.query.lat);
  const maxDistance = parseFloat(req.query.maxDistance);
  const point = {
    type: "Point",
    cooridnates: [lng, lat]
  };
  const geoOptions = {
    distanceField: "distance.calculated",
    spherical: true,
    maxDistance: 20000,
    limit: 10
  };
  if (!lng || !lat || !maxDistance) {
    res
      .status(404)
      .json({
        message: 'lng, lat and maxDistance query parameters are required'
      });
    return;
  }
  Loc.geoNear(point, geoOptions, (err, results, stats) => {
    const locaitons = _buildLocationList(req, res, results, stats);
    console.log('Geo Results', results);
    console.log('Geo stats', stats);
    res
      .status(200)
      .json(locaiotns);
  })
};
*/
const locationsCreate = function (req, res) {
  Loc.create({
    name: req.body.name,
    address: req.body.address,
    facilities: req.body.facilities.split(","), 
    coords: [parseFloat(req.body.lng), parseFloat(req.body.lat)],
    openingTimes: [{
      days: req.body.days1,
      opening: req.body.opening1,
      closing: req.body.closing1,
      closed: req.body.closed1,
    }, {
      days: req.body.days2,
      opening: req.body.opening2,
      closing: req.body.closing2,
      closed: req.body.closed2,
    }]
  }, function(err, location) {
    if (err) {
      res
        .status(400)
        .json(err);
      } else {
      res
        .status(201)
        .json(location);
      }
  });
};
const locationsReadOne = function (req, res) {
  if (req.params && req.params.locationid) {
    Loc
      .findById(req.params.locationid)
      .exec(function(err, location) {
        if (!location) {
          res
            .status(404)
            .json({
              "message": "locationid not found"
            });
          return;
        } else if (err) {
          res
            .status(404)
            .json(err);
          return;
        }
        res
          .status(200)
          .json(location);
      });   
  } else {
    res
      .status(404)
      .json({
        "message": "No locationid in request"
      });
  }
};

const locationsUpdateOne = function (req, res) {
  if (!req.params.locationid) {
    return res
      .status(404)
      .json({
        "message": "Not found, locationid is required"
      });
  }
  Loc
    .findById(req.params.locationid)
    .select('-reviews -rating')
    .exec((err, location) => {
      if (!location) {
        return res
          .status(404)
          .json({
            "message": "locationid not found"
          });
      } else if (err) {
        return res
          .status(400)
          .json(err);
      }

      location.name = req.body.name;
      location.address = req.body.address;
      location.facilities = req.body.facilities.split(',');
      location.coords = [
          parseFloat(req.body.lng),
          parseFloat(req.body.lat)
      ];
      location.openingTimes = [{
        days: req.body.days1,
        opening: req.body.opening1,
        closing: req.body.closing1,
        closed: req.body.closed1,
      }, {
        days: req.body.days2,
        opening: req.body.opening2,
        closing: req.body.closing2,
        closed: req.body.closed2,
      }];
      location.save((err, loc) => {
        if (err) {
          res
            .status(404)
            .json(err);
        } else {
          res
            .status(200)
            .json(loc)
        }
      });
    }
  );
};

const locationsDeleteOne = (req, res) => {
  const {locationid} = req.params;
  if (locationid) {
    Loc
      .findByIdAndRemove(locationid)
      .exec((err, locaiton) => {
        if (err) {
          return res
            .status(404)
            .json(err);
        }
        res
          .status(204)
          .json(null);
      }
    );
  } else {
    res
      .status(404)
      .json({
        "message": "No location"
      });
  }
};

module.exports = {
  locationsListByDistance,
  locationsCreate,
  locationsReadOne,
  locationsUpdateOne,
  locationsDeleteOne
};

