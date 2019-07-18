function serveAdmin(req, res) {
    if(req.session) {
        if(req.user.role == "Admin")
            {
                var nav = res.templates.render("_nav.html", {url: req.url});
                var footer = res.templates.render("_footer.html", {});
                var content = res.templates.render("admin.html", {});
                var html = res.templates.render("_page.html", {
                page: "Admin",
                navigation: nav,
                content: content,
                footer: footer
              });
              res.setHeader("Content-Type", "text/html");
              res.end(html);
            }
        else {
            var nav = res.templates.render("_nav.html", {url: req.url});
                var footer = res.templates.render("_footer.html", {});
                var content = res.templates.render("user.html", {});
                var html = res.templates.render("_page.html", {
                page: "User",
                navigation: nav,
                content: content,
                footer: footer
              });
              res.setHeader("Content-Type", "text/html");
              res.end(html);
        }
        
     }
     else {
         res.statusCode = 302;
         res.setHeader("Location", "/signin");
         res.end();
     }
}

module.exports = serveAdmin;
