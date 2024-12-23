const mongoose=require("mongoose")
const validator=require("validator")
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")
const userSchema= new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        minLength:3,
        maxLength:40
    },
    lastName:{
        type:String,
        required:true,
        minLength:3,
        maxLength:40
    },
    emailId:{
        type:String,
        required:true,
        lowercase:true,
        unique:true,
        validate(value)
        {
            if(!validator.isEmail(value))
            {
                throw new Error("invalid emailId"+value)
            }
        }
    },
    password:{
        type:String,
        required:true,
    },
    age:{
        type:Number,
        min:18
    },
    gender:{
        type:String,
        enum: {
            values: ["Male", "Female", "Other"],
            message: `{VALUE} is not a valid gender type`,
          },

    },
    photoURL:{
        type:String,
    
    
    },
    about: {
        type: String,
        default: "have not added about section.",
        validate(value) {
            const wordCount = value.trim().split(/\s+/).length;
            if (wordCount > 50) {
                throw new Error("The about section cannot exceed 100 words.");
            }
        },
    },
    skills: {
        type: [String],
        validate: {
          validator: function(value) {
            if (value.length > 3) {
              throw new Error("You can't add more than 3 skills");
            }
            return true; // Return true if validation passes
          },
          message: "You can't add more than 3 skills"
        }
    }

},{
    timestamps:true
})
userSchema.methods.verifyPassword= async function (password)
{
    const user =this
    const isValidPassword=await bcrypt.compare(password,user.password)

    return isValidPassword
}
userSchema.methods.getJWT=async function ()
{
    const user =this;
    const token=jwt.sign({_id:user._id},"sandeep1@13",{expiresIn: "1d"});
    return token;
}
const User=mongoose.model("User",userSchema)

module.exports=User