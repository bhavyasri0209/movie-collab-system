import { useEffect, useState } from "react";

import io from "socket.io-client";
import "../styles/chat.css";



let socket;

export default function Chat() {

  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState([]);

  const [isConnected, setIsConnected] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    // Connect to socket
    socket = io("https://movie-collab-system.onrender.com", {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5
    });

    socket.on("connect", () => {
      console.log("Connected to chat server");
      setIsConnected(true);
      
      // Join with user info
      socket.emit("join_user", { user: currentUser.name || "User" });
    });

    socket.on("receive_message", (data) => {
      console.log("Message received:", data);
      setMessages((prev) => [...prev, data]);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from chat server");
      setIsConnected(false);
    });

    socket.on("connect_error", (error) => {
      console.error("Connection error:", error);
    });

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };

  }, []);

  const sendMessage = () => {

    if(message.trim() === "" || !isConnected) return;

    socket.emit(
      "send_message",
      {
        user: currentUser.name || "Anonymous",
        message: message
      }
    );

    setMessage("");

  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (

    <div className="chat-page">
      <div className="chat-container">
        <div className="chat-header">
          <h2>Production Chat</h2>
          <span className={`status ${isConnected ? "online" : "offline"}`}>
            {isConnected ? "● Online" : "● Offline"}
          </span>
        </div>

        <div className="messages-box">
          {messages.length === 0 ? (
            <p style={{ textAlign: "center", color: "#999" }}>No messages yet</p>
          ) : (
            messages.map((msg, idx) => (
              <div key={idx} className="message-item">
                <strong>{msg.user}:</strong>
                <p>{msg.message}</p>
              </div>
            ))
          )}
        </div>

        <div className="chat-input">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            disabled={!isConnected}
          />
          <button 
            onClick={sendMessage}
            disabled={!isConnected}
          >
            Send
          </button>
        </div>
      </div>
    </div>

  );
}