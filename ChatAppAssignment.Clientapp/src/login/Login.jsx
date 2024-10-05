import { useState } from "react";
import "./Login.css";
import { Link } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    LoginUser();
  };

  function LoginUser() {
    console.log("Fix this later!");
  }

  return (
    <div className="container">
      <h1>Login</h1>
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
            <label htmlFor="login-password">Password</label>
          </div>
          <input
            type="password"
            id="login-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></input>
          <div>
            <button type="submit">Sign in</button>
          </div>
          <div className="register-container">
            <span>Don&apos;t have an account?</span>
            <span>
              <Link to="/register">Create one</Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
