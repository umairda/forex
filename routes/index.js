var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/partials/:name', function(req, res, next) {
	res.render('partials/'+req.params.name);
});

router.get('/table', function(req, res, next) {
	res.redirect('/#/table');
});

router.get('/graph', function(req, res, next) {
	res.redirect('/#/graph');
});

router.get('/readandstore', function(req, res, next) {
	res.redirect('/#/readandstore');
});

module.exports = router;
