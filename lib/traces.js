// Copyright 2016 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

var gcloud = require('gcloud');
var config = require('../config');

var CLOUD_BUCKET = config.get('CLOUD_BUCKET');

var storage = gcloud.storage({
  projectId: CLOUD_BUCKET
});
var bucket = storage.bucket(CLOUD_BUCKET);

function getPublicUrl (filename) {
  return 'https://storage.googleapis.com/' + CLOUD_BUCKET + '/' + filename;
}

function sendTraceToGCS (err, string, next) {
  if (!string) {
    return next();
  }

  var gcsname = Date.now();
  var file = bucket.file(gcsname);
  var stream = file.createWriteStream();

  var gcs = {};
  stream.on('error', function (err) {
    gcs.cloudStorageError = err;
    next(gcs);
  });

  stream.on('finish', function () {
    gcs.cloudStorageObject = gcsname;
    gcs.cloudStoragePublicUrl = getPublicUrl(gcsname);

    next(gcs);
  });

  stream.end(string);
}

module.exports = {
  getPublicUrl: getPublicUrl,
  sendTraceToGCS: sendTraceToGCS
};
