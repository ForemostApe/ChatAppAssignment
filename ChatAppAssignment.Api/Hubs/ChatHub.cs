using Microsoft.AspNetCore.SignalR;

namespace ChatAppAssignment.Api.Hubs
{
    public class ChatHub : Hub //Inheritance from Hub-class, enabling access to SignalR-functionality.
    {
        //Function that enables the client to invoke ReceiveMessage-method to send a message to the chat.
        public async Task SendMessage(string user, string message)
        {
            await Clients.All.SendAsync("ReceiveMessage", user, message);
        }
    }
}
