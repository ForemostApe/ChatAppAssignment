using ChatAppAssignment.Api.Entities;
using ChatAppAssignment.Api.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ChatAppAssignment.Api.Controllers;

[ApiController]
//[Route("[controller]")]
public class AuthController(SignInManager<UserEntity> signInManager, UserManager<UserEntity> userManager) : ControllerBase
{
    private readonly SignInManager<UserEntity> _signInManager = signInManager;
    private readonly UserManager<UserEntity> _userManager = userManager;

    [HttpPost]
    [Route("register")]

    public async Task<IActionResult> RegisterNewUser(UserModel userModel)
    {
        try
        {
            if (ModelState.IsValid)
            {
                if (!await _userManager.Users.AnyAsync(x => x.Email == userModel.Email))
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
}