const express = require("express"); // import express in this module
const router = new express.Router(); // create an app sub-module (router)
const uploader = require("./../config/cloudinary");
const sneakerModel = require("./../models/Sneaker");
const protectPrivateRoute = require("./../middlewares/protectPrivateRoute");
const tagModel = require("./../models/Tag")


/* -- PRODUCT ADD ET MANAGE POUR AFFICHER LES PRODUITS ET MANAGE */

router.get("/products_manage", protectPrivateRoute, (req, res) => {
    res.render("products_manage")
});

router.get("/products_manage", (req, res, next) => {
    sneakerModel
        .find()
        .then((dbRes) =>
            res.render("products_manage", {
                sneakers: dbRes
            }))
        .catch(next)
});

router.get("/dashboard_sneaker_row", (req, res, next) => {
    sneakerModel
        .find()
        .then((dbRes) =>
            res.render("products_manage", { sneakers: dbRes }))
        .catch(next)
})


console.log("<<<<<<<<<");
router.get("/sneakers/collection", (req, res) => {
    sneakerModel
        .find()
        .then((dbRes) =>
            res.render("products", { sneakers: dbRes })
        )
        .catch((dbErr) => console.error(dbErr));
});


router.get("/products_add", (req, res, next) => {
    sneakerModel
        .find()
        .then((dbRes) =>
            res.render("products_add", { sneakers: dbRes })
        )
        .catch(next);
});

router.post("/products_add", uploader.single("image"), (req, res, next) => {
    const newProduct = {...req.body };
    // prend toutes les clés valeur contenues dans req.body et copie les dans un nouvel objet nommé newProduct

    // si l'utilisateur a uploadé un fichier, req.file ne sera pas undefined : il vaudra un objet représentant le fichier uploadé sur votre compte cloudinary
    if (req.file) newProduct.image = req.file.secure_url; // on associe l'url de l'image en https @cloudinary

    // console.log(">>> fichier posté ? >>>", req.file);
    // console.log(">>> nouveau produit >>> ", newProduct);

    sneakerModel
        .create(newProduct)
        .then((dbRes) => {

            res.redirect("/products_manage");
        })
        .catch(next);
});


router.post("/products_add", uploader.single("image"), (req, res, next) => {
    const sneaker = {
        ...req.body
    };
    if (req.file) {
        sneaker.image = req.file.secure_url
    };
    sneakerModel
        .create(sneaker)
        .then((dbRes) => res.redirect("/products_manage"))
        .catch(next);

});


router.post("/products_edit/:id", uploader.single("image"), (req, res, next) => {
    const updatedProduct = {...req.body };
    if (req.file) updatedProduct.image = req.file.secure_url;

    // console.log(">>> fichier posté ? >>>", req.file);
    // console.log(">>> nouveau mis à jour ? >>> ", updatedProduct);

    productModel
        .findByIdAndUpdate(req.params.id, updatedProduct)
        .then(() => res.redirect("/products_manage"))
        .catch(next);
});

/* ----- TAGS & ID ----- */

router.get("/sneakers/:cat", (req, res) => {
    res.render("products");
});


router.get("/products/:id", async(req, res, next) => {
    // le callback est "décoré" du mot-clé async
    try {
        const product = await productModel.findById(req.params.id);
        // ci-dessus, on attend (await) le resultat d'une action asynchrone
        res.render("product", { product, title: product.name });
    } catch (dbErr) {
        next(dbErr);
    }
});


// router.get("/one-product/:id", async(req, res) => {
//     try {
//         const product = await productModel.findById(req.params.id);
//         // ci-dessus, on attend (await) le resultat d'une action asynchrone
//         res.render("one_product", { product, title: product.name });
//     } catch (dbErr) {
//         next(dbErr);
//     }
// });


module.exports = router;