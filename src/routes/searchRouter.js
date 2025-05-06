const express = require("express");
const router = express.Router();

// import controller
const SearchController = require("../controllers/SearchController.js");

router.get("/results", SearchController.find);
router.get("/filter", SearchController.filterSortResult);
router.post("/hint_search", SearchController.hintSearch);
router.get("/resultsfiltersort", SearchController.filterSortResult);
router.post("/tutorDetails", SearchController.getTutorDetails);
router.get("/:tutor_id", SearchController.tutorDetail);
router.post("/:tutor_id/request", SearchController.submitRequest);

module.exports = router;
