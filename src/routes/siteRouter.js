/**
 * Express router for handling site-related routes.
 * @module routes/siteRouter
 * @require express
 * @require controllers/SiteController
 */

const express = require("express");
const router = express.Router();

// import controller
const SiteController = require("../controllers/SiteController.js");

router.get("/error404", SiteController.error404);

router.get("/about", SiteController.about);

router.get("/terms-of-use", SiteController.termOfUse);

router.get("/privacy-policy", SiteController.privacyPolicy);

router.get("/site/bookTutor", SiteController.bookTutor);
router.get("/site/instruct",SiteController.instruct);
router.get("/", SiteController.hom);

module.exports = router;
