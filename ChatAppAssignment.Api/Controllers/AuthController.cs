using ChatAppAssignment.Api.Entities;
using ChatAppAssignment.Api.Factories;
using ChatAppAssignment.Api.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ChatAppAssignment.Api.Controllers;

[ApiController]
[Route("[controller]")]
public class AuthController(SignInManager<UserEntity> signInManager, UserManager<UserEntity> userManager, TokenFactory tokenFactory) : ControllerBase
{
    private readonly SignInManager<UserEntity> _signInManager = signInManager;
    private readonly UserManager<UserEntity> _userManager = userManager;
    private readonly TokenFactory _tokenFactory = tokenFactory;

    [HttpPost]
    [Route("/register")]

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
                    if (result.Succeeded) return Ok();
                }
            }
            return BadRequest();
        }
        catch (Exception ex)
        {
            throw new Exception(ex.Message);
        }
    }

    [HttpPost]
    [Route("/login")]
    public async Task<IActionResult> LoginUser(UserModel userModel)
    {
        try
        {
            if (ModelState.IsValid)
            {
                var userEntity = await _userManager.FindByNameAsync(userModel.Username);
                if (userEntity != null)
                {
                    var result = await _signInManager.PasswordSignInAsync(userModel.Username, userModel.Password, false, false);
                    if (result.Succeeded)
                    {
                    var token = _tokenFactory.GenerateJwtToken(userEntity);
                    return Ok(new {token});
                    }
                }
                return Unauthorized("Email or password invalid.");
            }
            return BadRequest();
        }
        catch (Exception ex)
        {
            throw new Exception(ex.Message);
        }
    }
}