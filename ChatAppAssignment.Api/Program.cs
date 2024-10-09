using ChatAppAssignment.Api.Extensions;
using ChatAppAssignment.Api.Hubs;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddSignalR(); 
builder.Services.AddCorsPolicy();
builder.Services.ConfigureDbContext(builder.Configuration);
builder.Services.ConfigureIdentity();
builder.Services.ConfigureJwtAuthentication(builder.Configuration);

//Implements use of UserSecrets to store connection-string etc.
if (builder.Environment.IsDevelopment())
{
    builder.Configuration.AddUserSecrets<Program>();
}

//Set Kestrel-webserver to listen to incoming traffic and redirect http to https.
builder.WebHost.ConfigureKestrel(options =>
{
    options.ListenAnyIP(5208);
    options.ListenAnyIP(7122, listenOptions =>
    {
        listenOptions.UseHttps();
    });
});

builder.Services.AddAuthentication();
builder.Services.AddAuthorization();

var app = builder.Build();

app.ConfigureRequestPipeline(builder.Environment);

app.MapControllers();

//Defines URI of chat.
app.MapHub<ChatHub>("/chat");

app.Run();
