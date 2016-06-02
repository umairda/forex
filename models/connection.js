// Bring Mongoose into the app 
var mongoose = require( 'mongoose' ); 

// Get Mongo login credentials
var options = require('./options.js');

// Build the connection string 
if (options.mongoConfig.user && options.mongoConfig.pass) var dbURI = 'mongodb://'+options.mongoConfig.user+':'+options.mongoConfig.pass+'@localhost/forex'; 
else dbURI = 'mongodb://localhost/forex'; 

// Create the database connection 
mongoose.connect(dbURI); 

// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on('connected', function () {  
  console.log('Mongoose default connection open to ' + dbURI);
}); 

// If the connection throws an error
mongoose.connection.on('error',function (err) {  
  console.log('Mongoose default connection error: ' + err);
}); 

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {  
  console.log('Mongoose default connection disconnected'); 
});

// If the Node process ends, close the Mongoose connection 
process.on('SIGINT', function() {  
  mongoose.connection.close(function () { 
    console.log('Mongoose default connection disconnected through app termination'); 
    process.exit(0); 
  }); 
}); 
