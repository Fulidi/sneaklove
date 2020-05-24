const express = require("express");
const router = new express.Router();
const bcrypt = require("bcrypt");
const fileUploader = require("./../config/cloudinary");
const userModel = require("./../models/User");
const exposeFlashMessage = require("./../middlewares/exposeFlashMessage");
const exposeLoginStatus = require("./../middlewares/exposeLoginStatus")



/* ---- SIGN IN / SIGN UP - GET ---- */


router.get("/signup", (req, res) => {
    res.render("signup");
});



router.get("/signin", (req, res) => {
    res.render("signin");
});

/* ----- KILL IT ------ */

router.get("/logout", (req, res) => {
    req.session.destroy(() => {
        console.log("la session est détruite")
        res.redirect("/signin")
    })
})

/* ---- SIGN IN / SIGN UP - POST ---- */

router.post("/signin", exposeLoginStatus, exposeFlashMessage, (req, res, next) => {
    console.log(">>>>> ICI", req.body.email, req.body.password);
    const userInfos = req.body;
    userModel
        .findOne({
            email: userInfos.email
        })
        .then(user => {
            console.log("user trouvé par mail >>", user); // verifier que le mail existe en bdd
            if (!user) { // si non, retourner une erreur au client. 
                console.log(">>>>>", user);
                req.flash("error", "Identifiants incorrects");
                res.redirect("/signin")
            }
            const checkPassword = bcrypt.compareSync(
                userInfos.password,
                user.password
            );
            if (checkPassword === false) {
                req.flash("error", "Identifiants incorrects");
                res.redirect("/signin");
            }
            const { _doc: clone } = {...user };
            delete clone.password;
            req.session.currentUser = clone;
            console.log(">>>>>", req.session.currentUser)

            res.redirect("/products_manage")
        })
        .catch(next);


});

// ---- POST SIGN UP 

router.post("/signup", (req, res, next) => {
    const user = req.body;
    console.log("KESKIA DANS REQ.BODY", req.body)
    if (!user.name || !user.password || !user.email) {
        console.log("DANS LE IF")
            // retourner message d'erreur : remplir les champs requis + redirect
        req.flash("error", "Merci de remplir tous les champs.");
        res.redirect("/signup");
    } else {
        userModel
            .findOne({
                email: user.email
            })
            .then((dbRes) => {
                if (dbRes) { // retourner message d'erreur : utilisateur existant + redirect
                    req.flash("warning", "Désolé, cet email n'est pas disponible.");
                    res.redirect("/signup");
                }
            })
            .catch(next);
        // si le programe est lu jusqu'ici, on va convertir le mot de passe en chaine cryptée. 
        const salt = bcrypt.genSaltSync(10);
        const hashed = bcrypt.hashSync(user.password, salt);
        console.log("password crypté >>>>>", hashed);
        user.password = hashed;
        // on insère le nouvel utilisateur en bdd.
        userModel
            .create(user)
            .then(dbRes => {
                console.log(">>>>>>", user)
                req.flash("success", "Inscription validée !");
                res.redirect("/signin")
            })
            .catch(next);
    }
});


module.exports = router;