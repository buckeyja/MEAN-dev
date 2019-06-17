var mongoose = require('mongoose');
var Loc = mongoose.model('Location');

/* Placeholder Functions */
var sendJsonREsponse = function (res, status, content) {
  res.status(status);
  res.json(content);
}

module.exports.reviewsCreate = function(req, res) { };
module.exports.reviewsReadOne = function(req, res) {
  Loc
    .findById(req.params.locationid)
    .select('name reviews')
    .exec(
      function(err, location) {
        var review;
        review = location.reviews.id(req.params.reviewid);
      })
};
module.exports.reviewsUpdateOne = function(req, res) { };
module.exports.reviewsDeleteOne = function(req, res) { };