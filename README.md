# Medusa
## Introduction
What you'll find is the backend and frontend code for a chat app. The app aims to allow for easy and instant discussions between users on various topics of mutual interest. It provides chatrooms covering a wide range of interests from videogames to politics. Users enter anonymously without signups, allowing them to spontaneously join conversations. Chatrooms continuously run 24/7, allowing discussions between an ever-changing group of participants. The app hopes to connect likeminded people and provide a space for spontaneous discussions on any subjects that matter to users, welcoming different voices and perspectives.

## Functionality
The main functionalities you'll find are the following:

- create a new chatroom --> the chatroom you created is added to the chatroom overview on top of the page, a little chat-window will pop up and you can chat with other people in the same chat
- enter an existing chatroom --> click on one of the chatroom names appearing on top of the page and a little chat-window will pop up
- leave chatrooms --> click on the x-button on top right of the chat-window --> the chat is deleted. If you were the only one in the chat, it will get deleted from the chatlist. also, if you should be the only one in a chatroom and close your page, the chatroom will be deleted

What is nice to know on code side:
- there are two storages of room and user data, one in the backend and one in the frontend
    - backend: the db holds every room, its users by name and by number
    - frontend: there is a storage object, that holds the user and all the rooms they're in
- there is one storage of all messages one user has sent and received in the frontend

## Getting Started

To begin using Real Time Trivia, follow these steps:

1. Clone this repository.
  ```
  git clone https://github.com/msunay/medusa.git
  ```
2. Set up the frontend by navigating to the frontend directory and running `npm install`.
  ```
  cd medusa/client
  npm install
  ```
3. Similarly, set up the backend by going to the backend directory and running `npm install`.
  ```
  cd medusa/server
  npm install
  ```
4. Create a MongoDB database for the application and update the DB_NAME variable in the backend's `.env` file.
5. Start the backend server using `npm run dev` in the backend directory.
  ```
  cd medusa/server
  npm run dev
  ```
6. Start the frontend development server using `npm run dev` in the frontend directory.
  ```
  cd medusa/client
  npm run dev
  ```

### Forked from:
Magdalena Keller - [LinkedIn](https://www.linkedin.com/in/magdalena-keller/) - [Github](https://github.com/makekema/Medusa)

### Contributers
- Alex Eze [LinkedIn](https://www.linkedin.com/in/alex-eze-dev/) - [GitHub](https://github.com/msunay)
- Thiago Los [LinkedIn](https://www.linkedin.com/in/thiagolos/) - [GitHub](https://github.com/thiagolos)
