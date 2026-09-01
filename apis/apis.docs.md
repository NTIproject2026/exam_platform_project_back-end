# E-Learning API

Backend API for an e-learning platform covering authentication, diploma (course) management, quizzes, and quiz-taking flows. Extracted from the `E-Learning` Postman collection.

**Base URL:** `http://localhost:3000`

**Authentication:** Most endpoints require a Bearer token obtained from `POST /auth/login`, sent as:
```
Authorization: Bearer <token>
```

---

## Auth Controller

Base path: `/auth`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/register` | None | Register a new user |
| POST | `/auth/login` | None | Log in and receive an access token |
| POST | `/auth/forget-password` | None | Request a password reset code via email |
| POST | `/auth/resend-otp` | None | Resend the OTP/reset code |
| POST | `/auth/reset-password` | None | Reset password using the emailed reset code |

### POST `/auth/register`
Registers a new user.

**Body**
```json
{
  "email": "aa@aa3.com",
  "firstName": "Youssef",
  "lastName": "Youssef",
  "password": "123123123"
}
```

### POST `/auth/login`
Authenticates a user and returns an access token (saved automatically in Postman as `token` via a test script).

**Body**
```json
{
  "email": "aa@aa1.com",
  "password": "789asdzxc"
}
```

**Response** — must include `data.token` for the client to store.

### POST `/auth/forget-password`
Sends a password reset code to the user's email.

**Body**
```json
{
  "email": "aa@aa1.com"
}
```

### POST `/auth/resend-otp`
Resends the OTP/reset code if the user didn't receive it.

**Body**
```json
{
  "email": "aa@aa1.com"
}
```

### POST `/auth/reset-password`
Resets the password using the code sent by `forget-password`.

**Body**
```json
{
  "email": "aa@aa1.com",
  "resetCode": 194711,
  "newPassword": "789asdzxc"
}
```

---

## Dashboard Controller

Base path: `/dashboard` — manages **Diplomas** (courses) and lists quizzes under a diploma. Requires a Bearer token.

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/dashboard/` | Create a new diploma |
| GET | `/dashboard/` | Get all diplomas |
| GET | `/dashboard/:diplomaId` | Get a diploma by ID |
| PATCH | `/dashboard/:diplomaId` | Update a diploma |
| DELETE | `/dashboard/:diplomaId` | Delete a diploma |
| GET | `/dashboard/:diplomaId/quizzes/` | Get all quizzes belonging to a diploma |
| POST | `/dashboard/:diplomaId/quizzes/` | Create a quiz under a diploma |

### POST `/dashboard/`
Creates a diploma.

**Body**
```json
{
  "name": "Node.js Basics",
  "desc": "Introductory diploma for backend development",
  "img": "https://example.com/image.png"
}
```

### GET `/dashboard/`
Returns all diplomas.

### GET `/dashboard/:diplomaId`
Returns a single diploma by its ID.

### PATCH `/dashboard/:diplomaId`
Updates a diploma's fields.

**Body**
```json
{
  "name": "Node.js Advanced",
  "desc": "Updated diploma description"
}
```

### DELETE `/dashboard/:diplomaId`
Deletes a diploma by ID.

### GET `/dashboard/:diplomaId/quizzes/`
Returns all quizzes that belong to the given diploma.

### POST `/dashboard/:diplomaId/quizzes/`
Creates a new quiz under the given diploma. (Also listed under Quiz Controller as `create-quiz`.)

**Body**
```json
{
  "name": "Node.js Basics",
  "desc": "Introductory diploma for backend development",
  "img": "https://example.com/image.png",
  "time": 15,
  "quizType": "framwork"
}
```

---

## Quiz Controller

Base path: `/quizzes` — manages quizzes, quiz questions, and the quiz-taking (attempt) flow. Requires a Bearer token.

