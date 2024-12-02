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
        validate(value)
        {
            if(!['male','female','others'].includes(value))
            {
                throw new Error("Gender is not valid")
            }
        }

    },
    photoURL:{
        type:String,
    
    
    },
    about:{
        type:String,
        default:"You have not added about section."
    },
    skills:{
        type:[String],
        validate(value)
        {
            if(value.length>3)
            {
                throw new Error("you cant add more skills")
            }
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