Hello you, 

What you'll find is the backend and frontend code for a chat app. If you should decide to work on it, make sure to run npm install before you look in the code. 

The main functionalities you'll find are the following:

- create a new chatroom --> the chatroom you created is added to the chatroom overview on top of the page, a little chat-window will pop up and you can chat with other people in the same chat
- enter an existing chatroom --> click on one of the chatroom names appearing on top of the page and a little chat-window will pop up
- leave chatrooms --> click on the x-button on top right of the chat-window --> the chat is deleted. If you were the only one in the chat, it will get deleted from the chatlist. also, if you should be the only one in a chatroom and close your page, the chatroom will be deleted

What is nice to know on code side:
- there are two storages of room and user data, one in the backend and one in the frontend
    - backend: the db holds every room, its users by name and by number
    - frontend: there is a storage object, that holds the user and all the rooms they're in
- there is one storage of all messages one user has sent and received in the frontend

Everything else: don't hesitate to ask me :)

All the best,
Lena
