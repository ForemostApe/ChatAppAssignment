using ChatAppAssignment.Api.Contexts;
using ChatAppAssignment.Api.Entities;
using ChatAppAssignment.Api.Factories;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace ChatAppAssignment.Api.Extensions;

public static class AppConfigurationExtensions
{
    //Configures CORS-allowances.
    public static IServiceCollection AddCorsPolicy(this IServiceCollection services)
    {
        services.AddCors(options =>
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
        return services;
    }

    //Configures DbContext to use SQLite and retrieves connection-string from config.
    public static IServiceCollection ConfigureDbContext(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<ChatContext>(options => options.UseSqlite(configuration.GetConnectionString("DbConnection")));
        return services;
    }

    //Configures ASP.NET Identity-policies and sets up EF-connection for Identity.
    public static IServiceCollection ConfigureIdentity(this IServiceCollection services)
    {
        services.AddDefaultIdentity<UserEntity>(options =>
        {
            options.User.RequireUniqueEmail = true;
            options.SignIn.RequireConfirmedEmail = false;
            options.Password.RequiredLength = 8;

        }).AddEntityFrameworkStores<ChatContext>();
        return services;
    }

    //Configures JWT-token policies.
    public static IServiceCollection ConfigureJwtAuthentication(this IServiceCollection services, IConfiguration configuration)
    {
        //Retrieves key and issuer from UserSecret and sets up TokenFactory as a singleton-service.
        var jwtKey = configuration["Jwt:Key"];
        var jwtIssuer = configuration["Jwt:Issuer"];
        services.AddSingleton<TokenFactory>(sp => new TokenFactory(jwtKey, jwtIssuer));

        //Configures validation-requirements.
        services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
         .AddJwtBearer(options =>
        {
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = jwtIssuer,
                ValidAudience = "http://localhost:5173",
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
            };
        });
        return services;
    }

    // Configure the HTTP request pipeline.
    public static IApplicationBuilder ConfigureRequestPipeline(this IApplicationBuilder app, IWebHostEnvironment env)
    {
        if (env.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
        }
        else
        {
            app.UseExceptionHandler("/Error");
            app.UseHsts(); //Ensures HTTPS is being used.
        }

        app.UseCors("AllowSpecificOrigin"); //Enables configured CORS-policies.
        app.UseHttpsRedirection(); //Redirects HTTP-requests to HTTPS.
        app.UseAuthorization(); //Enables authorization-functionality when calling endpoints.

        return app;
    }
}
