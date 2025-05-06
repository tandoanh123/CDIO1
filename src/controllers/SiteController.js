const SearchModel = require("../models/search.model");

class SiteController {
  // [GET] /
  hom(req, res) {
    // res.status(200).json({
    res.status(200).render("./pages/site/hom", {
      user: req.session.user,
    });
  }

  // [GET] /about
  about(req, res) {
    res.render("./pages/site/about", {
      user: req.session.user,
    });
  }
  bookTutor(req, res) {
    res.render("./pages/site/book-tutor", {
      user: req.session?.user || null,
    });
  }
  // [GET] /error404
  error404(req, res) {
    res.render("pages/site/error404.ejs");
  }

  // [GET] /term-of-use
  termOfUse(req, res) {
    res.render("./pages/site/terms-of-use", {
      user: req.session.user,
    });
  }

  // [GET] /privacy-policy
  privacyPolicy(req, res) {
    res.render("./pages/site/privacy-policy", {
      user: req.session.user,
    });
  }
}

module.exports = new SiteController();
