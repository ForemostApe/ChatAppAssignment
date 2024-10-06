import "./Chat.css";

const Chat = () => {
  return (
    <div className="chat-container">
      <div className="logout">X</div>
      <div className="chat-framework-container">
        <div className="chat-message-grid">
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
          </div>
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
        </div>
        <div>
          <form>
            <div className="messaging-container">
              <input></input>
              <button>Send</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default Chat;
