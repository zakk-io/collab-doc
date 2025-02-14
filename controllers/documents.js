const Documents = require("../models/documents")
const Users = require("../models/users")
const Invitations = require("../models/invitations")
const crypto = require("crypto")
const nodemailer = require("nodemailer")





const CreateDocument = async (req,res) => {
    try {
        const document_id = req.params.document_id
        if(!document_id){
            return res.status(400).json({
                status : 400,
                successful : false,
                message : "document_id parameter is not provided"
            }) 
        }

        const document = await Documents.findOne({document_id})
        if(!document){
            const document = await new Documents({
                document_id,
                document_creator : req.user.id,
            }).save()
            
            const user = await Users.findOne({_id:req.user.id})

            document.document_contributors.push({
                contributor_id : user._id,
                role : "creator",
            })
            await document.save()

            user.shared_documents.push({
                document_id : document_id,
                role : "creator",
            })
            await user.save()

            return res.status(200).json({
                status : 200,
                successful : true,
                message : "new document has been created"
            }) 
        }

        return res.status(200).json({
            status : 200,
            successful : true,
            message : "document already exists"
        }) 

    } catch (error) {
        console.log(error);
        return res.json(error)
    }
}


const FindDocument = async (req,res) => {
    try {
        const document_id = req.params.document_id
        if(!document_id){
            return res.status(400).json({
                status : 400,
                successful : false,
                message : "document_id parameter is not provided"
            }) 
        }

        const document = await Documents.findOne({document_id})
            .populate("document_contributors.contributor_id" , "username email")
            .populate("document_creator" , "username email")

    
        return res.status(200).json({
            status : 200,
            successful : true,
            document
        }) 

    } catch (error) {
        console.log(error);
        return res.json(error)
    }
}


const FindDocuments = async (req,res) => {
    try {

        const documents = await Documents.find({
            $or : [
                {document_creator : req.user.id},
                {"document_contributors.contributor_id" : req.user.id}
            ]
        })
        .populate("document_contributors.contributor_id" , "username email")
        .populate("document_creator" , "username email")

    
        return res.status(200).json({
            status : 200,
            successful : true,
            documents
        }) 

    } catch (error) {
        console.log(error);
        return res.json(error)
    }
}


const UpdateDocumentContent = async (req,res) => {
    try {
        const document_id = req.params.document_id
        if(!document_id){
            return res.status(400).json({
                status : 400,
                successful : false,
                message : "document_id parameter is not provided"
            }) 
        }

        const content = req.body.content
        const document = await Documents.findOneAndUpdate(
            { document_id : document_id}, 
            { $set: { document_content: content } },
            { runValidators: true } 
        );

        if(!document){
            return res.status(404).json({
                status : 404,
                successful : false,
                message : "document not found!"
            })   
        }

        return res.status(200).json({
            status : 200,
            successful : true,
            message : "document has been updated"
        })
        
    } catch (error) {
        console.log(error);
        return res.json(error)
    }
}



const SaveAsDocument = async (req,res) => {
    try {
        const document_id = req.params.document_id
        if(!document_id){
            return res.status(400).json({
                status : 400,
                successful : false,
                message : "document_id parameter is not provided"
            }) 
        }

        const name = req.body.name
        const document = await Documents.findOneAndUpdate(
            { document_id : document_id}, 
            { $set: { document_name: name } },
            { runValidators: true } 
        );

        if(!document){
            return res.status(404).json({
                status : 404,
                successful : false,
                message : "document not found!"
            })   
        }

        return res.status(200).json({
            status : 200,
            successful : true,
            message : "document has been saved"
        })



    } catch (error) {
        console.log(error);
        return res.json(error)
    }
}



