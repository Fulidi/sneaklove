const express = require("express");
const router = new express.Router();

console.log(`
-----------------------------
-----------------------------
node says : wax on / wax off !
-----------------------------
-----------------------------`);

router.get("/home", (req, res) => {
    res.render("index");
});

router.get("/sneakers/:cat", (req, res) => {
    res.render("products");
});

router.get("/one-product/:id", (req, res) => {
    res.render("one_product");
});

router.get("/signup", (req, res) => {
    res.render("signup");
});

router.get("/signin", (req, res) => {
    res.render("signin");
});


module.exports = router;