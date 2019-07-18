var http = require('http');
const Router = require('./lib/router');
const Templates = require('./lib/templates');
const serveFile = require('./src/serve-file');
const serveHome = require('./src/serve-home');
const serveAnniversary = require('./src/serve-anniversary');
const serveBaby = require('./src/serve-baby');
const serveBirthday = require('./src/serve-birthday');
const serveProm = require('./src/serve-prom');
const serveSororitySisterhood = require('./src/serve-sorority-sisterhood');
const serveSympathy = require('./src/serve-sympathy');
const serveWedding = require('./src/serve-wedding');
const serveArrangement = require('./src/serve-arrangement');
const serveArrangementImage = require('./src/serve-arrangement-image');
const serve404 = require('./src/serve404');

const serveSignup = require('./src/serve-signup');
const serveSignin = require('./src/serve-signin');
const serveAdmin = require('./src/serve-admin');
const createArrangement = require('./src/create-arrangement');
const serveCreateArrangement = require('./src/serve-create-arrangement');
const serveUpdateArrangement = require('./src/serve-update-arrangement');
const serveUpdateArrangementForm = require('./src/serve-update-arrangement-form');
const updateArrangement = require('./src/update-arrangement');
const createUser = require('./src/create-user');
const createSession = require('./src/create-session');
const loadSession = require('./lib/load-session');
const serveUpdatePassword = require('./src/serve-update-password');
const updatePassword = require('./src/update-password');
const serveUser = require('./src/serve-user');
const serveUpdateUser = require('./src/serve-update-user');
const updateUser = require('./src/update-user');


const PORT = 3000;

var router = new Router(serve404);
var templates = new Templates("./templates");

router.addRoute("GET", "/static/:filename", serveFile);
router.addRoute("GET", "/", serveHome);
router.addRoute("GET", "/index", serveHome);
router.addRoute("GET", "/index.html", serveHome);
router.addRoute("GET", "/anniversary", serveAnniversary);
router.addRoute("GET", "/baby", serveBaby);
router.addRoute("GET", "/birthday", serveBirthday);
router.addRoute("GET", "/prom", serveProm);
router.addRoute("GET", "/sorority-sisterhood", serveSororitySisterhood);
router.addRoute("GET", "/sympathy", serveSympathy);
router.addRoute("GET", "/weddings", serveWedding);
router.addRoute("GET", "/arrangements/:id", serveArrangement);
router.addRoute("GET", "/arrangement-images/:id", serveArrangementImage);

router.addRoute("GET", "/signin", serveSignin);
router.addRoute("POST", "/signin", createSession);
router.addRoute("GET", "/signup", serveSignup);
router.addRoute("POST", "/signup", createUser);
router.addRoute("GET", "/admin", serveAdmin);
router.addRoute("GET", "/create-arrangement", serveCreateArrangement);
router.addRoute("POST", "/create-arrangement", createArrangement);
router.addRoute("GET", "/update-arrangement", serveUpdateArrangement);
router.addRoute("POST", "/update-arrangement", updateArrangement);
router.addRoute("GET", "/update-arrangement-form/:id", serveUpdateArrangementForm);
router.addRoute("GET", "/update-password", serveUpdatePassword);
router.addRoute("POST", "/update-password", updatePassword);
router.addRoute("GET", "/user", serveUser);
router.addRoute("GET", "/update-user", serveUpdateUser);
router.addRoute("POST", "/update-user", updateUser);


// Setup http server
var server = http.createServer((req, res) => {
  // Attach the template library to the response
  res.templates = templates;
    
    loadSession(req, res, (req, res) => {
         // TODO: Attach the database to the response
          router.route(req, res);
    })
 
});

// Begin listening for requests
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
