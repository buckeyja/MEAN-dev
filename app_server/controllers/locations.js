// Include request so that front-end can make API calls to back-end
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

const _renderDetailPage = (req, res, location) => {
  res.render('location-info', { 
    title: location.name,
    pageHeader: {
      title: location.name
    },
    sidebar: {
      contex: 'is on Loc8r because it has accessible wifi and space to sit down with your laptop and get some work done.',
      callToAction: 'If you\'ve been and you like it - or if you don\'t - please leave a review to help other people just like you.'
    },
    location
  });
};

const _renderReviewForm = (req, res, {name}) => {
  res.render('location-review-form', {
    title: `Review ${name} on Loc8r`,
    pageHeader: { title: `Review ${name}` },
    error: req.query.err
  });
};

const _showError = (req, res, status) => {
  let title = '';
  let content = '';
  if (status === 404) {
    title = '404, page not found';
    content = 'Oh dear. Looks like you can\'t find this page. Sorry.';
  } else {
    title = `${status}, something's gone wrong`;
    content = 'Something, somewhere, has gone just a little bit wrong.';
  }
  res.status(status);
  res.render('generic-text', {
    title,
    content
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

const getLocationInfo = (req, res, callback) => {
  const path = `/api/locations/${req.params.locationid}`;
  const requestOptions = {
    url: apiOptions.server + path,
    method : 'GET',
    json: {}
  };
  request(
    requestOptions,
    (err, response, body) => {
      const data = body; // why not just use body?
      if (response.statusCode === 200) {
        data.coords = {
          lng: body.coords[0],
          lat: body.coords[1]
        };
        callback(req, res, data);      
      } else {
        _showError(req, res, response.statusCode);
      }
    }
  );
};

/* Get 'Location info' page */
const locationInfo = (req, res) => {
  getLocationInfo(req, res, 
    (req, res, responseData) => {
      _renderDetailPage(req, res, responseData);
  });
};


/* Get 'Add review' page */
const addReview = (req, res) => {
  getLocationInfo(req, res,
    (req, res, responseData) => {
      _renderReviewForm(req, res, responseData);
  });
};

/* POST reviews on specific location */
const doAddReview = (req, res) => {
  const locationid = req.params.locationid;
  const path = `/api/locations/${locationid}/reviews`;
  const postdata = {
    author: req.body.name,
    rating: parseInt(req.body.rating, 10),
    reviewText: req.body.review
  };
  const requestOptions = {
    url: apiOptions.server + path,
    method: 'POST',
    json: postdata
  };
  if ( !postdata.author || !postdata.rating || !postdata.reviewText ) {
    res.redirect(`/location/${locationid}/review/new?err=val`)
  } else {
    request(
      requestOptions,
      (err, {statusCode}, {name}) => {
        if (statusCode === 201) {
          res.redirect(`/location/${locationid}`);
        } else if (statusCode === 400 && name && name === 'ValidationError') {
          res.redirect(`/location/${locationid}/review/new?err=val`);
        } else {
          _showError(req, res, statusCode);
        }
      }
    );
  }
};

module.exports = {
  homelist,
  locationInfo,
  addReview,
  doAddReview
}
