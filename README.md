# Mini Chat App Backend

This is the backend for a Mini Chat App, built using **Express.js**, **Passport.js**, and **Socket.IO**. The app allows users to register, log in, and participate in a chat room called "General". Messages exchanged in the chat are stored in a **PostgreSQL** database for persistence.

## Features

- **User Registration and Login**: Secure user authentication using **Passport.js** with **JWT** strategy.
- **Chat Functionality**: Real-time communication via **Socket.IO**.
- **Message Persistence**: All messages are stored in a **PostgreSQL** database.
- **Protected Routes**: Certain routes require valid JWTs for access.

## Technologies Used

- **Node.js**: Backend runtime.
- **Express.js**: Web framework for building RESTful APIs.
- **Passport.js**: Authentication middleware using JSON Web Tokens (JWT).
- **Socket.IO**: Real-time, bidirectional event-based communication.
- **PostgreSQL**: Database for storing users and messages.

## Installation

### Prerequisites

Ensure you have the following installed:

- **Node.js** (v16 or higher)
- **PostgreSQL** (with a running instance)

### Steps

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/mini-chat-app-backend.git
   cd chat-app-backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following environment variables:

   ```env
   PORT=3000
   DATABASE_URL=postgresql://username:password@localhost:5432/database_name
   JWT_SECRET=your_jwt_secret_key
   ```

4. Initialize the database:

    - Create a PostgreSQL database manually.
    - Run migrations or use Prisma/Sequelize to sync your schema.

5. Start the server:

   ```bash
   npm start
   ```

The server will run on `http://localhost:3000` by default.

## API Endpoints

### Auth Routes

#### POST `/register`

Registers a new user.

- **Request Body**:
  ```json
  {
    "firstname": "John",
    "lastname": "Doe",
    "email": "john.doe@example.com",
    "username": "johndoe",
    "password": "securepassword",
    "pass-confirm": "securepassword"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "msg": "User registered successfully.",
    "token": "******** JSON Web Token ******** "
  }
  ```

#### POST `/login`

Logs in a user and returns a JWT.

- **Request Body**:
  ```json
  {
    "username": "johndoe",
    "password": "securepassword"
  }
  ```
- **Response**:
  ```json
  {
    "token": "jwt-token",
    "user": {
      "id": 1,
      "username": "johndoe"
    }
  }
  ```

### Chat Routes

#### GET `/chat/messages`

Fetches all messages for the "General" room.

- **Request Header**:
  ```json
  {
    "Authorization": "Bearer jwt-token"
  }
  ```
- **Response**:
  ```json
  [
    {
      "id": 1,
      "content": "Hello, world!",
      "username": "johndoe",
      "createdAt": "2025-01-23T12:00:00Z"
    }
  ]
  ```

#### POST `/chat/messages`

Saves a new message to the database.

- **Request Header**:
  ```json
  {
    "Authorization": "Bearer jwt-token"
  }
  ```
- **Request Body**:
  ```json
  {
    "content": "This is a new message",
    "room": "general"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Message saved successfully."
  }
  ```

## Socket.IO Events

### `connection`

Triggered when a client connects to the server.

### `joinRoom`

Joins the user to a specific room (default: "General").

- **Payload**:
  ```json
  {
    "room": "general"
  }
  ```

### `sendMessage`

Sends a new message to the server.

- **Payload**:
  ```json
  {
    "room": "general",
    "content": "This is a message",
    "username": "johndoe"
  }
  ```

### `receiveMessage`

Broadcasts a message to all users in the room.

- **Payload**:
  ```json
  {
    "id": 1,
    "content": "This is a message",
    "username": "johndoe",
    "createdAt": "2025-01-23T12:00:00Z"
  }
  ```

## Folder Structure

```
mini-chat-app-backend/
├── controllers/
│   ├── authController.js
│   ├── chatController.js
│   └── authSocket.js
├── db/
│   ├── models/
│   ├── migrations/
│   └── messages.js
├── sockets/
│   └── chatSocket.js
├── app.js
├── server.js
├── package.json
└── .env
```

## Future Improvements

- Add multiple chat rooms.
- Enhance user profile functionality.
- Add typing indicators.
- Improve message search and filtering.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

---

Feel free to contribute or open issues to suggest improvements. Happy chatting!

