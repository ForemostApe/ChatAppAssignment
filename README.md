# ChatAppAssignment

## Introduction

A chat-app intended to apply and demonstrate the use of SignalR for full-duplex communication.

## Description

Frontend was coded in React with JavaScript and uses Vite and the signalR-client library.
The backend was built using ASP.NET Core with a SQLite-database that stores user-data and uses the Identity-API and
JWT-tokens for authentication and authorization.

## Dependencies

- Microsoft.AspNetCore.App
- Microsoft.AspNetCore.Authentication.JwtBearer (8.0.10)
- Microsoft.AspNetCore.Identity.EntityFrameworkCore (8.0.10)
- Microsoft.AspNetCore.Identity.UI (8.0.10)
- Microsoft.EntityFrameworkCore.Design (8.0.10)
- Microsoft.EntityFrameworkCore.Sqlite (8.0.10)
- Microsoft.EntityFrameworkCore.Tools (8.0.10)
- System.IdentityModel.Tokens.Jwt (8.1.2)
- @microsoft/signalr
- vite

## Installation

Everything needed to run the app should be included in the project, some minor changes in the code are needed as
documented beneath. Required NuGet-packages and libraries need to be installed.

#### Frontend

Install following packages in a terminal:

```
npm create vite@latest
npm install @microsoft/signalr@latest
dotnet dev-certs https --trust
```

#### Backend

##### Program.cs

- Adjust HTTP- and HTTPS-IP in Kestrel-config using IP's from `launchSettings.json`

#### AppConfigurationExtensions.cs

- Modify the IP for the ValidAudience so it matches your local environment.

#### TokenFactory.cs

- Modify the IP for the ValidAudience so it matches your local environment.

### Executing program

- Open ChatAppAssignment.Api-project in Visual Studio.
- Run project to start API.
- Open ChatAppAssignment.ClientApp in Visual Studio Code.
- Run `npm run dev`-command in terminal.

To login additional users, register users with individual usernames and email-addresses.
Login in incognito-windows in your browser.
