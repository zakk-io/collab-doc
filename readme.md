# CollabDoc - Real-time Document Collaboration Platform 
https://collab-doc-x5xr.onrender.com

CollabDoc is a full-stack web application that enables real-time document collaboration with role-based access control. Built with Node.js and Express, it provides a secure and intuitive platform for teams to create, edit, and manage documents together.



## 📸 Screenshots

### Document Editor Interface
![Document Editor Interface](/screenshots/quill.png)


### Collaboration Features
[![CollabDoc Demo](https://img.youtube.com/vi/f0vqy7ky5p4/maxresdefault.jpg)](https://youtu.be/f0vqy7ky5p4)

you can invite users by email to contribute in the same document , also
as document creator you can give users different roles such as editor and viewer
![Collaboration Demo](/screenshots/roles.png)


### Recent Documents
https://collab-doc-x5xr.onrender.com
![Editor Interface](/screenshots/list_documents.png)

### User Management
https://collab-doc-x5xr.onrender.com/register
![User Dashboard](/screenshots/register.png)



## 🤝 Contributing

This project was developed as part of my internship application to demonstrate my skills in:
- Backend Development with Node.js
- Database Management
- Security Best Practices


## 🚀 Key Features

- **Real-time Document Collaboration**: Multiple users can view and edit documents simultaneously
- **Role-Based Access Control**: Granular permissions with creator, editor, and viewer roles
- **Secure Authentication**: Complete user authentication system with JWT
- **Email Invitations**: Share documents with team members via email invitations
- **Document Management**: Create, edit, save, and organize documents efficiently


## 💻 Technology Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Email Service**: Nodemailer with Gmail SMTP
- **Security**: Crypto for token generation



## 🔐 API Endpoints

### Authentication
```
POST /api/auth/register - Register new user
POST /api/auth/login   - User login
```

### Document Management
```
GET    /api/documents/create/:document_id     - Create new document
GET    /api/documents                        - Get all user documents
GET    /api/documents/:document_id           - Get specific document
PUT    /api/documents/:document_id           - Update document content
PUT    /api/documents/saveAs/:document_id    - Save document with name
POST   /api/documents/SendInvitation/:document_id - Invite collaborators
GET    /api/documents/join/:document_id      - Join document (via invitation)
GET    /api/documents/GetUserRole/:document_id - Get user's role
GET    /api/documents/GetDocumentContributors/:document_id - Get contributors
```







