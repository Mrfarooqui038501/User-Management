# 👥 User Management App

A full-stack **User Management** application built with **React**, **Express**, **Sequelize (PostgreSQL)**, and **Cloudinary** for profile image uploads.

This app allows creating, updating, deleting, and viewing users, with profile images stored in Cloudinary. It also includes follow/unfollow functionality between users.

---

## ✨ Features

- ✅ Create, read, update, and delete users (CRUD operations)
- 📸 Upload profile images via **Cloudinary**
- 👥 Follow and unfollow users
- 📊 Display users along with their followers and following
- 🎨 Frontend built with **React** and styled using **Tailwind CSS**
- ⚡ Backend built with **Express**, **Sequelize**, and **PostgreSQL**

---

## 🛠️ Tech Stack

### Frontend
- React
- Tailwind CSS
- Axios

### Backend
- Node.js
- Express
- PostgreSQL
- Sequelize ORM

### Services
- Cloudinary (File Upload)
- Railway (Database Hosting)

### Utilities
- dotenv
- multer
- cors

---

## 📁 Project Structure

```
User-Management/
│
├── backend/
│   ├── config/
│   │   └── db.js                 # Database connection
│   ├── controllers/
│   │   └── userController.js     # CRUD and follow/unfollow logic
│   ├── models/
│   │   ├── User.js               # User model
│   │   └── Follower.js           # Follower model
│   ├── routes/
│   │   ├── userRoutes.js         # User API routes
│   │   └── uploadRoutes.js       # File upload route (Cloudinary)
│   ├── uploads/                  # Temporary upload folder
│   ├── server.js                 # Express server
│   ├── .env                      # Environment variables
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── CreateUser.jsx    # Create user form
│   │   │   ├── UserList.jsx      # Display all users
│   │   │   └── ...
│   │   ├── utils/
│   │   │   ├── api.js            # Axios instance
│   │   │   └── upload.js         # Image upload logic
│   │   ├── App.jsx               # Main app component
│   │   └── main.jsx              # Entry point
│   ├── public/
│   ├── package.json
│   └── tailwind.config.js
│
└── README.md
```

---

## 🚀 Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database
- Cloudinary account
- Git

---

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Mrfarooqui038501/User-Management.git
cd user-management-app
```

---

### 2️⃣ Backend Setup

#### Navigate to backend folder:
```bash
cd backend
```

#### Install dependencies:
```bash
npm install
```

#### Create `.env` file:
Create a `.env` file in the `backend` root directory with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DATABASE_URL=postgresql://username:password@host:port/database

# Cloudinary Configuration
CLOUD_NAME=your_cloud_name
CLOUD_API_KEY=your_api_key
CLOUD_API_SECRET=your_api_secret

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

#### Start the backend server:
```bash
npm run dev
```

✅ Backend server will run on **http://localhost:5000**

---

### 3️⃣ Frontend Setup

#### Navigate to frontend folder:
```bash
cd ../frontend
```

#### Install dependencies:
```bash
npm install
```

#### Update API base URL (if needed):
Edit `src/utils/api.js` to ensure it points to your backend:

```javascript
export const API = axios.create({
  baseURL: "http://localhost:5000/api",
});
```

#### Start the React app:
```bash
npm run dev
```

✅ Frontend will run on **http://localhost:5173**

---

## 📖 Usage

1. Open **http://localhost:5173** in your browser

2. **Create a new user:**
   - Fill out the form with:
     - Name
     - Email
     - Phone
     - Date of Birth
     - Profile Image (optional)
   - Click **"Create User"**

3. **View users:**
   - See the list of all users
   - View their followers and following

4. **Follow/Unfollow users:**
   - Click follow button to follow a user
   - Click unfollow button to unfollow

5. **Update/Delete users:**
   - Edit user information
   - Delete users from the system

---

## 🌐 API Endpoints

### User Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/users` | GET | Get all users with followers/following |
| `/api/users/:id` | GET | Get user by ID |
| `/api/users` | POST | Create a new user |
| `/api/users/:id` | PUT | Update a user |
| `/api/users/:id` | DELETE | Delete a user |
| `/api/users/follow` | POST | Follow a user |
| `/api/users/unfollow` | POST | Unfollow a user |

