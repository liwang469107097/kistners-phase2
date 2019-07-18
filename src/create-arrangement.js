const database = require('../data/database');
const arrangements = database.arrangements;
const serve500 = require('../src/serve500');
const serveAdmin = require('../src/serve-admin')
const parseBody = require('../lib/parse-body');

function createArrangement(req, res) {
    
    parseBody(req, res, (req, res) => {
        // Create arrangement 
        arrangements.create(req.body, (err) => {
            if(err) return serve500(req, res);
            // Serve the updated admin
            serveAdmin(req, res);
        });
    });
}
module.exports = createArrangement;