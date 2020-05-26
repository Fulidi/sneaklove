const express = require("express"); // import express in this module
const router = new express.Router(); // create an app sub-module (router)
const uploader = require("./../config/cloudinary");
const sneakerModel = require("./../models/Sneaker");
const protectPrivateRoute = require("./../middlewares/protectPrivateRoute");
const tagModel = require("./../models/Tag")


/* -- PRODUCT ADD ET MANAGE POUR AFFICHER LES PRODUITS ET MANAGE */

// router.get("/products_manage", protectPrivateRoute, (req, res) => {
//     res.render("products_manage")
// });

router.get("/products_manage", protectPrivateRoute, (req, res, next) => {
    sneakerModel
        .find()
        .then((dbRes) =>
            res.render("products_manage", {
                sneakers: dbRes
            }))
        .catch(next)
});

router.get("/sneakers/collection", (req, res) => {
    sneakerModel
        .find()
        .populate()
        .then((dbRes) =>
            res.render("products", { sneakers: dbRes })
        )
        .catch((dbErr) => console.error(dbErr));
});


// router.get("/products_add", (req, res, next) => {
//     sneakerModel
//         .find()
//         .then((dbRes) =>
//             res.render("products_add", { sneakers: dbRes, })
//         )
//         .catch(next);
// });

// router.post("/products_add", uploader.single("image"), (req, res, next) => {
//     const newProduct = {...req.body };
//     // prend toutes les clés valeur contenues dans req.body et copie les dans un nouvel objet nommé newProduct

//     // si l'utilisateur a uploadé un fichier, req.file ne sera pas undefined : il vaudra un objet représentant le fichier uploadé sur votre compte cloudinary
//     if (req.file) newProduct.image = req.file.secure_url; // on associe l'url de l'image en https @cloudinary

//     // console.log(">>> fichier posté ? >>>", req.file);
//     // console.log(">>> nouveau produit >>> ", newProduct);

//     sneakerModel
//         .create(newProduct)
//         .then((dbRes) => {

//             res.redirect("/products_manage");
//         })
//         .catch(next);
// });


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

router.get("/product_edit/:id", (req, res, next) => {
    sneakerModel
        .findById(req.params.id)
        .then(dbRes => {
            res.render("product_edit", { sneaker: dbRes })
        })
        .catch(next);
});

router.post("/product_edit/:id", (req, res, next) => {
    sneakerModel
        .findByIdAndUpdate(req.params.id, req.body)
        .then(() => res.redirect("/products_manage"))
        .catch(next);

});



// ------- DELETE --------

router.post("/product_delete/:id", (req, res, next) => {
    sneakerModel
        .findByIdAndDelete(req.params.id)
        .then(dbRes => {
            console.log(dbRes)
            res.redirect("/products_manage");
        })
        .catch(next);
});


/* ----- CAT & TAGS ----- */

// router.get("/sneakers/:cat", (req, res) => {
//     res.render("products");
// });


router.post("/tag_product", (req, res, next) => {
    tagModel
        .create(req.body)
        .then((dbRres) => {
            res.redirect("/home");
        })
        .catch(next)
})


router.get(
    "/products_add",
    protectPrivateRoute,
    (req, res, next) => {
        // promise.all va attendre la résolution de toutes les promesses passées en argument
        Promise.all([sneakerModel.findById(req.params.id), tagModel.find()])
            .then((dbResponses) => {
                // les réponses sont fournies dans un Array dans le même ordre que l'Array fournit en argument du Promise.all()
                res.render("products_add", {
                    sneakers: dbResponses[0], // on accède donc au résultat avec les indices du tableau initial
                    tags: dbResponses[1],
                    label: "Editer un produit",
                });
            })
            .catch(next); // toutes les promesses doivent être tenues, sinon le catch sera déclenché
    }
);

module.exports = router;