const express = require('express');
const router = express.Router();
const jwt = require('express-jwt');
const ctrlLocations = require('../controllers/locations');
const ctrlReviews = require('../controllers/reviews');
const ctrlAuth = require('../controllers/authentication');
const auth = jwt({
  secret: process.env.JWT_SECRET,
  userProperty: 'payload'
});

// Locations
router
  .route('/locations')
  .get(ctrlLocations.locationsListByDistance)
  .post(ctrlLocations.locationsCreate);

router
  .route('/locations/:locationid')
  .get(ctrlLocations.locationsReadOne)
  .put(ctrlLocations.locationsUpdateOne)
  .delete(ctrlLocations.locationsDeleteOne);

// Reviews
router
  .route('/locations/:locationid/reviews')
  .post(auth, ctrlReviews.reviewsCreate);

// Authentication
router
  .route('/locations/:locationid/reviews/:reviewid')
  .get(ctrlReviews.reviewsReadOne)
  .put(auth, ctrlReviews.reviewsUpdateOne)
  .delete(auth, ctrlReviews.reviewsDeleteOne);
  
router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);

module.exports = router;