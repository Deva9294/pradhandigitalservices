# Pradhan Digital Services

India's Complete Digital Seva Portal - A comprehensive platform for government services, job vacancies, recharge, bill payments, and offline form downloads.

## 🚀 Features

### User Features
- **Government Services**: Apply for Aadhaar, PAN, Passport, Certificates, and more
- **Job Vacancies**: Browse and apply for government job vacancies across India
- **Offline Forms**: Download government forms securely for a small fee
- **Recharge & Bill Payment**: Mobile recharge, DTH recharge, and bill payments
- **Bilingual Support**: English and Hindi language support
- **User Dashboard**: Track bookings, wallet balance, and download history
- **Secure Authentication**: Phone and email-based login/registration

### Admin Features
- **Service Management**: Add, update, and manage government services
- **Booking Management**: Process and track service bookings
- **User Management**: Manage users and their activities
- **Vacancy Management**: Post and update job vacancies
- **Analytics**: View platform statistics and user activity

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State Management**: React Context API
- **Theme**: next-themes (Dark/Light mode)

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer
- **Payment**: Razorpay (integration ready)
- **Email**: Nodemailer
- **Cloud Storage**: Cloudinary (integration ready)

## 📁 Project Structure

```
pradhandigitalservices/
├── backend/
│   ├── src/
│   │   ├── middleware/       # Auth, error handling
│   │   ├── models/           # MongoDB models
│   │   ├── routes/           # API routes
│   │   ├── utils/            # Database connection
│   │   └── index.js          # Server entry point
│   ├── uploads/              # File uploads
│   ├── .env.example          # Environment variables template
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── app/              # Next.js pages
│   │   ├── components/       # React components
│   │   ├── contexts/         # Context providers
│   │   ├── data/             # Static data
│   │   └── lib/              # Utilities
│   ├── public/               # Static assets
│   └── package.json
└── README.md
```

## 🚦 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd pradhandigitalservices
```

2. **Install dependencies**
```bash
# Install all dependencies (both frontend and backend)
npm run install:all

# Or install separately
cd backend && npm install
cd ../frontend && npm install
```

3. **Configure environment variables**

Create `.env` file in the backend directory:
```bash
cd backend
cp .env.example .env
```

Update the `.env` file with your configuration:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/pradhandigitalservices
JWT_SECRET=your-super-secret-jwt-key-change-in-production
FRONTEND_URL=http://localhost:3000

# Optional: For payment integration
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Optional: For file uploads
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

4. **Start MongoDB**
```bash
 # If using local MongoDB
mongod

# Or use MongoDB Atlas (cloud)
# Update MONGODB_URI in .env with your connection string
```

5. **Run the application**

Development mode (both frontend and backend):
```bash
npm run dev
```

Or run separately:
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

6. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- API Health Check: http://localhost:5000/api/health

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Services
- `GET /api/services` - Get all services
- `GET /api/services/:slug` - Get single service
- `POST /api/services` - Create service (admin)
- `PUT /api/services/:id` - Update service (admin)
- `DELETE /api/services/:id` - Delete service (admin)

### Bookings
- `POST /api/bookings` - Create booking (protected)
- `GET /api/bookings` - Get user bookings (protected)
- `GET /api/bookings/:id` - Get single booking (protected)
- `PUT /api/bookings/:id/status` - Update booking status (admin)

### Users
- `PUT /api/users/profile` - Update profile (protected)
- `PUT /api/users/password` - Update password (protected)

### Recharge
- `GET /api/recharge/providers` - Get recharge providers
- `POST /api/recharge/mobile` - Mobile recharge (protected)
- `POST /api/recharge/dth` - DTH recharge (protected)
- `GET /api/recharge/plans` - Get recharge plans

### Vacancies
- `GET /api/vacancies` - Get all vacancies
- `GET /api/vacancies/:slug` - Get single vacancy
- `POST /api/vacancies` - Create vacancy (admin)
- `PUT /api/vacancies/:id` - Update vacancy (admin)
- `DELETE /api/vacancies/:id` - Delete vacancy (admin)

### Forms
- `GET /api/forms` - Get offline forms
- `GET /api/forms/:id` - Get single form
- `POST /api/forms/submit` - Submit form application (protected)

### Upload
- `POST /api/upload` - Upload single file (protected)
- `POST /api/upload/multiple` - Upload multiple files (protected)

## 🎨 Frontend Pages

- `/` - Home page with hero section and service overview
- `/services` - Browse all government services
- `/services/:slug` - Service detail page
- `/vacancies` - Government job vacancies
- `/offline-forms` - Download offline forms
- `/offline-forms/:slug` - Form detail and payment
- `/recharge` - Mobile and DTH recharge
- `/news` - Latest news and updates
- `/contact` - Contact page
- `/login` - Login/Register page
- `/dashboard` - User dashboard

## 🔐 Authentication

The application uses JWT-based authentication. Protected routes require a valid JWT token in the Authorization header:

```javascript
headers: {
  'Authorization': `Bearer ${token}`
}
```

## 🌐 Deployment

### Frontend (Vercel)
```bash
cd frontend
npm run build
vercel
```

### Backend (Render/Heroku)
```bash
cd backend
# Set environment variables in your hosting platform
npm start
```

## 📝 Environment Variables

### Required
- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT token generation
- `FRONTEND_URL` - Frontend URL for CORS

### Optional
- `RAZORPAY_KEY_ID` - Razorpay API key
- `RAZORPAY_KEY_SECRET` - Razorpay secret key
- `CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name
- `CLOUDINARY_API_KEY` - Cloudinary API key
- `CLOUDINARY_API_SECRET` - Cloudinary API secret
- `SMTP_HOST` - SMTP server host
- `SMTP_PORT` - SMTP server port
- `SMTP_USER` - SMTP username
- `SMTP_PASS` - SMTP password

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Support

For support, email support@pradhandigital.com or contact via WhatsApp.

## ⚠️ Disclaimer

This platform is a facilitation service for government services. We are not affiliated with any government agency. All services are processed through official government portals. Users are advised to verify information from official sources.

---

**Built with ❤️ for Digital India**
