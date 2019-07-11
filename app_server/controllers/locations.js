// Iinclude request so that front-end can make API calls to back-end
const request = require('request');
// base URL for API
const apiOptions = {
  server: 'http://localhost:3000'
};
if (process.env.NODE_ENV === 'production') {
  apiOptions.server = 'https://pure-temple-67771.herokuapp.com';
}

// Helper Functions
const _rednerHompage = (req, res, responseBody) => {
  let message = null;
  if (!(responseBody instanceof Array)) {
    // If the response isn't an array, sets a message and sets the responseBody to be an empty array
    message = "API lookup error";
    responseBody = [];
  } else {
    // If the response is an array with no length, sets a message
    if (!responseBody.length) {
      message = "No Places found nearby";
    }
  }
  res.render('locations-list', {
    title: 'Loc8r - find a place to work with wifi',
    pageHeader: {
      title: 'Loc8r',
      strapline: 'Find places to work with wifi near you!'
    },
    sidebar: 'Looking for wifi and a seat? Loc8r helps you find places to work when out and about. Perhaps with coffee, cake or a pint? Let Loc8r help you find the place you\'re looking for.',
    locations: responseBody,
    message: message
  });
};

const _formatDistance = (distance) => {
  let thisDistance = 0;
  let unit = 'm';
  if (distance > 1000) {
    thisDistance = parseFloat(distance / 1000).toFixd(1);
    unit = 'km';
  } else {
    thisDistance = Math.floor(distance);
  }
  return thisDistance + unit;
};

// Public Functions

/* Get 'home' page */
const homelist = (req, res) => {
  const path = '/api/locations';
  const requestOptions = {
    url: `${apiOptions.server}${path}`,
    method: 'GET',
    json: {},
    qs: {
      lng: -0.9630890,
      lat: 51.451050,
      maxDistance: 20000
    }
  };
  request(
    requestOptions,
    (err, response, body) => {
      let data = [];
      if (response.statusCode === 200 && body.length) {
        data = body.map( (item) => {
          item.distance = _formatDistance(item.distance);
          return item;
        });   
      }
      _rednerHompage(req, res, body);
    }
  );
};

/* Get 'Location info' page */
const locationInfo = function(req, res) {
	res.render('location-info', { 
    title: 'Location info',
    pageHeader: {
      title: 'Starcups'
    },
    sidebar: {
      contex: 'is on Loc84 because it has accessible wifi and space to sit down with your laptop and get some work done.',
      callToAction: 'If you\'ve been and you like it - or if you don\'t - please leave a review to help other people just like you.'
    },
    location: {
      name: 'Starcups',
      address: '125 High Street, Reading, RG6 1PS',
      rating: 3,
      facilities: ['Hot drinks', 'Food', 'Premium wifi'],
      cords: {
        lat: 51.455041,
        lng: -0.9690884
      },
      openingTimes: [{
        days: 'Monday - Friday',
        opening: '7:00am',
        closing: '7:00pm',
        closed: false
      }, {
        days: 'Saturday',
        opening: '8:00am',
        closing: '5:00pm',
        closed: false
      }, {
        days: 'Sunday',
        closed: true
      }],
      reviews: [{
        author: 'Simon Holmes',
        rating: 5,
        timestamp: '16 July 2013',
        reviewText: 'What a great place. I can\'t say enough good things about it.'
      }, {
        author: 'Charlie Chaplin',
        rating: 3,
        timestamp: '3 July 2013',
        reviewText: 'It was okay. Coffee wasn\'t great, but the wifi was fast.'
      }]
    }
  });
};


/* Get 'Add review' page */
const addReview = function(req, res){
	res.render('location-review-form', { 
    title: 'Add Review',
    pageHeader: { title: 'Review Starcups' }
  });
};

module.exports = {
  homelist,
  locationInfo,
  addReview
}
