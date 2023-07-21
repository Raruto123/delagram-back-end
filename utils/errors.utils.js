//pour bonifier les erreurs et spécifier celle-ci aux utilisateurs
module.exports.signUpErrors = (err) => {
    let errors = {pseudo : "", email : "", password:""}

    if (err.message.includes("pseudo")) {
        errors.pseudo = "Pseudo incorrect"
    }; 
    if (err.message.includes("email")) {
        errors.email = "Email incorrect"
    };
    if (err.message.includes("password")) {
        errors.password = "Le mot de passe doit faire 6 caractères minimum"
    };
    if (err.code == 11000 && Object.keys(err.keyValue)[0].includes("pseudo")) {
        errors.pseudo = "Pseudo est déjà pris "
    };
    return errors
}

module.exports.signInErrors = (err) => {
    let errors = {email : "", password : ""}

    if (err.message.includes("email")) {
        errors.email = "Email inconnu"
    }
    if (err.message.includes("password")) {
        errors.password = "Le mot de passe ne correspond pas"
    }

    return errors
}

module.exports.uploadErrors = (err) => {
    let errors = {format : "", maxSize : ""};

    if (err.message.includes("fichier invalide")) {
        errors.format = "Format incompatible";
    };
    
    if (err.message.includes("max size")) {
        errors.maxSize = "le fichier dépasse 500ko"
    }

    return errors



}