// import { useEffect, useContext } from "react";
// import { ChatContext } from "../context";

// function SendMessageOnJoin() {
//   const { socket, chatrooms } = useContext(ChatContext);

//   useEffect(() => {
//     socket.on("user_join", (userData) => {
//       console.log("user_join event received");
//       if (userData.userCount === 1) {
//         const messageData = {
//           user: socket.id,
//           room: userData.room,
//           message: "You are the only user in this chat room.",
//           time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes(),
//           sender: "me",
//           socketId: socket.id,
//         };
//         socket.emit("send_message", messageData);
//       }
//     });
//     return () => {
//       socket.off("user_join");
//     };
//   }, [chatrooms]);

//   return null;
// }

// export default SendMessageOnJoin;