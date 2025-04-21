# FarmWise

FarmWise is a comprehensive platform designed to connect farmers, agricultural experts, and administrators in a collaborative environment. The system facilitates knowledge sharing, problem-solving, and community building within the agricultural sector.

![FarmWise Home Page](/screenshots/homepage.png)


## 🌱 Overview

FarmWise serves as a bridge between farmers seeking advice and experts willing to share their knowledge. The platform offers a range of features including blog posts, discussion forums, and direct messaging, all managed through a robust administrative system.

## 📱 Portal Screenshots

### User Dashboard
![User Dashboard](/screenshots/dashboard.png)

### Blog Interface
![Blog Interface](/screenshots/blog.png)

### Discussion Forum
![Discussion Forum](/screenshots/forum.png)

### Admin Panel
![Admin Panel](/screenshots/admin.png)

## 🚀 Features

### For Farmers
- Create and manage profile with farm-specific information
- Post blogs about farming experiences and practices
- Ask questions in discussion forums
- Connect with agricultural experts
- Access expert advice and best practices

### For Experts
- Showcase expertise and credentials
- Share knowledge through blog posts
- Answer farmers' questions
- Provide feedback on farming practices
- Connect with the farming community

### For Administrators
- Manage user accounts
- Moderate content across the platform
- Generate system reports
- Configure system settings
- Maintain platform integrity

## 💻 System Architecture

FarmWise is built with a modern MERN stack architecture consisting of several integrated components:

### Core Components
1. **User Registration & Login System**
   - User authentication and authorization
   - Profile management

2. **Blog Management System**
   - Creation, editing, and viewing of blog posts
   - Commenting functionality

3. **Discussion Forum**
   - Thread creation and management
   - Reply functionality

4. **Messaging System**
   - Direct communication between users
   - Notification management

5. **Admin Management Panel**
   - User oversight
   - Content moderation
   - System monitoring

### Data Management
- User profiles and credentials
- Blog content and metadata
- Discussion threads and replies
- Message logs
- System activity logs

## 🛠️ Technology Stack

- **Frontend**: 
  - React.js
  - Redux for state management
  - React Router for navigation
  - Material-UI/Bootstrap for UI components
  - Axios for API requests

- **Backend**: 
  - Node.js
  - Express.js framework
  - JWT for authentication
  - Socket.io for real-time messaging

- **Database**: 
  - MongoDB
  - Mongoose ODM

- **Deployment**: 
  - Heroku/Vercel/AWS
  - Docker containers

- **Version Control**: 
  - Git & GitHub

- **Additional Libraries**: 
  - Formik/React Hook Form for form handling
  - Chart.js/D3.js for admin analytics
  - Cloudinary for image uploads

## 📋 Installation

### Prerequisites
- Node.js (v14.x or higher)
- MongoDB (v4.x or higher)
- npm (v6.x or higher)

### Setup Instructions

1. Clone the repository:
   ```
   git clone https://github.com/Rushi992145/FarmWise.git
   ```

2. Navigate to the project directory:
   ```
   cd FarmWise
   ```

3. Install dependencies for both backend and frontend:
   ```
   # Install backend dependencies
   npm install
   
   # Install frontend dependencies
   cd client
   npm install
   cd ..
   ```

4. Configure environment variables:
   ```
   # Create .env file in the root directory
   cp .env.example .env
   
   # Edit .env with your configuration
   ```

5. Start the development servers:
   ```
   # Run both frontend and backend (from root directory)
   npm run dev
   
   # Or run them separately
   npm run server
   npm run client
   ```

6. Access the application:
   - Backend API: http://localhost:5000
   - Frontend: http://localhost:3000

## 🔧 Configuration

The application can be configured through environment variables in the `.env` file:

```
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Connection
MONGO_URI=mongodb://localhost:27017/farmwise

# Authentication
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=30d

# Email Configuration (optional)
EMAIL_SERVICE=gmail
EMAIL_USERNAME=your_email@gmail.com
EMAIL_PASSWORD=your_email_password

# Cloud Storage (optional)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## 👥 Contributing

We welcome contributions to FarmWise! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Contact

Project Link: [https://github.com/Rushi992145/FarmWise](https://github.com/Rushi992145/FarmWise)
