import { useEffect, useState, useRef } from "react";
import * as signalR from "@microsoft/signalr";
import DOMPurify from "dompurify";
import "./Chat.css";

// Set states.
const Chat = () => {
  const [user, setUser] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const chatRef = useRef(null);
  const conn = useRef(null);

  //Initialize connection SignalR-hub
  useEffect(() => {
    const conn = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:7122/chat")
      .build();

    //Connect to hub.
    conn
      .start()
      .then(() => {
        console.log("Connected to the hub.");
      })
      .catch((err) => console.error(err.toString()));

    //Handle received messages and sanitize them.
    conn.on("ReceiveMessage", (user, message) => {
      const sanitizedUser = DOMPurify.sanitize(user);
      const sanitizedMsg = DOMPurify.sanitize(message);

      //Add new message to previous messages through spread.
      setMessages((prevMessages) => [
        ...prevMessages,
        { user: sanitizedUser, message: sanitizedMsg },
      ]);

      // Scroll to the bottom of the chat container
      if (chatRef.current) {
        chatRef.current.scrollTop = chatRef.current.scrollHeight;
      }
    });

    // Cleanup connection on unmount
    return () => {
      conn.stop();
    };
  }, []);

  // Function to send a message
  const sendMessage = async () => {
    if (message.trim() && conn.current) {
      try {
        await conn.current.invoke("SendMessage", user, message);
        setMessage(""); // Clear the input field
      } catch (err) {
        console.error(err.toString());
      }
    }
  };

  // Disable send button if user or message is empty
  const isSendDisabled = !user || !message;

  return (
    <div className="chat-container">
      <div id="chat" ref={chatRef} className="chat-box">
        {messages.map((msg, index) => (
          <div key={index} className="message">
            <span className="username">{msg.user}:</span> {msg.message}
          </div>
        ))}
      </div>
      <input
        type="text"
        id="user"
        placeholder="Your name"
        value={user}
        onChange={(e) => setUser(e.target.value)}
      />
      <input
        type="text"
        id="message"
        placeholder="Type your message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button id="sendBtn" onClick={sendMessage} disabled={isSendDisabled}>
        Send
      </button>
    </div>
  );
};

export default Chat;
