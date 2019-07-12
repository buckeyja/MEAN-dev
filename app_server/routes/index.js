var express = require('express');
var router = express.Router();
// var ctrlMain = require('../controllers/main');
var ctrlLocations = require('../controllers/locations');
var ctrlOthers = require('../controllers/others');

/* GET home page. */
// router.get('/', ctrlMain.index);

/* Locations pages */
router.get('/', ctrlLocations.homelist);
router.get('/location/:locationid', ctrlLocations.locationInfo); // /:locationid => Adds parameter to the route for a single location
router.get('/location/review/new', ctrlLocations.addReview);

/* Others plages */
router.get('/about', ctrlOthers.about);

module.exports = router;
