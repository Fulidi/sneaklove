const express = require("express");
const router = new express.Router();
const bcrypt = require("bcrypt");
const fileUploader = require("./../config/cloudinary");
const userModel = require("./../models/User");




/* ---- SIGN IN / SIGN UP - GET ---- */

router.get("/signup", (req, res) => {
    res.render("signup");
});

router.get("/signin", (req, res) => {
    res.render("signin");
});

/* ----- KILL IT ------ */

router.get("/signout", (req, res) => {
    req.session.destroy(() => {
        console.log("la session est détruite")
        res.redirect("/signin")
    })
})

/* ---- SIGN IN / SIGN UP - POST ---- */

router.post("/signup", (req, res, next) => {
    console.log(req.body.email, req.body.password);
    const userInfos = req.body;
    if (!userInfos.email || !userInfos.password) {
        req.flash("warning", "Attention, email et password sont requis!");
        res.redirect("/signin");
    } // verifier que le mail et le mdp correspondent en bdd. 
    userModel
        .findOne({
            email: userInfos.email
        })
        .then(user => {
            console.log("user trouvé par mail >>", user); // verifier que le mail existe en bdd
            if (!user) { // si non, retourner une erreur au client. 
                req.flash("error", "Identifiants incorrects");
                res.redirect("/signin")
            }
            const checkPassword = bcrypt.compareSync(
                userInfos.password,
                user.password
            );
            if (!checkPassword === false) {
                req.flash("error", "Identifiants incorrects");
                res.redirect("/signin")
            }
            const { _doc: clone } = {...user };
            delete clone.password;
            req.session.currentUser = clone;
            console.log(">>>>>", req.session.currentUser)
                //redirection / profile
            res.redirect("/products_manage")
        })
        .catch(next);


});


router.post("/signin", fileUploader.single("avatar"), (req, res, next) => {
    const user = req.body;
    console.log("coucou", req.file)
    if (req.file) {
        user.avatar = req.file.secure_url;
    }
    if (!user.username || !user.password || !user.email) {
        console.log("DANS LE IF")
            // to do : retourner message d'erreur : remplir les champs requis + redirect
        req.flash("error", "Merci de remplir tous les champs.");
        res.redirect("/signin");
    } else {
        userModel.findOne({
                email: user.email
            })
            .then((dbRes) => {
                if (dbRes) { //to do : retourner message d'erreur : utilisateur existant + redirect
                    req.flash("warning", "Désolé, cet email n'est pas disponible.");
                    res.redirect("/signin");
                }
            })
            .catch((dbErr) => console.error(dbErr));
        // si le programe est lu jusqu'ici, on va convertir le mot de passe en chaine cryptée. 
        const salt = bcrypt.genSaltSync(10);
        const hashed = bcrypt.hashSync(user.password, salt);
        console.log("password crypté >>>>>", hashed);
        user.password = hashed;
        // on insère le nouvel utilisateur en bdd.
        userModel
            .create(user)
            .then(dbRes => {
                req.flash("success", "Inscription validée !");
                res.redirect("/signin")
            })
            .catch(next);
    }
});


module.exports = router;