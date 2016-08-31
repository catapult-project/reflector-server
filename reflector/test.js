// Copyright 2016 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

var express = require('express');
var config = require('../config');

var router = express.Router();

router.use(function (req, res, next) {
  res.set('Content-Type', 'text/html');
  res.set('x-trace-data-to', config.get('REFLECTOR_DESTINATION'));
  res.set('x-trace-duration', config.get('REFLECTOR_DURATION'));
  next();
});

router.get('/', function list (req, res, next) {
    res.render('traces/test.jade');
});

router.use(function handleRpcError (err, req, res, next) {
  err.response = err.message;
  next(err);
});

module.exports = router;
