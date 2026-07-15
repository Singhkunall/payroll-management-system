# PayLynx - Full-Stack Payroll & Workforce Management System

A full-stack payroll management system built with the MERN stack, featuring role-based dashboards for Admin and Employee users.

## Live Demo
- Frontend: https://payroll-management-system-virid.vercel.app
- Backend: https://payroll-management-system-24nu.onrender.com

## Features
- **Authentication**: Secure JWT-based login/signup with bcrypt password hashing
- **Role-Based Access Control**: Separate dashboards and permissions for Admin and Employee roles
- **Employee Management**: Admin can add, edit, and manage employee records
- **Department & Designation Management**
- **Attendance Tracking**
- **Leave Management**: Apply, track, and approve/reject leave requests
- **Update Request Workflow**: Employees can request changes to sensitive data (bank details, contact info), which Admins review and approve/reject
- **Password Reset**: Email-based password reset flow using Nodemailer

## Tech Stack

**Frontend:**
- React.js
- Vite
- Tailwind CSS
- React Router
- Axios
- React Hot Toast

**Backend:**
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- bcrypt.js
- Nodemailer

**Deployment:**
- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas

## Project Structure

payroll-system/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── index.js
└── frontend/
└── src/
├── pages/
├── components/
└── api/

## Getting Started

### Prerequisites
- Node.js installed
- MongoDB Atlas account (or local MongoDB)

### Installation

1. Clone the repository
```bash
git clone https://github.com/Singhkunall/payroll-management-system.git
cd payroll-management-system
```

2. Backend setup
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder with:
PORT=4000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email
EMAIL_PASS=your_email_app_password

Run the backend:
```bash
npm run dev
```

3. Frontend setup
```bash
cd frontend
npm install
npm run dev
```

## Author
**Kunal Kumar**
- GitHub: [@Singhkunall](https://github.com/Singhkunall)
- LinkedIn: [Kunal Kumar](https://www.linkedin.com/in/kunal-kumar-3636ba2b1)