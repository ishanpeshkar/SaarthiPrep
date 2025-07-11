# SaarthiPrep

SaarthiPrep is a full-stack web application to help you prepare for job interviews with AI-powered resume analysis, personalized mock interviews, quizzes, and progress tracking.

## Project Structure

```
SaathiFinal/
│
├── client/         # React frontend
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── ...
│
├── server/         # Node.js/Express backend
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   ├── utils/
│   ├── index.js
│   ├── websocket.js
│   ├── package.json
│   └── ...
|
├── README.md       # Project documentation
└── ...
```

---

## Prerequisites

- [Node.js](https://nodejs.org/) (v14+ recommended)
- [npm](https://www.npmjs.com/)
- [MongoDB](https://www.mongodb.com/) (local or cloud)

---

## Setup Instructions

### 1. Clone the Repository

```sh
git clone <your-repo-url>
cd SaathiFinal
```

### 2. Environment Variables

#### Backend (`server/`)

- Copy `.env.example` to `.env` and fill in your MongoDB URI and other secrets.

```sh
cd server
cp .env.example .env
# Edit .env as needed
```

#### Frontend (`client/`)

- Create a `.env` file in `client/` if you need to override any environment variables.

---

### 3. Install Dependencies

#### Backend

```sh
cd server
npm install
```

#### Frontend

```sh
cd ../client
npm install
```

---

### 4. Running the Application

#### Start MongoDB

- Make sure your MongoDB server is running locally or update `.env` with your remote URI.

#### Start Backend

```sh
cd server
npm run dev
```
- Runs on [http://localhost:5001](http://localhost:5001) by default.

#### Start Frontend

Open a new terminal:

```sh
cd client
npm start
```
- Runs on [http://localhost:3000](http://localhost:3000) by default.

---

### 5. Building for Production

To build the React frontend for production:

```sh
cd client
npm run build
```
- The build output will be in `client/build/`.

---

### 6. Running Tests

#### Frontend

```sh
cd client
npm test
```

#### Backend

```sh
cd server
npm test
```
(Add backend tests as needed.)

---

## Useful Commands

| Directory | Command           | Description                          |
|-----------|-------------------|--------------------------------------|
| client    | `npm start`       | Start React dev server               |
| client    | `npm run build`   | Build React app for production       |
| client    | `npm test`        | Run frontend tests                   |
| server    | `npm start`       | Start Express backend                |
| server    | `npm test`        | Run backend tests (if available)     |

---

## Features

- AI-powered resume analysis and feedback
- Personalized mock interview questions
- Quiz and question bank for coding practice
- Soft skills and behavioral training modules
- Peer-to-peer practice mode
- Progress tracking and analytics
- Dashboard with roadmap and stats

---

## Deployment

- For deployment, build the frontend and serve it with the backend in production mode.


---



**For any issues, please open an issue