const SendInvitation = async (req,res) => {
    try {
        const email = req.body.email
        const user = await Users.findOne({email})

        const role = req.body.role
        const token = crypto.randomUUID()

        const document_id = req.params.document_id
        if(!document_id){
            return res.status(400).json({
                status : 400,
                successful : false,
                message : "document_id parameter is not provided"
            }) 
        }

        const document = await Documents.findOne({document_id})
        .populate("document_creator","email")

        if(!document){
            return res.status(404).json({
                status : 404,
                successful : false,
                message : "document not found!"
            })    
        }


        const invitation = await Invitations.findOne({ 
            email : email,
            document_id : document_id,
            used : true 
        })
       
        if(invitation || document.document_creator.email === email){
            return res.status(400).json({
                status : 400,
                successful : false,
                message : "user is already document contributor"
            })  
        }

        await new Invitations({
            document_id,
            email,
            role,
            token
        }).save()


        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'mozakk.io@gmail.com', 
                pass: process.env.EMAIL_APP_PASSWORD, 
            },
        });


        const InvitationLink = `https://collab-doc-x5xr.onrender.com/api/documents/join/${document_id}/?token=${token}`
        const mailOptions = {
            from: 'mozakk.io@gmail.com',
            to: req.body.email,
            subject: 'document invitation', 
            text: `Hello my friend ${email},  ${req.user.email} invited you to contribute on zakk.io | click the link ${InvitationLink}`, 
        };
        
        
        await transporter.sendMail(mailOptions)
        return res.status(200).json({
            status: 200,
            successful: true,
            message: "invitation has been sent successfully",
        })


    } catch (error) {
        console.log(error);
        return res.json(error)   
    }
}




const JoinDocument = async (req,res) => {
    try {
    const token = req.query.token
    const document_id = req.params.document_id

    if(!document_id){
        return res.status(400).json({
            status : 400,
            successful : false,
            message : "document_id parameter is not provided"
        }) 
    }

    const document = await Documents.findOne({document_id})
    if(!document){
        return res.status(404).json({
            status : 404,
            successful : false,
            message : "document not found!"
        })    
    }

    const invitation = await Invitations.findOne({
        document_id:document_id, //no idor
        token : token, //no frud
        used : false //no reuseing 
    })
            

    if(!invitation){
        return res.status(403).json({
            status: 403,
            successful: false,
            message: "invitation invalid or expired",
        })
    }

    const email = invitation.email
    const role = invitation.role
    
    const user = await Users.findOne({email:email})

    const InvitationLink = `/api/documents/join/${document_id}/?token=${token}`
    if(!user){
        return res.redirect(`/register?redirect=${InvitationLink}`)
    }

    document.document_contributors.push({
        contributor_id : user._id,
        role
    })
    await document.save()

    user.shared_documents.push({
        document_id,
        role
    })
    await user.save()

    invitation.used = true
    await invitation.save()

    await Invitations.deleteMany({
        document_id, 
        email : email,
        used : false
    })

    return res.redirect(`/documents/?document_id=${document_id}`)
           
    } catch (error) {
        console.log(error);
        res.json(error)  

    }
}



const GetDocumentContributors = async (req,res) => {
    try {
        const document_id = req.params.document_id
        if(!document_id){
            return res.status(400).json({
                status : 400,
                successful : false,
                message : "document_id parameter is not provided"
            }) 
        }

        const document = await Documents.findOne({document_id})
        .select("document_contributors")
        .populate("document_contributors.contributor_id" , "email user_avatar role")

        if(!document){
            return res.status(404).json({
                status : 404,
                successful : false,
                message : "document is not found"
            }) 
        }
        
        return res.status(200).json({
            status: 200,
            successful: true,
            document_contributors: document.document_contributors,
        }) 

    } catch (error) {
        console.log(error);
        res.json(error)  
    }
}


const GetUserRole = async (req,res) => {
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
        const shared_document = user.shared_documents.find((shared_document) => shared_document.document_id === document_id)
        
        return res.status(200).json({
            status: 200,
            successful: true,
            role: shared_document.role,
        }) 

    } catch (error) {
        console.log(error);
        res.json(error)   
    }
}



module.exports = {
    CreateDocument,
    FindDocument,
    FindDocuments,
    UpdateDocumentContent,
    SaveAsDocument,
    SendInvitation,
    JoinDocument,
    GetDocumentContributors,
    GetUserRole
}

