using Microsoft.AspNetCore.Identity;

namespace ChatAppAssignment.Api.Entities;

//Inherits predefined props from IdentityUser
public class UserEntity : IdentityUser
{
    public ICollection<ChatMessageEntity>? ChatMessages { get; set; }
}
