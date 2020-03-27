We are using node.js in combination with express framework.


============

set port to 8000 in bin/www line 15.
how to run: go to sam-epress. Type "npm start" in powershell. in browser, type "localhost:8000"
Imp files for modification: app.js, routes/index.js, views/layouts/*
package.json has list of reuirements of the project



Operating git:
git pull
git add *
git commit -m "..."
git push -u origin master

TODO:
set crypto with salt for passwords
set crypto.randomBytes(64).toString('base64'); at time of creating token while resetting password.