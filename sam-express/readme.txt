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
add all foreign key and primary key and unique errors.

Change names- signin's submit to signin_submit, - to _
add the functionality if teacher wants to cancel the class-- do this by if photo has been uploaded fr a day only then consider class taken and only then add in the attendance table
-Admin is not setting the password of student/prof/ta because they will do forgot password then their password will be  created by themselves.
-in TA_record we ask email again and student_id is not compulsory field so, if he is not student then fine but if he is  student then due to foreign key constraint he must be present in student table also, we verify his email with that listed  in student so that they match, if not then throw error.
-Phase 2: making things more accessible to admin, like to add new class, he will get a list of courses and among them he can search for a course and then add a class to it. Similarly for adding students/ta/prof he gets list of classes. Also add attendance counter for him, generate list of essential things for him.