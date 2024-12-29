const validator = require("validator")

const validateSignUpFeild = (body) => {
    const { firstName, lastName, emailId, password } = body

    if (!firstName) {
        throw new Error("Enter your FirstName");
    }
    else if(!lastName)
    {
        throw new Error("Enter your LastName");
    }
    else if (!firstName > 3 || !firstName > 40) {
        throw new Error("FirstName characters should be in the range 3-40")
    }
    else if (!validator.isEmail(emailId)) {
        throw new Error("Invalid Email Id")
    }
    else if (!validator.isStrongPassword(password)) {
        throw new Error("Please Enter Strong password")
    }
}

const validateEditProfileData = (req) => {
    const editableFeild = ["firstName", 'lastName', 'age', 'gender', 'about', 'skills', 'photoURL']
    const isEditableFeild = Object.keys(req.body).every(feild => editableFeild.includes(feild));
    return isEditableFeild

}

module.exports = { validateSignUpFeild, validateEditProfileData }