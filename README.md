
📝 Survey App - Full Stack Application
This is a full-stack web application for creating, distributing, and analyzing surveys. It consists of:

📦 Backend: Python Flask

🎨 Frontend: React

📧 Email-based survey sharing

📊 CSV export/import for survey results



🔧 Project Setup
📁 Folder Structure
csharp
Copy
Edit
levo-survey-app/
│
├── backend/          # Flask backend
│   ├── app.py
│   ├── routes/
│   ├── models/
│   ├── config.py
│   └── ...
│
├── frontend/         # React frontend
│   ├── public/
│   ├── src/
│   └── ...
│
├── README.md
└── ...



🚀 Backend Setup (Flask)
📌 Prerequisites
    1.Python 3.8+
    2.pip
    3.virtualenv (optional but recommended)

🔨 Steps
1. Navigate to backend folder:
   cd backend
2.Create virtual environment:
   python -m venv venv
   .\venv\Scripts\activate

3.Install dependencies:
 pip install -r requirements.txt

4. Configure environment variables inside config.py:
  SECRET_KEY=your_secret_key
  JWT_SECRET_KEY=your_jwt_secret_key
  MAIL_SERVER=smtp.gmail.com
  MAIL_PORT=587
  MAIL_USE_TLS=True
  MAIL_USERNAME=your_email@gmail.com
  MAIL_PASSWORD=your_app_password
  MAIL_DEFAULT_SENDER = your_email@gmail.com

5. Run the server:
   python app.py

6.API base URL:
   http://localhost:5000/api




🌐 Frontend Setup (React)--------------------------------

📌 Prerequisites
  Node.js (v16 or higher)
  npm or yarn

🔨 Steps
1.Navigate to frontend folder:
   cd frontend

2. Install dependencies:
   npm install

3. Run the React app:
    npm start

4. App runs at:
  http://localhost:3000



🛠 Features
✅ User Features
	Register/Login
	Create surveys with multiple questions
	Submit answers to public or private surveys
	Export survey results to CSV
	Import responses from CSV files
	Email survey links directly from the app

📤 Email Survey Distribution
	Uses Flask-Mail + Gmail SMTP
	Requires "App Passwords" for Gmail
	Enable 2FA and generate app password


📁 CSV Upload Format
For submitting responses:
	question_id,question_text,answer
	3,What is your name?,John
	4,What are your hobbies?,Reading


🧪 Testing
Backend routes can be tested using Postman or curl
Frontend pages are interactive and use React hooks
JWT tokens are stored in localStorage after login

📦 Build for Production
Frontend:
npm run build

🧹 Ignore Files in Git
Make sure your .gitignore in backend/ includes:
	venv/
	__pycache__/
	*.pyc
	.env
	*.db