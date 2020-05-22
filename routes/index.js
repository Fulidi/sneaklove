const express = require("express");
const router =  new express.Router();

console.log(`
-----------------------------
-----------------------------
node says : wax on / wax off !
-----------------------------
-----------------------------`
);

router.get("/", (req, res) => {
  res.render("index");
});

router.get("/sneakers/:cat", (req, res) => {
  res.send("bar");
});

router.get("/one-product/:id", (req, res) => {
  res.send("baz");
});

router.get("/signup", (req, res) => {
  res.send("sneak");
});

router.get("/signin", (req, res) => {
  res.send("love");
});


module.exports = router;
