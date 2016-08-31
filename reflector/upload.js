// Copyright 2016 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

var express = require('express');
var getRawBody = require('raw-body')
var typer = require('media-typer')

var config = require('../config');
var traces = require('../lib/traces');
var model = require('./model');

var router = express.Router();

router.post('/', function list (req, res, next) {
  getRawBody(req, {
    length: req.headers['content-length'],
    limit: '1mb',
    encoding: typer.parse(req.headers['content-type']).parameters.charset
  },
  function (err, string) {
    console.log('Trace received: ' + string);

    traces.sendTraceToGCS(err, string, function (gcs) {
      if (!gcs) return next();

      if (gcs.cloudStorageError) return next(gcs.cloudStorageError);

      console.log('Public URL: ' + gcs.cloudStoragePublicUrl);

      var data = {};
      data.imageUrl = gcs.cloudStoragePublicUrl;

      model.create(data, function (err, savedData) {
        if (err) {
          return next(err);
        }
        console.log('Saved data: ' + savedData.id);
        next();
      });
    });
  })
});

router.use(function handleRpcError (err, req, res, next) {
  err.response = err.message;
  next(err);
});

module.exports = router;
