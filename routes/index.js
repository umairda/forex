var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/graph', function(req, res, next) {
  res.render('index', { title: 'graph' });
});

router.get('/partials/:name', function(req, res, next) {
	res.render('partials/'+req.params.name);
});

module.exports = router;
