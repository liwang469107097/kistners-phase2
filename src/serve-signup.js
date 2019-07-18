function serveSignup(req, res) {
  var nav = res.templates.render("_nav.html", {url: req.url});
  var footer = res.templates.render("_footer.html", {});
  var content = res.templates.render("signup.html", {errorMessage: ""});
  var html = res.templates.render("_page.html", {
    page: "Sign Up",
    navigation: nav,
    content: content,
    footer: footer,
  });
  res.setHeader("Content-Type", "text/html");
  res.end(html);
}

module.exports = serveSignup;