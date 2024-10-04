import * as signalR from "@microsoft/signalr";
import DOMPurify from "dompurify";

//Establish connection to SignalR-hub in backend-solution.
const conn = new signalR.HubConnectionBuilder().withUrl("/chat").build();

//Setup ability to set and retrieve values from view.
const user = document.querySelector("#user");
const message = document.querySelector("#message");
const chat = document.querySelector("#chat");
const sendBtn = document.querySelector("#sendBtn");

//Disable button if either user- or message-input is empty.
const toggleButtonState = () => {
  sendBtn.disabled = !user.value || !message.value;
};

//Check state of input-fields on load.
toggleButtonState();
user.addEventListener("input", toggleButtonState);
message.addEventListener("input", toggleButtonState);

//Connect to websocket and display whether successful or not.
conn
  .start()
  .then(() => {
    console.log("Connected to the hub.");
  })
  .catch(function (err) {
    return console.error(err.toString());
  });

//Function that calls invokes the SendMessage-method and passes the user- and message-values as args.
export function sendMessage() {
  try {
    conn.invoke("SendMessage", user.value, message.value);
    message.value = "";
  } catch (err) {
    console.error(err.toString());
  }
}

conn.on("ReceiveMessage", (user, message) => {
  const newMsg = document.createElement("div");
  const domPurifyConf = { ALLOWED_TAGS: ["b"] };
  const sanitizedUser = DOMPurify.sanitize(user, domPurifyConf);
  const sanitizedMsg = DOMPurify.sanitize(message, domPurifyConf);

  newMsg.classList.add("message");
  newMsg.innerHTML = `<span class="username">${sanitizedUser}:</span> ${sanitizedMsg}`;
  chat.appendChild(newMsg);
  chat.scrollTop = chat.scrollHeight;
});
