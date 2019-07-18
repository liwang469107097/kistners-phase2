const bcrypt = require('bcrypt');
const sessions = require('../lib/sessions');
const templates = require('../lib/templates');
const parseBody = require('../lib/parse-body');
const database = require('../data/database');
const db = database.db;

/** @function success 
 * Creates a session for the newly logged in user and 
 * redirects them to the home page.
 * @param {http.incomingMessage} req - the request object 
 * @param {http.serverResponse} res - the response object
 * @param {Object} user - the user this session belongs to 
 */
function success(req, res, user) {
  sessions.create(user, (err, sid) => {
    if(err) return serve500(req, res, err);
    if(user.role == "Admin") {
        // Set the cookie containing the SID
        res.setHeader("Set-Cookie", `SID=${sid}; Secure`);
        res.setHeader("Location", "/admin");
        res.statusCode = 302;
        res.end();
    }
     else {
         // Set the cookie containing the SID
        res.setHeader("Set-Cookie", `SID=${sid}; Secure`);
        res.setHeader("Location", "/user");
        res.statusCode = 302;
        res.end();
     }
   
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
  bcrypt.compare(req.body.password, user.cryptedPassword, (err, result) => {
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
      if(err) return failure(req, res); 
      if(!user) return failure(req, res, "Username/password combination not found.  Please try again");
      console.log(user.cryptedPassword);
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
function createSession(req, res) {
  parseBody(req, res, (req, res) => {
    retrieveUser(req, res);
  });
}

/** @module createSession 
 * An endpoint for a POST request that creates a new session for the 
 * supplied sign in form values (in the request body) and redirects 
 * to the home page.
 */
module.exports = createSession;