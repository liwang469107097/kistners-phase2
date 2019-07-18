function serveSignin(req, res) {
  var nav = res.templates.render("_nav.html", {url: req.url});
  var footer = res.templates.render("_footer.html", {});
  var content = res.templates.render("signin.html", {errorMessage: ""});
  var html = res.templates.render("_page.html", {
    page: "Login In",
    navigation: nav,
    content: content,
    footer: footer,
  });
  res.setHeader("Content-Type", "text/html");
  res.end(html);
}

module.exports = serveSignin;