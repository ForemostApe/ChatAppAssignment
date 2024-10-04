using System.ComponentModel.DataAnnotations;

namespace ChatAppAssignment.Api.Entities;

public class ChatMessageEntity
{
    [Key]
    public int ChatId { get; set; }

    [Required]
    public string ChatMessage { get; set; } = null!;

    [Required]
    public DateTime ChatTimestamp { get; set; } = DateTime.UtcNow;

    [Required]
    public string UserId { get; set; } = null!;

    [Required]
    public virtual UserEntity User { get; set; } = null!;
}
