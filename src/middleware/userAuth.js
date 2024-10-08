const userAuth=(req,res,next)=>
    {
        const token="xyz"
        const isUser=token==="xyz"
    
        if(!isUser)
        {
            res.status(401).send("unauthorized user")
        }
        else{
            next()
        }
    }

 module.exports={userAuth}   