const bcrypt = require('bcrypt');
const sessions = require('../lib/sessions');
const templates = require('../lib/templates');
const parseBody = require('../lib/parse-body');
const database = require('../data/database')
const db = database.db;
const serveSignin= require('../src/serve-signin');

const ENCRYPTION_PASSES = 10;

function saveUser(req, res, user) {
    db.run("UPDATE users SET cryptedPassword = ? WHERE username = ?",
    user.cryptedPassword,
    user.username,
    (err) => {
      if(err) failure(req, res, error);
      else {
          // Redirect to the home page 
          res.setHeader("Location", "/admin");
          res.statusCode = 302;
          res.end();
      }
    }); 
}

function success(req, res, user) {
  console.log("new password = ", req.body.newPassword);
  bcrypt.hash(req.body.newPassword, ENCRYPTION_PASSES, (err, hash) => {
    if(err) {
        console.log("error hashing password");
        return failure(req, res);
    } 
    user.cryptedPassword = hash;
    saveUser(req, res, user);
  });
}


/** @function failure
 * Enpoint that renders the sign in form on a failure with an optional message.
 * @param {http.incomingMessage} req - the request object 
 * @param {http.serverResponse} res - the response object 
 * @param {string} errorMessage (optional) - an error message to display 
 */
function failure(req, res, errorMessage) {
  if(!errorMessage) errorMessage = "There was an error processing your request.  Please try again."
  var html = res.templates.render("signin.html", {errorMessage: errorMessage});
  res.setHeader("Content-Type", "text/html");
  res.end(html);
}

/** @function validatePassword
 * A helper function that determines if the supplied password matches 
 * the encrypted one stored in the user record.  Inovokes the success() 
 * or failure() function based on the validation.
 * @param {http.incomingMessage} req - the request object 
 * @param {http.serverResponse} res - the response object 
 * @param {object} user - the user object (with a cryptedPassoword property) 
 */
function validatePassword(req, res, user) {
  bcrypt.compare(req.body.oldPassword, user.cryptedPassword, (err, result) => {
    if(result) success(req, res, user);
    else failure(req, res, "Username/password combination not found.  Please try again");
  });
}


/** @function retrieveUser
 * A helper function that retrieves the user corresponding to the 
 * req.body.username value from the database.  Invokes the validateUser() 
 * on a successful retrieval, failure() on a failed one.
 * @param {http.incomingMessage} req - the request object 
 * @param {http.serverResponse} res - the response object 
 */
function retrieveUser(req, res) {
  db.get("SELECT * FROM users WHERE username = ?",
    req.body.username,
    (err, user) => {
      if(err) {
          console.log("SQL error");
          return failure(req, res); // SQL error
      }
      if(!user) return failure(req, res, "Username/password combination not found.  Please try again");
      validatePassword(req, res, user);
    }
  );
}

/** @function createSession 
 * Creates a new session for the supplied sign in form values 
 * (Coming from the request body).  
 * @param {http.incomingMessage} req - the request object 
 * @param {http.serverResponse} res - the response object 
 */
function updatePassword(req, res) {
  parseBody(req, res, (req, res) => {
    console.log("finished parsing body");
    retrieveUser(req, res);
  });
}




/** @module createSession 
 * An endpoint for a POST request that creates a new session for the 
 * supplied sign in form values (in the request body) and redirects 
 * to the home page.
 */
module.exports = updatePassword;