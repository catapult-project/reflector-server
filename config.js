// Copyright 2016 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

var nconf = module.exports = require('nconf');
var path = require('path');

nconf
  .argv()
  .env([
    'CLOUD_BUCKET',
    'GCLOUD_PROJECT',
    'NODE_ENV',
    'REFLECTOR_DESTINATION',
    'REFLECTOR_DURATION',
    'PORT'
  ])
  .file({ file: path.join(__dirname, 'config.json') })
  .defaults({
    CLOUD_BUCKET: 'reflector-server-public',
    GCLOUD_PROJECT: 'reflector-server',
    MEMCACHE_URL: '127.0.0.1:11211',
    REFLECTOR_DESTINATION: 'https://localhost:8080/reflector/upload',
    REFLECTOR_DURATION: '3',
    PORT: 8080
  });
