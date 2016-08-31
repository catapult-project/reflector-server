<!-- Copyright 2016 The Chromium Authors. All rights reserved.
     Use of this source code is governed by a BSD-style license that can be
     found in the LICENSE file.
-->

Reflector Reference Server
==========================

Instructions:

Create a config.json file if you want to override config defaults (i.e. App Engine project, bucket, etc).
Note that the Cloud storage bucket has to be publically readable (Add read permissions for the 'allUsers' user).

# npm install
# npm start

Run Chrome with:
# ./chrome --enable-reflector-for-recipient=http://localhost:8080/reflector/upload http://localhost:8080/reflector/test
