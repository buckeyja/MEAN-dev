var mongoose = require( 'mongoose' );
var gracefulShutdown;
var dbURI = 'mongodb://localhost/Loc8r';
mongoose.connect(dbURI, { useNewUrlParser: true });

// Monitoring for successful connection through Mongoose
mongoose.connection.on('connected', function () {
  console.log('Mongoose connected to ' + dbURI);
});
// Chekcing for connection error
mongoose.connection.on('error', function (err) {
  console.log('Mongoose connection error: ' + err);
});
// Checking for disconnections event
mongoose.connection.on('disconnected', function () {
  console.log('Mongoose disconnected');
});


/* Close Mongoose connection passing through an anonymous function to run when closed */
gracefulShutdown = function (msg, callback) {
  mongoose.connection.close( function() {
    console.log('Mongoose disconnected through ' + msg);
    callback();
  });
};

/* Send message to gracefulShutdown and callback to kill process, emitting SIGUSR2 again */
process.once('SIGUSR2', function () {
  gracefulShutdown('nodemon restart', function () {
    process.kill(process.pid, 'SIGUSR2');
  });
});

process.on('SIGINT', function () {
  gracefulShutdown('app terination', function () {
    process.exit(0);
  });
});

//ToDo shutdown on Ubunut?
/*process.on('SIGTERM', function () {
  gracefulShutdown('Heroku app shutdown', function () {
    process.exit(0);
  });
});*/

