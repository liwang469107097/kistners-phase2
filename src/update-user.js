const bcrypt = require('bcrypt');
const sessions = require('../lib/sessions');
const templates = require('../lib/templates');
const parseBody = require('../lib/parse-body');
const database = require('../data/database')
const db = database.db;
const serveSignin= require('../src/serve-signin');

const ENCRYPTION_PASSES = 10;
const default_password = "111111";

function update(req, res, user) {
    db.run("UPDATE users SET username = ?, cryptedPassword = ?, role = ? WHERE username = ?",
    req.body.newUsername,
    user.cryptedPassword,
    req.body.newRole,
    user.username,
    (err) => {
      if(err) failure(req, res, error);
      else {
          res.setHeader("Location", "/admin");
          res.statusCode = 302;
          res.end();
      }
    }); 
}

function success(req, res, user) {
  console.log("in success");
  console.log("new password = ", default_password);
  bcrypt.hash(default_password, ENCRYPTION_PASSES, (err, hash) => {
    if(err) {
        console.log("error hashing password");
        return failure(req, res);
    } 
    user.cryptedPassword = hash;
    update(req, res, user);
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
  var html = res.templates.render("update-user.html", {errorMessage: errorMessage});
  res.setHeader("Content-Type", "text/html");
  res.end(html);
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
    req.body.oldUsername,
    (err, user) => {
      if(err) {
          console.log("SQL error");
          return failure(req, res); // SQL error
      }
      if(!user) {
          failure(req, res, "Username/password combination not found.  Please try again");
      } 
      else {
          success(req, res, user);
      }
      
    }
  );
}

/** @function createSession 
 * Creates a new session for the supplied sign in form values 
 * (Coming from the request body).  
 * @param {http.incomingMessage} req - the request object 
 * @param {http.serverResponse} res - the response object 
 */
function updateUser(req, res) {
  parseBody(req, res, (req, res) => {
    retrieveUser(req, res);
  });
}




/** @module createSession 
 * An endpoint for a POST request that creates a new session for the 
 * supplied sign in form values (in the request body) and redirects 
 * to the home page.
 */
module.exports = updateUser;