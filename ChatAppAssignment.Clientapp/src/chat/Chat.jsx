import "./Chat.css";
import * as signalR from "@microsoft/signalr";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import DOMPurify from "dompurify";

const Chat = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const connectionRef = useRef(null);

  useEffect(() => {
    // Authentication with JWT-token
    const fetchChatData = async () => {
      const token = localStorage.getItem("jwtToken");

      if (!token) {
        setError("You must be logged in to enter the chat!");
        setLoading(false);
        navigate("/");
        return;
      }

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
        setUsername(data.username);
        setUserId(data.userId);

        // Open websocket connection using SignalR
        if (!connectionRef.current) {
          const conn = new signalR.HubConnectionBuilder()
            .withUrl("https://localhost:7122/chat", {
              accessTokenFactory: () => localStorage.getItem("jwtToken"),
            })
            .build();

          connectionRef.current = conn;

          await conn
            .start()
            .then(() => {
              console.log("Connected to the hub.");
            })
            .catch((error) => {
              setError(`Failed to start the connection: ${error.message}`);
            });

          // Listen for incoming messages
          connectionRef.current.on(
            "ReceiveMessage",
            (username, userId, timestamp, message) => {
              const sanitizedMessage = DOMPurify.sanitize(message, {
                ALLOWED_TAGS: ["b", "i"],
              });

              // Append the new message to the messages array
              setMessages((prevMessages) => [
                ...prevMessages,
                {
                  username,
                  userId,
                  timestamp,
                  message: sanitizedMessage,
                },
              ]);
            }
          );
        }
      } catch (error) {
        setError(`Failed to start the connection: ${error.message}`);
        navigate("/");
      } finally {
        setLoading(false);
      }
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

  // Send the message to the server via SignalR
  async function sendMessage() {
    try {
      const sanitizedMessage = DOMPurify.sanitize(message, {
        ALLOWED_TAGS: ["b", "i"],
      });

      await connectionRef.current.invoke(
        "SendMessage",
        username,
        userId,
        sanitizedMessage
      );
    } catch (error) {
      console.error(error.toString());
    }
  }

  //Inform server of logout, remove JWT-token and stop connection.
  const handleLogout = async () => {
    try {
      await fetch("https://localhost:7122/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error("Failed to log out", error);
    } finally {
      localStorage.removeItem("jwtToken");
      setUsername("");
      setMessages([]);

      if (connectionRef.current) {
        connectionRef.current.stop();
        connectionRef.current = null;
      }
      navigate("/");
    }
  };

  return (
    <div className="chat-container">
      {error && <div className="error-message">{error}</div>}
      <div className="logout">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            handleLogout();
          }}
        >
          ⨯
        </a>
      </div>
      <div className="chat-framework-container">
        <div className="chat-message-grid">
          {Array.isArray(messages) &&
            messages.map((msg, index) => (
              <div
                key={index}
                className={
                  msg.userId === userId
                    ? "chat-message-outgoing-container"
                    : "chat-message-incoming-container"
                }
              >
                <div
                  className={
                    msg.userId === userId
                      ? "chat-message-outgoing"
                      : "chat-message-incoming"
                  }
                >
                  <span>{msg.message}</span>
                </div>
                <div className="chat-message-user-container">
                  <span className="username">{msg.username}</span>
                  <span className="message-timestamp">
                    {new Date(msg.timestamp).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
        </div>
        <div>
          <form onSubmit={handleSubmit}>
            <div className="messaging-container">
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button type="submit">Send</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;
