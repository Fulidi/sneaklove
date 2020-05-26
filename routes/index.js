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




/* ------- POST --------- */



module.exports = router;