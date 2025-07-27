# 💡 DevFlow

DevFlow is a full-stack, production-grade **developer Q\&A platform** inspired by Stack Overflow // Twitter(x) // Quora — with added features like **threaded answers**, **email verification**, **modular service architecture**, and **structured logging**.

 👨‍💻 Built with a scalable architecture in mind, DevFlow empowers users to ask programming questions, post answers, and engage in in-depth threaded conversations.

---

## 🚀 Why DevFlow?

DevFlow was created to:

* Simplify developer question/answer interactions.
* Support **nested conversations** for more natural discussions.
* Practice **enterprise-grade Node.js architecture** with proper service/repository layers.
* Implement **ownership logic**, validations, and scalable structure using Node.js, Redis, MongoDB, and more.

---

## 🔧 Tech Stack

| Layer               | Tech Used                             |
| ------------------- | ------------------------------------- |
| **Backend**         | Node.js, Express.js                   |
| **Database**        | MongoDB with Mongoose ODM             |
| **Caching & Queue** | Redis + BullMQ                        |
| **Email Service**   | Nodemailer + OTP with Redis expiry    |
| **Validation**      | validator / Custom Middleware         |
| **Logging**         | Winston (Console + MongoDB transport) |
| **Authentication**  | JWT + bcrypt                          |

---

## 🧩 Key Modules

### 📌 Question Module

* Users can create questions with `title`, `body`, and `topics`.
* Questions are tied to user accounts.
* CRUD operations fully implemented.
* Topics are created dynamically and normalized.

### 💬 Answer Module

* Answers can be added to any question.
* Supports create, read, update, delete.
* **Ownership enforced**: only the author can edit/delete their answer.
* Input validation to ensure clean data.

### 🔁 Nested Answer / Threaded Replies

* Inspired by Twitter/X threads.
* Answers can have **infinite replies** using a recursive parent-child structure.
* Threaded UI design planned for front-end integration.

### 👤 User Module

* Signup / Login with password hashing (bcrypt).
* JWT-based auth system.
* Retrieve user profile using `username`.
* Update bio, email, or username.

### 📧 Email Verification

* OTP generation using helper utils + Redis cache.
* Email delivery via BullMQ & background workers.
* OTP verification updates `isVerified` field in the DB.

### 🪵 Logging

* Winston logger integrated with:

  * Console logging for dev.
  * MongoDB storage for logs in production.
* Logs all key events (login, signup, errors).

---

## 📁 Project Structure

```bash
src/
├── controller/        # Express route handlers (thin layer)
├── service/           # Core business logic
├── repository/        # Data access layer
├── model/             # Mongoose schemas
├── routes/            # API routing
├── middleware/        # Auth, validation, error handling
├── utils/             # JWT, OTP, custom helpers
├── config/            # DB, Redis, Logger configs
├── validation/        # Joi + custom validation logic
├── queue/             # BullMQ setup + job processors
└── logs/              # Winston logs if using file storage
```

> ✅ Each module follows **Separation of Concerns (SoC)** principle.

---

## ⚙️ Setup Instructions

### 🧪 Prerequisites

* Node.js (v18+ recommended)
* MongoDB (local or Atlas)
* Redis (local or cloud)
* A mail SMTP provider (e.g., Gmail SMTP, Mailtrap)

### 📦 Installation

```bash
# Clone the project
git clone https://github.com/Sangam5756/devflow.git
cd devflow

# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Add your Mongo URI, JWT secret, Redis URL, SMTP creds

# Start Mongo & Redis if needed

# Run the project
npm start
```

---

## 🔐 Environment Variables (`.env`)

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/devflow
JWT_SECRET=your_jwt_secret
REDIS_URL=redis://localhost:6379
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=you@example.com
EMAIL_PASS=password
```

---

## 🧪 Sample API Endpoints

| Method | Endpoint                     | Description                     |
| ------ | ---------------------------- | ------------------------------- |
| POST   | /api/v1/auth/register        | Register new user               |
| POST   | /api/v1/auth/login           | Login and get JWT               |
| POST   | /api/v1/questions            | Create a new question           |
| GET    | /api/v1/questions            | Get all questions               |
| POST   | /api/v1/answers/\:questionId | Create answer for a question    |
| DELETE | /api/v1/answers/\:answerId   | Delete your answer              |
| POST   | /api/v1/auth/send-otp        | Send OTP for email verification |
| POST   | /api/v1/auth/verify-otp      | Verify email using OTP          |

---

## 🛠️ Features in Progress

* [x] Answer ownership logic ✅
* [x] Threaded replies (nested answers) ✅
* [x] Email OTP flow via Redis + Queue ✅
* [x] Route-level documentation (JSDoc style) ✅
* [ ] Unit & Integration Testing (Jest) 🔄
* [ ] Votes / Like system on answers 🔜
* [ ] Pagination & Filtering by topic 🔜

---

## 🧑‍💻 Contributing

We’d love your help!

1. Fork the repo
2. Create a new branch: `git checkout -b feature-name`
3. Make changes
4. Commit and push: `git commit -m "Your message"`
5. Open a pull request

---

## 📜 License

MIT License. Feel free to use, share, or build on top of this!

---

## 🌍 Links

* 🔗 **Live Project**: *Coming Soon*
* 📦 **Repo**: [github.com/your-username/devflow](https://github.com/Sangam5756/devflow)
* 🧠 **Follow**: [X @sangammundhe](https://x.com/sangammundhe)
  Tag: `#BuildInPublic #DevFlow`

---
