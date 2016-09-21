var express = require('express');
var router = express.Router();

/* GET index page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET console page. */
router.get('/console', function(req, res, next) {
  res.render('console', { title: 'Express' });
});

module.exports = router;
