const express = require("express")
const router = express.Router()
const documents = require("../controllers/documents")
const {AuthMiddleware,IsContributor,IsAuthorized} = require("../middlewares")


router.get("/api/documents/join/:document_id",documents.JoinDocument)
router.use(AuthMiddleware)
router.get("/api/documents/create/:document_id",documents.CreateDocument)
router.get("/api/documents",documents.FindDocuments)
router.get("/api/documents/:document_id",[IsContributor],documents.FindDocument)
router.put("/api/documents/:document_id",[IsContributor,IsAuthorized(["creator","editor"])],documents.UpdateDocumentContent) //admin,editor
router.put("/api/documents/saveAs/:document_id",[IsContributor,IsAuthorized(["creator","editor"])],documents.SaveAsDocument) //admin,editor
router.post("/api/documents/SendInvitation/:document_id",[IsContributor,IsAuthorized(["creator"])],documents.SendInvitation) //admin
router.get("/api/documents/GetUserRole/:document_id",[IsContributor],documents.GetUserRole)
router.get("/api/documents/GetDocumentContributors/:document_id",[IsContributor],documents.GetDocumentContributors)








module.exports = router