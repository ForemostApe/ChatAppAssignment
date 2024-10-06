using ChatAppAssignment.Api.Entities;
using ChatAppAssignment.Api.Factories;
using ChatAppAssignment.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace ChatAppAssignment.Api.Controllers;

[ApiController]
//[Route("[controller]")]
public class AuthController(SignInManager<UserEntity> signInManager, UserManager<UserEntity> userManager, TokenFactory tokenFactory) : ControllerBase
{
    private readonly SignInManager<UserEntity> _signInManager = signInManager;
    private readonly UserManager<UserEntity> _userManager = userManager;
    private readonly TokenFactory _tokenFactory = tokenFactory;

    [HttpPost("/register")]

    public async Task<IActionResult> RegisterNewUser(UserModel userModel)
    {
        try
        {
            if (ModelState.IsValid)
            {
                if (!await _userManager.Users.AnyAsync(u => u.Email == userModel.Email))
                {
                    var newUser = new UserEntity
                    {
                        Email = userModel.Email,
                        UserName = userModel.Username
                    };

                    var result = await _userManager.CreateAsync(newUser, userModel.Password);

                    if (result.Succeeded)
                    {
                        return Ok(new { message = "Registration successful" });
                    }
                    else return BadRequest(result.Errors);
                }
                else
                {
                    return BadRequest("Username or email-address has already been registered.");
                }
            }
            return BadRequest("Invalid user-details.");
        }
        catch (Exception ex)
        {
            return StatusCode(500, ex.Message);
        }
    }

    [HttpPost("/login")]
    public async Task<IActionResult> LoginUser(LoginModel loginModel)
    {
        try
        {
            if (ModelState.IsValid)
            {
                var userEntity = await _userManager.FindByEmailAsync(loginModel.Email);
                if (userEntity != null)
                {
                    var result = await _signInManager.PasswordSignInAsync(userEntity.UserName, loginModel.Password, false, false);
                    if (result.Succeeded)
                    {
                    var token = _tokenFactory.GenerateJwtToken(userEntity);
                    return Ok(new {token});
                    }
                }
                return Unauthorized("Email or password invalid.");
            }
            return BadRequest(ModelState);
        }
        catch (Exception ex)
        {
            return StatusCode(500, ex.Message);
        }
    }

    [Authorize]  
    [HttpGet("/chat")]
    public async Task<IActionResult> GetChatInfo()
    {
        var username = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value;
        var userId = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;

        return Ok(new { username, userId });
    }
}