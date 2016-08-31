<!-- Copyright 2016 The Chromium Authors. All rights reserved.
     Use of this source code is governed by a BSD-style license that can be
     found in the LICENSE file.
-->

Reflector Reference Server
==========================

## Instructions:

Create a config.json file if you want to override config defaults (i.e. App Engine project, bucket, etc).
Note that the Cloud storage bucket has to be publically readable (Add read permissions for the 'allUsers' user).

Generate a self-signed SSL certificate for localhost testing (leave prompts at defaults):
```sh
mkdir sslcert
openssl genrsa -des3 -passout pass:x -out sslcert/server.pass.key 2048
openssl rsa -passin pass:x -in sslcert/server.pass.key -out sslcert/server.key
rm sslcert/server.pass.key
openssl req -new -key sslcert/server.key -out sslcert/server.csr
openssl x509 -req -sha256 -days 365 -in sslcert/server.csr -signkey sslcert/server.key -out sslcert/server.crt

```

Install dependencies:
```sh
npm install
npm start
```

Run Chrome:
```sh
./chrome --allow-insecure-localhost --enable-reflector-for-recipient=http://localhost:8080/reflector/upload http://localhost:8080/reflector/test
```
