# AI-Based Smart Complaint Management System

A full-stack MERN application that allows users to register complaints which are intelligently analyzed by an AI (Gemini) to determine urgency, priority, suggested department, and an auto-generated response.

## Features

- **User Authentication:** JWT-based login and registration.
- **Complaint Registration:** Users can submit complaints with a location, category, and details.
- **AI Analysis:** Automatically uses Gemini to analyze the complaint text and recommend the department (Water, Electricity, Sanitation, etc.) and priority level.
- **Admin Dashboard:** Admins can view all complaints, change statuses to 'Resolved', and delete invalid complaints.
- **Search & Filter:** Search complaints by location and filter by category.
- **Responsive Design:** A premium, dynamic, glassmorphic UI built from scratch using vanilla CSS.

## Tech Stack

- **Frontend:** React.js, Vite, React Router, Axios, Vanilla CSS
- **Backend:** Node.js, Express.js, MongoDB, Mongoose, JWT, bcrypt
- **AI Integration:** Google Gen AI SDK (@google/genai) for processing complaint text
- **Deployment-Ready:** Configurations set up to be deployed seamlessly on Render.

## Folder Structure

```
smart-complaint-system/
├── client/          # React Vite App
│   ├── src/
│   │   ├── components/  # Navbar, reusable elements
│   │   ├── context/     # AuthContext for global state
│   │   ├── pages/       # Dashboard, Login, Register, NewComplaint
│   │   ├── App.jsx      # Main application router
│   │   └── index.css    # Global styling and design system
├── server/          # Node.js/Express Backend
│   ├── controllers/ # authController, complaintController
│   ├── middleware/  # authMiddleware
│   ├── models/      # User.js, Complaint.js
│   ├── routes/      # authRoutes, complaintRoutes
│   ├── index.js     # Entry point
│   └── .env         # Environment Variables
```

## Setup Instructions

### Prerequisites
- Node.js installed
- MongoDB URI
- Google Gemini API Key

### 1. Backend Setup

1. Navigate to the server folder: `cd server`
2. Install dependencies: `npm install`
3. Create a `.env` file (based on `.env.example` or update the existing `.env`):
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   GEMINI_API_KEY=your_gemini_api_key
   NODE_ENV=development
   ```
4. Start the server: `npm start` (or `npm run dev` if you configure nodemon).

### 2. Frontend Setup

1. Navigate to the client folder: `cd client`
2. Install dependencies: `npm install`
3. Start the dev server: `npm run dev`

### 3. Usage

1. Register a new user account.
2. The first user will default to the 'user' role. To test admin features, you can manually change the role to 'admin' directly in your MongoDB database.
3. Submit a new complaint to see the AI analysis in action!

## Deployment (Render)

To deploy to Render using Web Services:
1. Connect your GitHub repository to Render.
2. Use the Root Directory as `server`.
3. Set the Build Command to `npm run build`.
4. Set the Start Command to `npm start`.
5. Add the necessary Environment Variables (MONGO_URI, JWT_SECRET, GEMINI_API_KEY) and set `NODE_ENV=production`.
