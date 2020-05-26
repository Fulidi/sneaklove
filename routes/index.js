const express = require("express");
const router = new express.Router();
const fileUploader = require("./../config/cloudinary");
const sneakerModel = require("./../models/Sneaker");
const tagModel = require("./../models/Tag");

console.log(`
-----------------------------
-----------------------------
node says : wax on / wax off !
-----------------------------
-----------------------------`);

/* ------- GET --------- */

router.get("/home", (req, res) => {
    res.render("index");
});

router.get("/sneakers/men", (req, res) => {
    res.render("products")
});

router.get("/sneakers/women", (req, res) => {
    res.render("products")
});

router.get("/sneakers/kids", (req, res) => {
    res.render("products")
});



/* ------- POST --------- */



module.exports = router;