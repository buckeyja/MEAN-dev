var mongoose = require('mongoose');
var Loc = mongoose.model('Location');

/* Placeholder Functions */
var sendJsonREsponse = function (res, status, content) {
  res.status(status);
  res.json(content);
}

// Public Methods

const reviewsCreate = (req, res) => {
  const locationid = req.params.locationid;
  if ( locationid ) {
    Loc
      .findById(locationid)
      .select('reviews')
      .exec((err, location) => {
        if ( err ) {
          res
            .status(400)
            .json(err);
        } else {
          _doAddReview(req, res, location);
        }
      });
  } else {
    res
      .status(404)
      .json({"message": "Location not found"});
  }
};

const reviewsReadOne = function(req, res) {
  if (req.params && req.params.locationid && req.params.reviewid) {
    Loc
    .findById(req.params.locationid)
    .select('name reviews')
    .exec(
      function(err, location) {
        var response, review;
        if (!location) {
          sendJsonREsponse(res, 404, {
            "message": "location not found"
          });
          return;
        } else if (err) {
          sendJsonREsponse(res, 400, err);
          return;
        }
        if (location.reviews && location.reviews.length > 0) {
          review = location.reviews.id(req.params.reviewid);
          if (!review) {
            sendJsonREsponse(res, 404, {
              "message": "review not found"
            });
          } else {
            response = {
              location : {
                name : location.name,
                id : req.params.locationid
              },
              review : review
            };
            sendJsonREsponse(res, 200, response);
          }  
        } else {
          sendJsonREsponse(res, 404, {
            "message": "No reviews found"
          });
        }
      }
    );
  } else {
    sendJsonREsponse (res, 404, {
      "message": "Not found, locationid and review are both required"
    });
  }
};


const reviewsUpdateOne = function(req, res) {
  if(!req.params.locationid || !req.params.reviewid) {
    res
      .status(404)
      .json({
        "message": "Not found, locationid and reviewid are both required"
      });
    return;
  }
  Loc
    .findById(req.params.locationid)
    .select('reviews')
    .exec((err, location) => {
      if(!location) {
        res
          .status(404)
          .json({
            "message": "locationid not foudn"
          });
        return;
      } else if (err) {
        res
          .status(400)
          .json(err);
        return;
      }
      if (location.reviews && location.reviews.length > 0) {
        const thisReview = location.reviews.id(req.params.reviewid)
        if (!thisReview) {
          return res
            .status(404)
            .json({
              "message": "Loction not found"
            });
        } else {
          thisReview.author = req.body.author;
          thisReview.rating = req.body.rating;
          thisReview.reviewText = req.body.reviewText;
          location.save((err, location) => {
            if (err) {
              res
                .status(404)
                .json(err);
            } else {
              _updateAverageRating(location._id);
              res
                .status(200)
                .json(thisReview)
            }
          });
        }
      } else {
      res
        .status(404)
        .json({
          "message": "No review to update"
        });
      }
    }
  );
};
const reviewsDeleteOne = function(req, res) { };

// Private Helper Methods

const _doSetAverageRating = (location) => {
  if (location.reviews && location.reviews.length > 0) {
    const count = location.reviews.length;
    const total = location.reviews.reduce((acc, {rating}) => { // Uses the JavaScript array reduce method to sum up the ratings of the subdocuments
      return acc + rating;
    }, 0);

    location.rating = parseInt(total / count, 10); // Calculates the avergae rating value and updates the rating value of the parent document
    location.save(err => {
      if (err) {
        console.log(err);
      } else {
        console.log(`Average rating updated to ${location.rating}`); // This only gives one decimal
      }
    });
  }
};

const _updateAverageRating = (locationid) => { // Finds the location based on the provided locationid data
  Loc.findById(locationid)
    .select('rating reviews')
    .exec((err, location) =>{
      if (!err) {
        _doSetAverageRating(location);
      }
    });
};

const _doAddReview = function(req, res, location) {
  location.reviews.push({
     author: req.body.author,
     rating: req.body.rating,
     reviewText: req.body.reviewText
  });
  location.save((err, location) => {
    if (err) {
      res
        .status(400)
        .json(err);
    } else {
      _updateAverageRating(location._id);
      let thisReview = location.reviews.length -1
      res
        .status(201)
        .json(thisReview);
    }
  });
}

module.exports = {
  reviewsCreate,
  reviewsReadOne,
  reviewsUpdateOne,
  reviewsDeleteOne
};