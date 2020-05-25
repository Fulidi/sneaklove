const express = require("express"); // import express in this module
const router = new express.Router(); // create an app sub-module (router)
const fileUploader = require("./../config/cloudinary");
const sneakerModel = require("./../models/Sneaker");
const protectPrivateRoute = require("./../middlewares/protectPrivateRoute");
const tagModel = require("./../models/Tag")


/* -- PRODUCT ADD ET MANAGE POUR AFFICHER LES PRODUITS ET MANAGE */

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

/* ----- TAGS & ID ----- */

router.get("/sneakers/:cat", (req, res) => {
    res.render("products");
});

router.get("/one-product/:id", (req, res) => {
    tagModel
        .findById(req.params.id)
        .then((dbRes) => {
            res.render("one_product", { category: dbRes })

        })
        .catch(next);

});

module.exports = router;