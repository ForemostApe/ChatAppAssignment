using ChatAppAssignment.Api.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace ChatAppAssignment.Api.Contexts
{

    //Configured to use Identity through inheritance and sets up additional DbSet for Messages.

    public class ChatContext(DbContextOptions<ChatContext> options) : IdentityDbContext<UserEntity>(options)
    {
        public virtual DbSet<ChatMessageEntity> Messages { get; set; }
    }
}
