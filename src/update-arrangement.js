const database = require('../data/database');
const arrangements = database.arrangements;
const serve500 = require('../src/serve500');
const serveAdmin = require('../src/serve-admin')
const parseBody = require('../lib/parse-body');

function updateArrangement(req, res) {
    // Parse the body
    parseBody(req, res, (req, res) => {
        // update arrangement 
        arrangements.update(req.body, (err) => {
            if(err) return serve500(req, res);
            serveAdmin(req, res);
        });
    });
}

module.exports = updateArrangement;