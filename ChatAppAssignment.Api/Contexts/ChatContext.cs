using ChatAppAssignment.Api.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace ChatAppAssignment.Api.Contexts
{
    public class ChatContext(DbContextOptions<ChatContext> options) : IdentityDbContext<UserEntity>(options)
    {
        public virtual DbSet<ChatMessageEntity> Messages { get; set; }
    }
}
