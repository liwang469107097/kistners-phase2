const serve500 = require('./serve500');
const db = require('../data/database');

function serveUpdateArrangement(req, res) {
  db.arrangements.getAll((err, arrangements) => {
    if(err) {
      console.log(`Could not retrieve arrangements: ${err}`);
      serve500(req, res);
      return;
    }

    var arrangementList = res.templates.render("_arrangement-update-list.html", {arrangements: arrangements});
      var nav = res.templates.render("_nav.html", {url: req.url});
    var footer = res.templates.render("_footer.html", {});
    var content = res.templates.render("update-arrangement.html", {arrangements: arrangementList});
    
      var html = res.templates.render("_page.html", {
      page: "Update Arrangement",
      navigation: nav,
      content: content,
      footer: footer
    });
    res.setHeader("Content-Type", "text/html");
    res.end(html);
  });
}

module.exports = serveUpdateArrangement;