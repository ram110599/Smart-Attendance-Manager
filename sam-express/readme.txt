We are using node.js in combination with express framework.


============

set port to 8000 in bin/www line 15.
how to run: go to sam-epress. Type "npm start" in powershell. in browser, type "localhost:8000"
Imp files for modification: app.js, routes/index.js, views/layouts/*
package.json has list of reuirements of the project

Followed forgot password by: https://www.smashingmagazine.com/2020/03/creating-secure-password-flows-nodejs-mysql/

Operating git:
git pull
git add *
git commit -m "..."
git push -u origin master

TODO:
set CRYPTO with salt for passwords
make sure to see all the pages that can open with or without authentication
make sure to clear the session errors when required(whenever errors are set then reset it at some point by req.session.errors=NULL;)
delete expired tokens regularly
see all errors and make sure which ones should be displayed to the user. Also, handle all the errors properly.
convert the error messages to flash messages
comment and indent, also correct the NAMES(use _ instead of -; Start class name in capital and proper camelCase)
check all end cases
make proper file structure. example- the login stuff(all the login pages) should be in one folder. Similarly, index.js can also be segmented.