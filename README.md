# Unique Wear E-Commerce

Welcome to the Unique Wear e-commerce platform. This project consists of a Next.js 15 frontend and an Express/Node.js backend with MongoDB.

## Local Setup & Connecting Database

### 1. Database Connection
By default, the backend is configured to connect to a local MongoDB instance at `mongodb://localhost:27017/uniquewear`.
If you want to use MongoDB Atlas (Internet Database):
1. Create a cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Get your connection string (URI).
3. Open `backend/.env` and replace `MONGO_URI` with your Atlas URI.

### 2. Run Backend
```bash
cd backend
npm install
npm run dev
```

### 3. Run Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## Pushing to GitHub

To push your newly created website to GitHub, follow these steps in your terminal:

```bash
# Initialize git in the root folder (if not already done)
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial commit for Unique Wear E-commerce"

# Link to your GitHub repository (replace with your URL)
git remote add origin https://github.com/yourusername/unique-wear.git

# Push to GitHub
git push -u origin main
```

---

## Deployment on the Internet

### 1. Deploying the Backend (Render.com)
1. Push your code to GitHub.
2. Go to [Render.com](https://render.com/) and create a new **Web Service**.
3. Connect your GitHub repository and select the `backend` folder as the Root Directory.
4. Set the Build Command to `npm install` and the Start Command to `node server.js`.
5. Add all Environment Variables from your `backend/.env` file into Render's Environment Variables section.
6. Click **Deploy**. Render will provide you with a backend URL (e.g., `https://unique-wear-backend.onrender.com`).

### 2. Deploying the Frontend (Vercel.com)
1. Go to [Vercel](https://vercel.com/) and click **Add New Project**.
2. Import your GitHub repository.
3. In the project settings, set the **Root Directory** to `frontend`.
4. Ensure the Framework Preset is detected as **Next.js**.
5. Add any necessary environment variables (e.g., `NEXT_PUBLIC_API_URL` pointing to your Render backend URL).
6. Click **Deploy**. Vercel will give you a live URL for your frontend!

### 3. Testing Razorpay Payments
For payments, the backend integrates Razorpay. You will need to create an account on [Razorpay](https://razorpay.com/), get your test API keys (`Key ID` and `Key Secret`), and place them in your `backend/.env` file.
