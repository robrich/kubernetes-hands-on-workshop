const express = require('express');
const request = require('request');

// Assume backend ip:
const BACKEND = 'http://backend:5000';

let router = express.Router();

// home page
router.get('/', function(req, res, next) {
  request.get({url:BACKEND+'/framework', json:true}, function(err, _, body) {
    if (err) {
      return next(err);
    }
    res.render('index', {frameworks:body || []});
  });
});

// edit page
router.get('/edit/:id?', function (req, res, next) {
  let id = req.params.id;
  if (id) {
    // edit
    request.get({url:BACKEND+'/framework/'+encodeURIComponent(id), json:true}, function(err, _, body) {
      if (err) {
        return next(err);
      }
      if (!body) {
        let err = new Error('Not Found');
        err.status = 404;
        return next(err);
      }
      res.render('edit', body);
    });

  } else {
    // new
    res.render('edit', {});
  }
});

// save edit
router.post('/edit/:id?', function (req, res, next) {
  let id = req.params.id;
  let name = req.body.name;
  if (id) {
    // edit
    request.put({
      url:BACKEND+'/framework/'+encodeURIComponent(id),
      json:true,
      body: {id:id, name:name}
    }, function(err/*, req, body*/) {
      if (err) {
        return next(err);
      }
      // TODO show validation failures
      res.redirect('/');
    });

  } else {
    // new
    request.post({
      url:BACKEND+'/framework',
      json:true,
      body: {name:name}
    }, function(err/*, req, body*/) {
      if (err) {
        return next(err);
      }
      // TODO show validation failures
      res.redirect('/');
    });
  }
});

router.post('/vote/up/:id', function (req, res, next) {
  let id = req.params.id;
  request.post({
    url:BACKEND+'/vote/'+encodeURIComponent(id),
    json:true
  }, function(err/*, req, body*/) {
    if (err) {
      return next(err);
    }
    // TODO show validation failures
    res.redirect('/');
  });
});
router.post('/vote/down/:id', function (req, res, next) {
  let id = req.params.id;
  request.delete({
    url:BACKEND+'/vote/'+encodeURIComponent(id),
    json:true
  }, function(err/*, req, body*/) {
    if (err) {
      return next(err);
    }
    // TODO show validation failures
    res.redirect('/');
  });
});

module.exports = router;
