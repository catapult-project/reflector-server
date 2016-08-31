// Copyright 2016 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

var express = require('express');
var config = require('../config');

function getModel () {
  return require('./model')
}

var router = express.Router();

router.use(function (req, res, next) {
  res.set('Content-Type', 'text/html');
  next();
});

router.get('/', function list (req, res, next) {
  getModel().list(10, req.query.pageToken, function (err, entities, cursor) {
    if (err) {
      return next(err);
    }
    res.render('traces/list.jade', {
      traces: entities,
      nextPageToken: cursor
    });
  });
});

router.use(function handleRpcError (err, req, res, next) {
  err.response = err.message;
  next(err);
});

module.exports = router;
