We are using node.js as well as epress framework.
To run, simple open terminal and do- node server.js
then open any browser and write localhost:<port no.>




============

set port to 8000 in bin/www line 15.
how to run: go to sam-epress. Type "npm start" in powershell.
Imp files for modification: app.js, routes/index.js, views/layouts/*
package.json has list of reuirements of the project



var error = {param: "id", msg: "Invalid user id or password", value: req.body.id};
				if(!errors){
					errors = [];
				}
				errors.push(error);


Operating git:
git pull
git add *
git commit -m "..."
git push origin master