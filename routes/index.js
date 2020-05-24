const express = require("express");
const router = new express.Router();
const fileUploader = require("./../config/cloudinary");
const sneakerModel = require("./../models/Sneaker");

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

router.get("/sneakers/:cat", (req, res) => {
    res.render("products");
});

router.get("/one-product/:id", (req, res) => {
    res.render("one_product");
});

/* ----- PRODUCTS MANAGE - ADD - EDIT ------- */



/* ------- POST --------- */

router.post("")


module.exports = router;