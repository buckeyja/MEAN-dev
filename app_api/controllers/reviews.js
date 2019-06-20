var mongoose = require('mongoose');
var Loc = mongoose.model('Location');

/* Placeholder Functions */
var sendJsonREsponse = function (res, status, content) {
  res.status(status);
  res.json(content);
}

module.exports.reviewsCreate = function(req, res) { };
module.exports.reviewsReadOne = function(req, res) {
  if(req.params && req.params.locationid && req.params.reviewid){
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
module.exports.reviewsUpdateOne = function(req, res) { };
module.exports.reviewsDeleteOne = function(req, res) { };