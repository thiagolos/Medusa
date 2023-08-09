import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
// import reportWebVitals from './reportWebVitals';
import { ChatProvider } from "./context/ChatContext";
import { MessageProvider } from "./context/MessageContext";

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <ChatProvider>
      <MessageProvider>
        <App />
      </MessageProvider>
    </ChatProvider>
  </React.StrictMode>
);
