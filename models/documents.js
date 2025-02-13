const mongoose = require("mongoose")


const DocumentScama = mongoose.Schema({
    document_id : {
        type : String,
        required : true,
        unique : true
    },


    document_creator : {
        type : mongoose.Types.ObjectId,
        ref : "Users",
    },

    document_name : {
        type : String,
    },

    document_content : {
        type : Object,
    },

    document_contributors : [
        {
            contributor_id : {
                type : mongoose.Types.ObjectId,
                ref : "Users"
            },

            role : {
                type: String,
                enum : ["creator","editor","viewer"],
            }
        }
    ]
})




const Documents = mongoose.model("Documents",DocumentScama,"documents")

module.exports = Documents