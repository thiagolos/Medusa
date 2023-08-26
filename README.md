# Anonymous Multi-Chatroom App

Welcome to the Anonymous Multi-Chatroom App, a platform that enables users to engage in real-time discussions within multiple chatrooms. This README provides an overview of the project, its features and the technologies employed.

### Frontend

- **React:** A widely-used JavaScript library for building user interfaces.
- **TypeScript:** A statically typed superset of JavaScript that enhances code quality and readability.
- **Socket.io:** A library facilitating real-time, bidirectional communication between clients and the server.

### Backend

- **MongoDB:** A popular NoSQL database for efficient storage and retrieval of data.
- **Mongoose:** An ORM (Object-relational mapping) library for MongoDB, simplifying database interactions.
- **TypeScript:** Employed on the backend to enhance development with static typing.
- **Express:** A fast and minimalist web application framework for Node.js.

### Testing

- **Cypress:** A comprehensive end-to-end testing framework for ensuring application behavior.
- **Jest:** A JavaScript testing framework used for unit testing.

## Features

- **Multi-Chatroom Support:** Users can join different chatrooms based on their interests.
  <img width="1680" alt="Screenshot 2023-08-26 at 14 33 50" src="https://github.com/thiagolos/Medusa/assets/128632331/a6529b85-24ff-4b2c-95ae-ed8e6b27ed31">
- **Real-time Messaging:** Engage in real-time conversations within chatrooms.
  <img width="1680" alt="Screenshot 2023-08-26 at 14 33 33" src="https://github.com/thiagolos/Medusa/assets/128632331/66ca9da6-adb4-49e8-b779-058fe250882a">
- **Anonymity:** Users can participate in discussions anonymously, providing privacy.
- **User-Friendly Interface:** A clean and intuitive interface for seamless user experience.

## Getting Started

To start using the app, follow these steps:

1. Clone this repository.
2. Set up the frontend by navigating to the `/frontend` directory and running `npm install`.
3. Similarly, set up the backend by going to the `/backend` directory and running `npm install`.
4. Set up your MongoDB database and update the connection configuration in the backend's `.env` file.
5. Start the backend server using `nodemon server.ts` in the `/backend` directory.
6. Start the frontend development server using `npm run dev` in the `/frontend` directory.
