﻿using ChatAppAssignment.Api.Entities;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace ChatAppAssignment.Api.Factories;

public class TokenFactory(string tokenKey, string issuer)
{
    private readonly string _tokenKey = tokenKey;
    private readonly string _issuer = issuer;

    public string GenerateJwtToken(UserEntity userEntity)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes(_tokenKey);

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[]
            {
            new Claim(ClaimTypes.Name, userEntity.UserName!),
            new Claim(ClaimTypes.NameIdentifier, userEntity.Id)
        }),
            Expires = DateTime.UtcNow.AddHours(2),
            Audience = "http://localhost:5173",
            Issuer = _issuer,
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }
}
