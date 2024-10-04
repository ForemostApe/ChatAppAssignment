import "./Chat.css";
import "./ChatService";
import { sendMessage } from "./ChatService";

const Chat = () => {
  return (
    <div className="chat-container">
      <div id="chat"></div>
      <input type="text" id="user" placeholder="Your name"></input>
      <input type="text" id="message" placeholder="Type your message"></input>
      <button id="sendBtn" onClick={sendMessage()}>
        Send
      </button>
    </div>
  );
};

export default Chat;
