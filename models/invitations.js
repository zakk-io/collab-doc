const mongoose = require("mongoose")
const validator = require("validator")


const InvitationSchema = mongoose.Schema({
    email : {
        type : String,
        required : true,
        validate : {
            validator : (value) => validator.isEmail(value), 
            message : "provide valid email address",
        }
    },

    role : {
        type : String,
        enum : ["editor","viewer"],
        required : true
    },

    document_id : {
        type : String,
    },

    token : {
        type : String,
        required : true
    },

    used : {
        type : Boolean,
        default : false
    }

})


const Invitations = mongoose.model("Invitations",InvitationSchema,"invitations")

module.exports = Invitations