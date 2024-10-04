using Microsoft.AspNetCore.Identity;

namespace ChatAppAssignment.Api.Entities;

public class UserEntity : IdentityUser
{
    public ICollection<ChatMessageEntity>? ChatMessages { get; set; }
}
