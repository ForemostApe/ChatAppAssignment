using ChatAppAssignment.Api.Contexts;
using ChatAppAssignment.Api.Entities;
using ChatAppAssignment.Api.Factories;
using ChatAppAssignment.Api.Hubs;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddSignalR(); //Adds SignalR to DI-container.

//Implements use of UserSecrets to store connection-string etc.
if (builder.Environment.IsDevelopment())
{
    builder.Configuration.AddUserSecrets<Program>();
}

builder.Services.AddDbContext<ChatContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DbConnection")));

//Adds Identity as a service with options to setup requirements for account-registration and to create db based on ChatContext.
builder.Services.AddDefaultIdentity<UserEntity>(options =>
{
    options.User.RequireUniqueEmail = true;
    options.SignIn.RequireConfirmedEmail = false;
    options.Password.RequiredLength = 8;

}).AddEntityFrameworkStores<ChatContext>();


//Gets the Jwt-key from Secrets and initializes the tokenfactory.
var jwtKey = builder.Configuration["Jwt:Key"];
builder.Services.AddSingleton<TokenFactory>(sp => new TokenFactory(jwtKey));

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin", policy =>
    {
        policy
            .AllowAnyMethod()
            .AllowAnyHeader()
            .WithOrigins("http://localhost:5173")
            .AllowCredentials();
    });
});

var jwtIssuer = builder.Configuration.GetSection("Jwt:Issuer").Get<string>();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtIssuer,
            ValidAudience = jwtIssuer,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
        };
    });

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.UseCors("AllowSpecificOrigin");

//Defines URI of chat.
app.MapHub<ChatHub>("/chat");

app.Run();
