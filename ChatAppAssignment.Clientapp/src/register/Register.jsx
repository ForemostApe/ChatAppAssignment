import { useState } from "react";
import "./Register.css";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    CreateUser();
  };

  const CreateUser = () => {
    const apiUrl = "https://localhost:7122/register";

    const data = {
      username,
      email,
      password,
    };

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };

    fetch(apiUrl, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Response was not OK.");
        }
        return response.json();
      })
      .then(() => {
        console.log("Registration successful!");
        window.location.href = "/";
      })
      .catch((error) => console.error("Error:", error));
  };

  return (
    <div className="container">
      <h1>Register</h1>
      <div className="form-grid">
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="login-username">Username</label>
          </div>
          <input
            id="login-username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          ></input>
          <div>
            <label htmlFor="login-email">Email</label>
          </div>
          <input
            id="login-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></input>
          <div>
            <label htmlFor="login-password">Password</label>
          </div>
          <input
            type="password"
            id="login-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></input>
          <div>
            <button type="Submit">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
