const jwt = require("jsonwebtoken");
const Users = require("./models/users");
require("dotenv").config()


const AuthMiddleware = async (req,res,next) => {
    try {
        let token;
        // Retrieve token from Authorization header or cookies
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        } else if (req.cookies.JWT) {
            token = req.cookies.JWT; // Extract token from cookies
        }

        if(!token){
            return res.redirect(`/login?message=loggin first&redirect=${encodeURIComponent(req.originalUrl)}`)   
        }

        const payload = jwt.verify(token,process.env.ACCESS_TOKEN_SECERET)
        req.user = payload
        next()

    } catch (error) {
        if(error.name === "JsonWebTokenError"){
            return res.status(400).json({
                status : 400,
                successful : false,
                name : error.name,
                message : error.message

            })  
        }

        if(error.name === "TokenExpiredError"){
            return res.redirect("/login?message=session expired")
        }

        console.log(error);
        res.json(error)   
    }
}




const IsContributor = async (req,res,next) => {
    try {
        const document_id = req.params.document_id
        if(!document_id){
            return res.status(400).json({
                status : 400,
                successful : false,
                message : "document_id parameter is not provided"
            }) 
        }

        const user = await Users.findOne({_id:req.user.id})
        const iscontributor = user.shared_documents.some((document) => document.document_id === document_id)
        if(!iscontributor){
            return res.status(403).json({
                status : 403,
                successful : false,
                message : "you are not document contributor"
            })  
        }
        next()
        
    } catch (error) {
        console.log(error);
        res.json(error)    
    }
}



const IsAuthorized = function (roles) {
    return async (req,res,next) => {

        const document_id = req.params.document_id
        if(!document_id){
            return res.status(400).json({
                status : 400,
                successful : false,
                message : "document_id parameter is not provided"
            }) 
        }



        const user = await Users.findOne({_id:req.user.id})
        const shared_document = user.shared_documents.find((shared_document) => shared_document.document_id === document_id)
        const isauthorized = roles.includes(shared_document.role)


        if(!isauthorized){
            return res.status(403).json({
                status : 403,
                successful : false,
                message : "you are not authorized to do this action"
            })  
        }
        next()
        
    }
}




module.exports = {
    AuthMiddleware,
    IsContributor,
    IsAuthorized
}