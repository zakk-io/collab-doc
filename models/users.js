const mongoose = require("mongoose")
const validator = require("validator")


const UserSchema = mongoose.Schema(
    {
        email : {
            type : String,
            required : true,
            maxlength : 100,
            unique : true,
            validate : {
                validator : (value) => validator.isEmail(value), 
                message : "provide valid email address",
            }
        },

        password : {
            type : String,
            required : true,
            maxlength : 255,  
        },

        user_avatar : {
            type : String,
            required : true,
        },

        shared_documents : [
            {
                document_id : {type:String,ref:"Documents"},
                role : {
                    type: String,
                    enum : ["creator","editor","viewer"],
                }
            }
        ]
    }
)

const Users = mongoose.model("Users",UserSchema,"users")

module.exports = Users