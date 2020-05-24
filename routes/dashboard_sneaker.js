const express = require("express"); // import express in this module
const router = new express.Router(); // create an app sub-module (router)
const fileUploader = require("./../config/cloudinary");
const sneakerModel = require("./../models/Sneaker")
const protectPrivateRoute = require("./../middlewares/protectPrivateRoute")


router.get("/products_add", (req, res, next) => {
    sneakerModel
        .find()
        .then((category) =>
            res.render("products_add", {
                category,
                title: "Créer un produit",
            })
        )
        .catch(next);
});

router.get("/products_manage", (req, res) => {
    res.render("products_manage")
})





module.exports = router;