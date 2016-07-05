var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/partials/:name', function(req, res, next) {
	res.render('partials/'+req.params.name);
});

router.get('/readandstore', function(req, res, next) {
	console.log('read and store route');
	res.render('readandstore', { title: 'Read and Store'});
});

module.exports = router;
