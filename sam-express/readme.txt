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
make sure to see all the pages that can open with or without authentication
make sure to clear the session errors when required(whenever errors are set then reset it at some point by req.session.errors=NULL;)
delete expired tokens regularly
see all errors and make sure which ones should be displayed to the user. Also, handle the errors properly.
convert the error messages to flash messages