function serveUpdatePassword(req, res) {
  if (req.session) {
      var nav = res.templates.render("_nav.html", {url: req.url});
      var footer = res.templates.render("_footer.html", {});
      var content = res.templates.render("update-password.html", {errorMessage: ""});
      var html = res.templates.render("_page.html", {
        page: "Update Password",
        navigation: nav,
        content: content,
        footer: footer
      });
      res.setHeader("Content-Type", "text/html");
      res.end(html);
    }
    else {
        res.statusCode = 302; 
        res.setHeader("Location", "/signin");
        res.end()
    }
}

module.exports = serveUpdatePassword;