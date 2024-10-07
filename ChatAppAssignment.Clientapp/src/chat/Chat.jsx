import "./Chat.css";
import * as signalR from "@microsoft/signalr";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import DOMPurify from "dompurify";

const Chat = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const connectionRef = useRef(null);

  useEffect(() => {
    //Authentication from Jwt-token
    const fetchChatData = async () => {
      const token = localStorage.getItem("jwtToken");

      if (!token) {
        setError("You must be logged in to enter the chat!");
        setLoading(false);
        navigate("/");
        return;
      }

      //Calls endpoint which and checks authorization.
      try {
        const response = await fetch("https://localhost:7122/chat", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Unauthorized.");
        }

        const data = await response.json();
        setUsername(data.Username);

        //Open websocket-connection using signalR.
        if (!connectionRef.current) {
          const conn = new signalR.HubConnectionBuilder()
            .withUrl("https://localhost:7122/chat", {
              accessTokenFactory: () => localStorage.getItem("jwtToken "),
            })
            .build();

          connectionRef.current = conn;

          await conn
            .start()
            .then(() => {
              console.log("Connected to the hub.");
            })
            .catch(function (error) {
              setError(`Failed to start the connection: ${error.message}`);
            });
        }
      } catch (error) {
        setError(`Failed to start the connection: ${error.message}`);
        navigate("/");
      } finally {
        setLoading(false);
      }

      connectionRef.current.on("ReceiveMessage", (user, message) => {
        const sanitizedMessage = DOMPurify.sanitize(message, {
          ALLOWED_TAGS: ["b", "i"],
        });
        setMessages((prevMessages) => [
          ...prevMessages,
          { user, message: sanitizedMessage },
        ]);
      });
    };

    fetchChatData();

    return () => {
      if (connectionRef.current) {
        connectionRef.current.stop();
        connectionRef.current = null;
      }
    };
  }, [navigate]);

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  if (error) {
    return <div className="container">{error}</div>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    await sendMessage();
    setMessage("");
  };

  async function sendMessage() {
    try {
      const sanitizedMessage = DOMPurify.sanitize(message, {
        ALLOWED_TAGS: ["b", "i"],
      });
      await connectionRef.current.invoke(
        "SendMessage",
        username,
        sanitizedMessage
      );
    } catch (error) {
      console.error(error.toString());
    }
  }

  return (
    <div className="chat-container">
      {error && <div className="error-message">{error}</div>}
      <div className="logout">⨯</div>
      <div className="chat-framework-container">
        <div className="chat-message-grid">
          {Array.isArray(messages) &&
            messages.map((msg, index) => (
              <div key={index} className="chat-message-incoming-container">
                <div className="chat-message-incoming">
                  <span>{msg.message}</span>
                  <div className="chat-message-user-container">
                    <span className="username">{msg.username}</span>
                    <span className="message-timestamp">{msg.timestamp}</span>
                  </div>
                </div>
              </div>
            ))}
          {/* 
          <div className="chat-message-incoming-container">
            <div className="chat-message-incoming">
              Hallå
              <br />
              Hall igenhfjdgsjhgfdhjgfdhjg gfhdjsgfhjsd hfgdshjf gsdhjfgdshjfg
              ghjfdsgfhjd
            </div>
            <div className="chat-message-user-container">
              Der Strumpf 2023-04-12 12:03
            </div>
          </div>
          <div className="chat-message-outgoing-container">
            <div className="chat-message-outgoing">Hallå själv</div>
            <div className="chat-message-user-container">
              Gargamel 2023-04-12 12:03
            </div>
           */}
        </div>
        <div>
          <form onSubmit={handleSubmit}>
            <div className="messaging-container">
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              ></input>
              <button type="submit">Send</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;