### Quiz

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/quizzes/:quizId` | Get a quiz by ID |
| GET | `/quizzes/:quizId/questions` | Get all questions for a quiz |
| PATCH | `/quizzes/:quizId` | Update a quiz |
| DELETE | `/quizzes/:quizId` | Delete a quiz |
| POST | `/dashboard/:diplomaId/quizzes/` | Create a quiz (see Dashboard Controller) |

#### GET `/quizzes/:quizId`
Returns a single quiz by ID.

#### GET `/quizzes/:quizId/questions`
Returns all questions belonging to a quiz.

#### PATCH `/quizzes/:quizId`
Updates a quiz's details.

**Body**
```json
{
  "name": "Backend Quiz",
  "desc": "Updated quiz description",
  "time": "30",
  "img": "https://example.com/quiz.png",
  "quizType": "Advanced"
}
```

#### DELETE `/quizzes/:quizId`
Deletes a quiz by ID.

### Questions

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/quizzes/:quizId/questions/` | Add a question to a quiz |
| GET | `/quizzes/:quizId/questions/:questionId` | Get a question by ID |
| PATCH | `/quizzes/:quizId/questions/:questionId` | Update a question and its answer sheet |

#### POST `/quizzes/:quizId/questions/`
Adds a new question with its answer sheet to a quiz.

**Body**
```json
{
  "questionData": {
    "multipleAnswer": false,
    "head": "whats's 2+2?"
  },
  "answer_sheet": [
    { "answer": "4", "correct": true },
    { "answer": "10", "correct": false }
  ]
}
```

#### GET `/quizzes/:quizId/questions/:questionId`
Returns a single question by ID.

#### PATCH `/quizzes/:quizId/questions/:questionId`
Updates a question's body and/or its answer sheet entries (matched by `id`).

**Body**
```json
{
  "question_body": {
    "head": "whats 4+4?"
  },
  "answer_sheet": [
    { "id": "6a6d45991a5291fdd2b5544b", "answer": "8", "correct": true },
    { "id": "6a6d459a1a5291fdd2b5544c", "answer": "30", "correct": false }
  ]
}
```

### Taking a Quiz

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/quizzes/:quizId/startQuiz` | Start a quiz attempt |
| POST | `/quizzes/:quizId/submitQuiz?quizAttempt=:attemptId` | Submit a quiz attempt |

#### POST `/quizzes/:quizId/startQuiz`
Starts a new attempt for the given quiz.

**Body**
```json
{
  "quizData": {
    "name": "Backend Quiz",
    "desc": "Starting quiz"
  }
}
```

**Response** — expected to return an attempt ID, used as `quizAttempt` when submitting.

#### POST `/quizzes/:quizId/submitQuiz`
Submits a previously started quiz attempt.

**Query Parameters**

| Param | Description |
|-------|-------------|
| `quizAttempt` | ID of the attempt returned by `startQuiz` |

**Example**
```
POST /quizzes/6a6d444254c5f2a91a4e1ea4/submitQuiz?quizAttempt=6a6d4a6259de699c28df8855
```

---

## Typical Flow

1. `POST /auth/register` → create an account.
2. `POST /auth/login` → get the access token; use it as `Authorization: Bearer <token>` for all subsequent requests.
3. `POST /dashboard/` → create a diploma (course).
4. `POST /dashboard/:diplomaId/quizzes/` → create a quiz under that diploma.
5. `POST /quizzes/:quizId/questions/` → add questions and their answer sheets to the quiz.
6. `POST /quizzes/:quizId/startQuiz` → start an attempt, get a `quizAttempt` ID.
7. `POST /quizzes/:quizId/submitQuiz?quizAttempt=...` → submit the attempt.

## Notes

- All resource IDs (`diplomaId`, `quizId`, `questionId`, `quizAttempt`) are MongoDB ObjectIds.
- Password reset uses a numeric `resetCode` sent by email via `forget-password` / `resend-otp`, then consumed by `reset-password`.
- Environment variables used in the Postman collection: `token` (set automatically on login) and `accessToken`.