using Microsoft.AspNetCore.SignalR;

namespace ChatAppAssignment.Api.Hubs;

public class ChatHub : Hub //Inheritance from Hub-class, enabling access to SignalR-functionality.
{
    //Function that enables the client to invoke ReceiveMessage-method to send a message to the chat.
    public async Task SendMessage(string username, string userId, string message)
    {
        var timestamp = DateTime.UtcNow;
        await Clients.All.SendAsync("ReceiveMessage", username, userId, timestamp, message);
    }
}
