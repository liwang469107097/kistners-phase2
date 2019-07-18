const db = require('../data/database');

function serveUpdateArrangementForm(req, res) {
    console.log("Serve update id = " + req.params.id);
    db.arrangements.find(req.params.id, (err, arrangement) => {
        console.log(req.params, err, arrangement)
        var nav = res.templates.render("_nav.html", {url: req.url});
        var footer = res.templates.render("_footer.html", {});
        var content = res.templates.render("update-arrangement-form.html", arrangement);
        var html = res.templates.render("_page.html", {
        page: "Update Arrangement Form",
        navigation: nav,
        content: content,
        footer: footer
  });
  res.setHeader("Content-Type", "text/html");
  res.end(html);
    });
}

module.exports = serveUpdateArrangementForm;