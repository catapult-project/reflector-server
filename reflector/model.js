// Copyright 2016 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

var gcloud = require('gcloud');
var config = require('../config');

var ds = gcloud.datastore({
  projectId: config.get('GCLOUD_PROJECT')
});
var kind = 'Trace';

function fromDatastore (obj) {
  obj.data.id = obj.key.id;
  return obj.data;
}

function toDatastore (obj, nonIndexed) {
  nonIndexed = nonIndexed || [];
  var results = [];
  Object.keys(obj).forEach(function (k) {
    if (obj[k] === undefined) {
      return;
    }
    results.push({
      name: k,
      value: obj[k],
      excludeFromIndexes: nonIndexed.indexOf(k) !== -1
    });
  });
  return results;
}

function list (limit, token, cb) {
  var q = ds.createQuery([kind])
    .limit(limit)
    .order('imageUrl')
    .start(token);

  ds.runQuery(q, function (err, entities, nextQuery) {
    if (err) {
      return cb(err);
    }
    var hasMore = entities.length === limit ? nextQuery.startVal : false;
    cb(null, entities.map(fromDatastore), hasMore);
  });
}

function update (id, data, cb) {
  var key;
  if (id) {
    key = ds.key([kind, parseInt(id, 10)]);
  } else {
    key = ds.key(kind);
  }

  var entity = {
    key: key,
    data: toDatastore(data, ['description'])
  };

  ds.save(
    entity,
    function (err) {
      data.id = entity.key.id;
      cb(err, err ? null : data);
    }
  );
}

function read (id, cb) {
  var key = ds.key([kind, parseInt(id, 10)]);
  ds.get(key, function (err, entity) {
    if (err) {
      return cb(err);
    }
    if (!entity) {
      return cb({
        code: 404,
        message: 'Not found'
      });
    }
    cb(null, fromDatastore(entity));
  });
}

function _delete (id, cb) {
  var key = ds.key([kind, parseInt(id, 10)]);
  ds.delete(key, cb);
}

module.exports = {
  create: function (data, cb) {
    update(null, data, cb);
  },
  read: read,
  update: update,
  delete: _delete,
  list: list
};