### Upload Endpoint

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/upload` | POST | Upload profile image to Cloudinary |

### Health Check

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Check server status |

---

## 📦 Dependencies

### Backend Dependencies

```json
{
  "express": "^4.18.2",
  "sequelize": "^6.35.0",
  "pg": "^8.11.3",
  "pg-hstore": "^2.3.4",
  "multer": "^1.4.5-lts.1",
  "cloudinary": "^1.41.0",
  "dotenv": "^16.3.1",
  "cors": "^2.8.5"
}
```

### Frontend Dependencies

```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "axios": "^1.6.0",
  "tailwindcss": "^3.3.5"
}
```

---

## 🔐 Environment Variables

### Backend (.env)

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment mode | `development` or `production` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:port/db` |
| `CLOUD_NAME` | Cloudinary cloud name | `your_cloud_name` |
| `CLOUD_API_KEY` | Cloudinary API key | `123456789012345` |
| `CLOUD_API_SECRET` | Cloudinary API secret | `your_secret_key` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:5173` |

---

## 📸 Cloudinary Integration

All profile images are uploaded to **Cloudinary** using the `/api/upload` endpoint.

### How it works:
1. User selects an image in the frontend
2. Image is sent to backend `/api/upload` endpoint
3. Backend uploads to Cloudinary using Multer
4. Cloudinary returns a secure URL
5. URL is stored in PostgreSQL database
6. Temporary file is deleted from server

### Setup Cloudinary:
1. Create account at [cloudinary.com](https://cloudinary.com)
2. Get your credentials from Dashboard
3. Add credentials to `.env` file

---

## 🗄️ Database Schema

### User Model
```javascript
{
  id: INTEGER (Primary Key),
  name: STRING (Required),
  email: STRING (Unique, Required),
  phone: STRING (Required),
  dob: DATE (Required),
  image_url: STRING (Optional),
  createdAt: TIMESTAMP,
  updatedAt: TIMESTAMP
}
```

### Follower Model
```javascript
{
  id: INTEGER (Primary Key),
  follower_id: INTEGER (Foreign Key → User),
  following_id: INTEGER (Foreign Key → User),
  createdAt: TIMESTAMP,
  updatedAt: TIMESTAMP
}
```

---

## 🐛 Troubleshooting

### CORS Error
- Ensure backend CORS is configured with your frontend URL
- Check `server.js` has correct origin in CORS settings

### Database Connection Error
- Verify `DATABASE_URL` in `.env` is correct
- Ensure PostgreSQL server is running
- Check network connectivity

### Cloudinary Upload Error
- Verify Cloudinary credentials in `.env`
- Check file size (max 5MB)
- Ensure file type is image (JPEG, PNG, GIF)

### Image Not Uploading
- Check backend logs for errors
- Verify `uploads/` folder exists in backend
- Ensure proper file permissions

---

## 📝 Notes

- ⚠️ Make sure PostgreSQL database is running before starting backend
- 🔒 Never commit `.env` file to version control
- 🌐 CORS is configured for `http://localhost:5173` by default
- 📁 Cloudinary credentials must be valid for uploads to work
- 🔄 Backend uses `sequelize.sync({ alter: true })` to auto-update schema

---

## 🚧 Future Enhancements

- [ ] Add authentication (JWT)
- [ ] Add pagination for user list
- [ ] Add search and filter functionality
- [ ] Add user profile page
- [ ] Add email notifications
- [ ] Add password reset functionality
- [ ] Deploy to production (Vercel + Railway)

---

## 👨‍💻 Author

**Arman Farooqui**

- Email: armanfarooqui078601@gmail.com
- GitHub: [@armanfarooqui](https://github.com/Mrfarooqui038501/User-Management.git)

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## ⭐ Show Your Support

Give a ⭐️ if this project helped you!

---

## 📞 Support

For support, email armanfarooqui078601@gmail.com or create an issue in the repository.

---

<div align="center">
  <p>Made with ❤️ by Arman Farooqui</p>
  <p>© 2025 User Management App. All rights reserved.</p>
</div># User-Management
